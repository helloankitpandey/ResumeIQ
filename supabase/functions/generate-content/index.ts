// /**
//  * Edge Function: generate-content 
//  *
//  * Generates AI-powered resume content based on the requested type:
//  *   "summary" – professional summary paragraph
//  *   "bullets" – achievement bullet points for a work-experience entry
//  *   "improve" – rewrites existing text to be more impactful & ATS-friendly
//  *
//  * Auth:    Bearer token required (JWT claims validated)
//  * Method:  POST
//  * Body:    { type: string, context: object, jobDescription?: string }
//  * Returns: { content: string }
//  */

// import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
// };

// Deno.serve(async (req) => {
//   // Handle CORS preflight
//   if (req.method === "OPTIONS") {
//     return new Response(null, { headers: corsHeaders });
//   }

//   try {
//     /* ---- Authenticate via JWT claims ---- */
//     // const authHeader = req.headers.get("Authorization");
//     // if (!authHeader?.startsWith("Bearer ")) {
//     //   return new Response(
//     //     JSON.stringify({ error: "Missing authorization header" }),
//     //     { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
//     //   );
//     // }

//     // const supabase = createClient(
//     //   Deno.env.get("SUPABASE_URL")!,
//     //   Deno.env.get("SUPABASE_ANON_KEY")!,
//     //   { global: { headers: { Authorization: authHeader } } }
//     // );

//     // const token = authHeader.replace("Bearer ", "");
//     // const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
//     // if (claimsError || !claimsData?.claims) {
//     //   return new Response(
//     //     JSON.stringify({ error: "Invalid or expired token" }),
//     //     { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
//     //   );
//     // }

//     // const { data: { user }, error } = await supabase.auth.getUser();
//     // if (error || !user) {
//     //   return new Response(
//     //     JSON.stringify({ error: "Unauthorized" }),
//     //     { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
//     //   );
//     // }


//     /* ---- Validate request body ---- */
//     const { type, context, jobDescription } = await req.json();

//     if (!type || !context) {
//       return new Response(
//         JSON.stringify({ error: "Type and context are required" }),
//         { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
//       );
//     }

//     const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
//     const geminiApiKey = Deno.env.get("GEMINI_API_KEY");

//     if (!lovableApiKey && !geminiApiKey) {
//       throw new Error("Neither LOVABLE_API_KEY nor GEMINI_API_KEY is configured");
//     }

//     /* ---- Build the appropriate prompt ---- */
//     let prompt = "";

//     switch (type) {
//       case "summary":
//         prompt = `You are an expert resume writer. Generate a compelling professional summary for a resume.

// Context about the person:
// - Name: ${context.name || "Not provided"}
// - Current/Target Role: ${context.title || "Professional"}
// - Skills: ${context.skills?.join(", ") || "Not provided"}
// - Experience: ${context.experience || "Not provided"}

// ${jobDescription ? `Target Job Description:\n${jobDescription}\n\nTailor the summary to match this job description.` : ""}

// Write a 2-3 sentence professional summary that:
// 1. Highlights key strengths and experience
// 2. Uses action-oriented language
// 3. Is ATS-friendly with relevant keywords
// 4. Sounds professional but not generic

// Respond with ONLY the summary text, no quotes or additional formatting.`;
//         break;

//       case "bullets":
//         prompt = `You are an expert resume writer. Generate impactful achievement bullet points for a work experience entry.

// Job Details:
// - Title: ${context.title || "Not provided"}
// - Company: ${context.company || "Not provided"}
// - Current Description: ${context.currentDescription || "None"}

// ${jobDescription ? `Target Job Description:\n${jobDescription}\n\nTailor the bullet points to highlight relevant experience for this role.` : ""}

// Generate 3-5 achievement-focused bullet points that:
// 1. Start with strong action verbs
// 2. Include quantifiable results where possible (use realistic percentages/numbers)
// 3. Demonstrate impact and value
// 4. Are ATS-friendly with relevant keywords
// 5. Each bullet should be 1-2 lines max

// Respond with ONLY the bullet points, one per line, starting each with "• " (bullet character). No additional text or formatting.`;
//         break;

//       case "improve":
//         prompt = `You are an expert resume writer. Improve the following resume content to be more impactful and ATS-friendly.

// Original Content:
// ${context.originalText}

// ${jobDescription ? `Target Job Description:\n${jobDescription}\n\nOptimize the content to better match this job description.` : ""}

// Improve the content by:
// 1. Using stronger action verbs
// 2. Adding quantifiable metrics where appropriate
// 3. Making it more concise and impactful
// 4. Including relevant keywords for ATS systems

