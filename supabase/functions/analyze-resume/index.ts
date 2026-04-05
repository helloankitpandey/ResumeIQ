// /**
//  * Edge Function: analyze-resume 
//  *
//  * Accepts a resume text (and optional job description) from the client,
//  * sends it to the AI gateway for ATS analysis, saves the result to the
//  * `resume_analyses` table, and deducts one credit for free-tier users.
//  *
//  * Auth:    Bearer token required
//  * Method:  POST
//  * Body:    { resumeText: string, jobDescription?: string }
//  * Returns: Full analysis JSON (scores, checklist, suggestions, keywords)
//  */

// import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
// };

// Deno.serve(async (req) => {
//   // Handle CORS preflight requests
//   if (req.method === "OPTIONS") {
//     return new Response(null, { headers: corsHeaders });
//   }

//   try {
//     /* ---- Authenticate the request ---- */
//     const authHeader = req.headers.get("Authorization");
//     if (!authHeader) {
//       return new Response(
//         JSON.stringify({ error: "Missing authorization header" }),
//         { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
//       );
//     }

//     // Initialise a service-role client for full DB access
//     const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
//     const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
//     const supabase = createClient(supabaseUrl, supabaseKey);

//     // Validate the JWT and extract the user
//     const token = authHeader.replace("Bearer ", "");
//     const { data: { user }, error: userError } = await supabase.auth.getUser(token);

//     if (userError || !user) {
//       return new Response(
//         JSON.stringify({ error: "Invalid token" }),
//         { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
//       );
//     }

//     /* ---- Check user profile & credits ---- */
//     const { data: profile, error: profileError } = await supabase
//       .from("profiles")
//       .select("*")
//       .eq("user_id", user.id)
//       .single();

//     if (profileError || !profile) {
//       return new Response(
//         JSON.stringify({ error: "Profile not found" }),
//         { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
//       );
//     }

//     // Premium users have unlimited credits; free users must have > 0
//     if (profile.subscription_tier !== "premium" && profile.credits_remaining <= 0) {
//       return new Response(
//         JSON.stringify({ error: "No credits remaining" }),
//         { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
//       );
//     }

//     /* ---- Parse & validate request body ---- */
//     const { resumeText, jobDescription } = await req.json();

//     if (!resumeText) {
//       return new Response(
//         JSON.stringify({ error: "Resume text is required" }),
//         { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
//       );
//     }

//     /* ---- Build the AI prompt ---- */
//     const lovableApiKey = Deno.env.get("GEMINI_API_KEY"); // i change here from lovable api key to gemini api key

//     const prompt = `You are an expert resume analyzer and ATS (Applicant Tracking System) specialist. Analyze the following resume and provide detailed feedback.

// Resume:
// ${resumeText}

// ${jobDescription ? `Target Job Description:\n${jobDescription}` : "No specific job description provided - provide general feedback."}

// Analyze the resume thoroughly and respond with a JSON object containing:

// 1. "ats_score": Overall ATS compatibility score (0-100)
// 2. "keyword_match_score": How well keywords match common job requirements (0-100)
// 3. "format_score": Resume format and structure quality (0-100)
// 4. "content_score": Quality and impact of content (0-100)
// 5. "readability_score": How easy the resume is to scan quickly (0-100)
// 6. "impact_score": How well achievements are quantified with metrics (0-100)
// 7. "overall_feedback": 2-3 sentence summary of the resume's strengths and areas for improvement
// 8. "suggestions": Array of 5-7 specific, actionable improvement suggestions
// 9. "keyword_analysis": Object with "found" (array of good keywords present) and "missing" (array of important keywords that should be added)
// 10. "ats_checklist": Object with these boolean fields checking ATS compatibility:
//     - "has_contact_info": Does it have name, email, phone?
//     - "has_clear_sections": Are sections clearly labeled (Experience, Education, Skills)?
//     - "no_tables_graphics": Free of tables, images, graphics that ATS can't read?
//     - "standard_fonts": Uses standard readable fonts?
//     - "proper_date_format": Dates are in consistent, parseable format?
//     - "no_headers_footers": Important info not in headers/footers?
//     - "action_verbs": Uses strong action verbs?
//     - "quantified_achievements": Contains measurable achievements with numbers?
// 11. "strengths": Array of 3-4 specific things the resume does well
// 12. "critical_issues": Array of 1-3 most critical problems that must be fixed (empty if none)

// Respond ONLY with valid JSON, no markdown or explanation.`;

//     /* ---- Call the AI gateway ---- */
//     const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${lovableApiKey}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "google/gemini-3-flash-preview",
//         messages: [{ role: "user", content: prompt }],
//         temperature: 0.3,
//       }),
//     });

//     if (!aiResponse.ok) {
//       const errorText = await aiResponse.text();
//       console.error("AI Gateway error:", errorText);
//       throw new Error("Failed to analyze resume with AI");
//     }

//     const aiData = await aiResponse.json();
//     const analysisText = aiData.choices[0]?.message?.content;

//     if (!analysisText) {
//       throw new Error("No analysis received from AI");
//     }

//     /* ---- Parse AI JSON response ---- */
//     let analysis;
//     try {
//       // Strip any accidental markdown fences from the response
//       const cleanedText = analysisText.replace(/```json\n?|\n?```/g, "").trim();
//       analysis = JSON.parse(cleanedText);
//     } catch {
//       console.error("Failed to parse AI response:", analysisText);
//       throw new Error("Failed to parse AI analysis");
//     }

//     /* ---- Deduct credit for free-tier users ---- */
//     if (profile.subscription_tier !== "premium") {
//       await supabase
//         .from("profiles")
//         .update({ credits_remaining: profile.credits_remaining - 1 })
//         .eq("user_id", user.id);
//     }

//     /* ---- Persist analysis to database ---- */
//     await supabase.from("resume_analyses").insert({
//       user_id: user.id,
//       resume_text: resumeText,
//       job_description: jobDescription,
//       ats_score: analysis.ats_score,
//       keyword_match_score: analysis.keyword_match_score,
//       format_score: analysis.format_score,
//       content_score: analysis.content_score,
//       overall_feedback: analysis.overall_feedback,
//       suggestions: analysis.suggestions,
//       keyword_analysis: analysis.keyword_analysis,
//     });

//     return new Response(
//       JSON.stringify(analysis),
//       { headers: { ...corsHeaders, "Content-Type": "application/json" } }
//     );
//   } catch (error: unknown) {
//     console.error("Error:", error);
//     const message = error instanceof Error ? error.message : "Internal server error";
//     return new Response(
//       JSON.stringify({ error: message }),
//       { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
//     );
//   }
// });


import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    /* ---- Authenticate the request ---- */
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    /* ---- Check user profile & credits ---- */
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: "Profile not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (profile.subscription_tier !== "premium" && profile.credits_remaining <= 0) {
      return new Response(
        JSON.stringify({ error: "No credits remaining" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    /* ---- Parse & validate request body ---- */
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText) {
      return new Response(
        JSON.stringify({ error: "Resume text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    /* ---- Build the AI prompt ---- */
    const prompt = `You are an expert resume analyzer and ATS (Applicant Tracking System) specialist. Analyze the following resume and provide detailed feedback.

Resume:
${resumeText}

${jobDescription ? `Target Job Description:\n${jobDescription}` : "No specific job description provided - provide general feedback."}

Analyze the resume thoroughly and respond with a JSON object containing:

1. "ats_score": Overall ATS compatibility score (0-100)
2. "keyword_match_score": How well keywords match common job requirements (0-100)
3. "format_score": Resume format and structure quality (0-100)
4. "content_score": Quality and impact of content (0-100)
5. "readability_score": How easy the resume is to scan quickly (0-100)
6. "impact_score": How well achievements are quantified with metrics (0-100)
7. "overall_feedback": 2-3 sentence summary of the resume's strengths and areas for improvement
8. "suggestions": Array of 5-7 specific, actionable improvement suggestions
9. "keyword_analysis": Object with "found" (array of good keywords present) and "missing" (array of important keywords that should be added)
10. "ats_checklist": Object with these boolean fields checking ATS compatibility:
    - "has_contact_info": Does it have name, email, phone?
    - "has_clear_sections": Are sections clearly labeled (Experience, Education, Skills)?
    - "no_tables_graphics": Free of tables, images, graphics that ATS can't read?
    - "standard_fonts": Uses standard readable fonts?
    - "proper_date_format": Dates are in consistent, parseable format?
    - "no_headers_footers": Important info not in headers/footers?
    - "action_verbs": Uses strong action verbs?
    - "quantified_achievements": Contains measurable achievements with numbers?
11. "strengths": Array of 3-4 specific things the resume does well
12. "critical_issues": Array of 1-3 most critical problems that must be fixed (empty if none)

Respond ONLY with valid JSON, no markdown or explanation.`;

    /* ---- Call OpenRouter with fallback models ---- */
    const openRouterKey = Deno.env.get("OPENROUTER_API_KEY");
    if (!openRouterKey) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    const models = [
      "nvidia/nemotron-3-super-120b-a12b:free",
      "minimax/minimax-m2.5:free",
      "qwen/qwen3.6-plus:free",
    ];

    let analysisText: string | null = null;
    let lastError: string = "";

    for (const model of models) {
      const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openRouterKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://resume-craft-ai-alpha.vercel.app",
          "X-Title": "ResumeIQ",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
        }),
      });

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        const content = aiData.choices[0]?.message?.content?.trim();
        if (content) {
          analysisText = content;
          console.log(`Success with model: ${model}`);
          break;
        }
      }

      lastError = await aiResponse.text();
      console.error(`Model ${model} failed:`, lastError);
    }

    if (!analysisText) {
      throw new Error("All models failed: " + lastError);
    }

    /* ---- Parse AI JSON response ---- */
    let analysis;
    try {
      const cleanedText = analysisText.replace(/```json\n?|\n?```/g, "").trim();
      analysis = JSON.parse(cleanedText);
    } catch {
      console.error("Failed to parse AI response:", analysisText);
      throw new Error("Failed to parse AI analysis");
    }

    /* ---- Deduct credit for free-tier users ---- */
    if (profile.subscription_tier !== "premium") {
      await supabase
        .from("profiles")
        .update({ credits_remaining: profile.credits_remaining - 1 })
        .eq("user_id", user.id);
    }

    /* ---- Persist analysis to database ---- */
    await supabase.from("resume_analyses").insert({
      user_id: user.id,
      resume_text: resumeText,
      job_description: jobDescription,
      ats_score: analysis.ats_score,
      keyword_match_score: analysis.keyword_match_score,
      format_score: analysis.format_score,
      content_score: analysis.content_score,
      overall_feedback: analysis.overall_feedback,
      suggestions: analysis.suggestions,
      keyword_analysis: analysis.keyword_analysis,
    });

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});