// Respond with ONLY the improved text, maintaining the same format as the original.`;
//         break;

//       default:
//         return new Response(
//           JSON.stringify({ error: "Invalid type. Use 'summary', 'bullets', or 'improve'" }),
//           { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
//         );
//     }

//     /* ---- Call the AI gateway or Gemini directly ---- */
//     let aiResponse;
//     let generatedContent;

//     if (lovableApiKey) {
//       // Use Lovable's AI Gateway
//       aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${lovableApiKey}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           model: "google/gemini-3-flash-preview",
//           messages: [{ role: "user", content: prompt }],
//           temperature: 0.7,
//         }),
//       });
//     } else if (geminiApiKey) {
//       // Use Google Gemini API directly
//       aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           contents: [{
//             parts: [{
//               text: prompt
//             }]
//           }],
//           generationConfig: {
//             temperature: 0.7,
//             maxOutputTokens: 2048,
//           }
//         }),
//       });
//     }

//     if (!aiResponse) {
//       throw new Error("No AI API configured");
//     }

//     if (!aiResponse.ok) {
//       if (aiResponse.status === 429) {
//         return new Response(
//           JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
//           { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
//         );
//       }
//       if (aiResponse.status === 402) {
//         return new Response(
//           JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }),
//           { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
//         );
//       }
//       const errorText = await aiResponse.text();
//       console.error("AI API error:", errorText);
//       throw new Error("Failed to generate content");
//     }

//     const aiData = await aiResponse.json();

//     if (lovableApiKey) {
//       generatedContent = aiData.choices[0]?.message?.content?.trim();
//     } else if (geminiApiKey) {
//       generatedContent = aiData.candidates[0]?.content?.parts[0]?.text?.trim();
//     }

//     if (!generatedContent) {
//       throw new Error("No content generated");
//     }

//     return new Response(
//       JSON.stringify({ content: generatedContent }),
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

// import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
// };

// Deno.serve(async (req) => {
//   if (req.method === "OPTIONS") {
//     return new Response(null, { headers: corsHeaders });
//   }

//   try {
//     /* ---- TEMPORARY: skip auth, just parse body ---- */
//     const { type, context, jobDescription } = await req.json();

//     if (!type || !context) {
//       return new Response(
//         JSON.stringify({ error: "Type and context are required" }),
//         { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
//       );
//     }

//     const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
//     console.log("Gemini key exists:", !!geminiApiKey);

//     if (!geminiApiKey) {
//       throw new Error("GEMINI_API_KEY is not configured");
//     }

//     /* ---- Build the appropriate prompt ---- */
//     let prompt = "";

//     switch (type) {
//       case "summary":
//         prompt = `You are an expert resume writer. Generate a compelling professional summary for a resume.

// Context about the person:
// - Name: ${context.name || "Not provided"}
// - Current/Target Role: ${context.title || "Professional"}
// - Skills: ${context.skills?.join(", ") || "Not provided"}
// - Experience: ${context.experience || "Not provided"}

// ${jobDescription ? `Target Job Description:\n${jobDescription}\n\nTailor the summary to match this job description.` : ""}

// Write a 2-3 sentence professional summary that:
// 1. Highlights key strengths and experience
// 2. Uses action-oriented language
// 3. Is ATS-friendly with relevant keywords
// 4. Sounds professional but not generic

// Respond with ONLY the summary text, no quotes or additional formatting.`;
//         break;

//       case "bullets":
//         prompt = `You are an expert resume writer. Generate impactful achievement bullet points for a work experience entry.

// Job Details:
// - Title: ${context.title || "Not provided"}
// - Company: ${context.company || "Not provided"}
// - Current Description: ${context.currentDescription || "None"}

// ${jobDescription ? `Target Job Description:\n${jobDescription}\n\nTailor the bullet points to highlight relevant experience for this role.` : ""}

// Generate 3-5 achievement-focused bullet points that:
// 1. Start with strong action verbs
// 2. Include quantifiable results where possible
// 3. Demonstrate impact and value
// 4. Are ATS-friendly with relevant keywords
// 5. Each bullet should be 1-2 lines max

// Respond with ONLY the bullet points, one per line, starting each with "• ". No additional text.`;
//         break;

//       case "improve":
//         prompt = `You are an expert resume writer. Improve the following resume content to be more impactful and ATS-friendly.

// Original Content:
// ${context.originalText}

// ${jobDescription ? `Target Job Description:\n${jobDescription}\n\nOptimize the content to better match this job description.` : ""}

// Improve the content by:
// 1. Using stronger action verbs
// 2. Adding quantifiable metrics where appropriate
// 3. Making it more concise and impactful
// 4. Including relevant keywords for ATS systems

// Respond with ONLY the improved text, maintaining the same format as the original.`;
//         break;

//       default:
//         return new Response(
//           JSON.stringify({ error: "Invalid type. Use 'summary', 'bullets', or 'improve'" }),
//           { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
//         );
//     }

//     /* ---- Call Gemini directly ---- */
//     const aiResponse = await fetch(
//       `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key=${geminiApiKey}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           contents: [{ parts: [{ text: prompt }] }],
//           generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
//         }),
//       }
//     );

//     if (!aiResponse.ok) {
//       const errorText = await aiResponse.text();
//       console.error("Gemini API error:", errorText);
//       if (aiResponse.status === 429) {
//         return new Response(
//           JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
//           { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
//         );
//       }
//       throw new Error("Failed to generate content");
//     }

//     const aiData = await aiResponse.json();
//     const generatedContent = aiData.candidates[0]?.content?.parts[0]?.text?.trim();

//     if (!generatedContent) {
//       throw new Error("No content generated");
//     }

//     return new Response(
//       JSON.stringify({ content: generatedContent }),
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
    const { type, context, jobDescription } = await req.json();

    if (!type || !context) {
      return new Response(
        JSON.stringify({ error: "Type and context are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const openRouterKey = Deno.env.get("OPENROUTER_API_KEY");
    if (!openRouterKey) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    /* ---- Build the appropriate prompt ---- */
    let prompt = "";

    switch (type) {
      case "summary":
        prompt = `You are an expert resume writer. Generate a compelling professional summary for a resume.

Context about the person:
- Name: ${context.name || "Not provided"}
- Current/Target Role: ${context.title || "Professional"}
- Skills: ${context.skills?.join(", ") || "Not provided"}
- Experience: ${context.experience || "Not provided"}

${jobDescription ? `Target Job Description:\n${jobDescription}\n\nTailor the summary to match this job description.` : ""}

Write a 2-3 sentence professional summary that:
1. Highlights key strengths and experience
2. Uses action-oriented language
3. Is ATS-friendly with relevant keywords
4. Sounds professional but not generic

Respond with ONLY the summary text, no quotes or additional formatting.`;
        break;

      case "bullets":
        prompt = `You are an expert resume writer. Generate impactful achievement bullet points for a work experience entry.

Job Details:
- Title: ${context.title || "Not provided"}
- Company: ${context.company || "Not provided"}
- Current Description: ${context.currentDescription || "None"}

${jobDescription ? `Target Job Description:\n${jobDescription}\n\nTailor the bullet points to highlight relevant experience for this role.` : ""}

Generate 3-5 achievement-focused bullet points that:
1. Start with strong action verbs
2. Include quantifiable results where possible
3. Demonstrate impact and value
4. Are ATS-friendly with relevant keywords
5. Each bullet should be 1-2 lines max

Respond with ONLY the bullet points, one per line, starting each with "• ". No additional text.`;
        break;

      case "improve":
        prompt = `You are an expert resume writer. Improve the following resume content to be more impactful and ATS-friendly.

Original Content:
${context.originalText}

${jobDescription ? `Target Job Description:\n${jobDescription}\n\nOptimize the content to better match this job description.` : ""}

Improve the content by:
1. Using stronger action verbs
2. Adding quantifiable metrics where appropriate
3. Making it more concise and impactful
4. Including relevant keywords for ATS systems

Respond with ONLY the improved text, maintaining the same format as the original.`;
        break;

      default:
        return new Response(
          JSON.stringify({ error: "Invalid type. Use 'summary', 'bullets', or 'improve'" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    /* ---- Call OpenRouter with fallback models ---- */
const models = [
  "nvidia/nemotron-3-super-120b-a12b:free",
  "minimax/minimax-m2.5:free",
  "qwen/qwen3.6-plus:free",
];

let aiData;
let lastError;

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
      temperature: 0.7,
    }),
  });

  if (aiResponse.ok) {
    aiData = await aiResponse.json();
    break;
  }

  lastError = await aiResponse.text();
  console.error(`Model ${model} failed:`, lastError);
}

if (!aiData) {
  throw new Error("All models failed: " + lastError);
}

const generatedContent = aiData.choices[0]?.message?.content?.trim();

    if (!generatedContent) {
      throw new Error("No content generated");
    }

    return new Response(
      JSON.stringify({ content: generatedContent }),
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