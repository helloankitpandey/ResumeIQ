// /**
//  * Edge Function: parse-resume
//  *
//  * Downloads a file from the "resumes" storage bucket, extracts its
//  * text content using the appropriate method (direct read for TXT,
//  * AI vision for PDF & DOCX), then cleans up the uploaded file.
//  *
//  * Auth:    Bearer token required
//  * Method:  POST
//  * Body:    { filePath: string }
//  * Returns: { text: string }
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
//     /* ---- Authenticate ---- */
//     const authHeader = req.headers.get("Authorization");
//     if (!authHeader) {
//       return new Response(
//         JSON.stringify({ error: "Missing authorization header" }),
//         { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
//       );
//     }

//     const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
//     const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
//     const supabase = createClient(supabaseUrl, supabaseKey);

//     const token = authHeader.replace("Bearer ", "");
//     const { data: { user }, error: userError } = await supabase.auth.getUser(token);

//     if (userError || !user) {
//       return new Response(
//         JSON.stringify({ error: "Invalid token" }),
//         { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
//       );
//     }

//     /* ---- Validate input ---- */
//     const { filePath } = await req.json();

//     if (!filePath) {
//       return new Response(
//         JSON.stringify({ error: "File path is required" }),
//         { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
//       );
//     }

//     /* ---- Download the file from storage ---- */
//     const { data: fileData, error: downloadError } = await supabase.storage
//       .from("resumes")
//       .download(filePath);

//     if (downloadError || !fileData) {
//       console.error("Download error:", downloadError);
//       return new Response(
//         JSON.stringify({ error: "Failed to download file" }),
//         { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
//       );
//     }

//     /* ---- Extract text based on file type ---- */
//     const extension = filePath.split(".").pop()?.toLowerCase();
//     let extractedText = "";

//     if (extension === "pdf") {
//       // Use AI vision to extract text from PDF pages
//       extractedText = await extractWithAI(fileData, "application/pdf");
//     } else if (extension === "txt" || extension === "md") {
//       // Plain text — read directly
//       extractedText = await fileData.text();
//     } else if (extension === "docx" || extension === "doc") {
//       // Use AI vision for Word documents
//       extractedText = await extractWithAI(
//         fileData,
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//       );
//     } else {
//       return new Response(
//         JSON.stringify({ error: "Unsupported file format. Please upload PDF, DOCX, or TXT files." }),
//         { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
//       );
//     }

//     if (!extractedText) {
//       throw new Error("No text could be extracted from the document");
//     }

//     /* ---- Clean up the temporary upload ---- */
//     await supabase.storage.from("resumes").remove([filePath]);

//     return new Response(
//       JSON.stringify({ text: extractedText }),
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

// /* ------------------------------------------------------------------ */
// /*  Helper: extract text from a binary file via the AI vision model   */
// /* ------------------------------------------------------------------ */

// /**
//  * Converts a Blob to base64 and sends it to the AI gateway for
//  * text extraction, returning the extracted content.
//  */
// async function extractWithAI(fileData: Blob, mimeType: string): Promise<string> {
//   const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
//   if (!lovableApiKey) {
//     throw new Error("LOVABLE_API_KEY is not configured");
//   }

//   // Convert file to base64 for the vision model
//   const arrayBuffer = await fileData.arrayBuffer();
//   const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

//   const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
//     method: "POST",
//     headers: {
//       "Authorization": `Bearer ${lovableApiKey}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       model: "google/gemini-2.5-flash",
//       messages: [
//         {
//           role: "user",
//           content: [
//             {
//               type: "text",
//               text: `Extract all text content from this resume document. Preserve the structure as much as possible, including:
// - Contact information (name, email, phone, location)
// - Professional summary/objective
// - Work experience (job titles, companies, dates, descriptions)
// - Education (degrees, institutions, dates)
// - Skills
// - Certifications
// - Any other relevant sections

// Return ONLY the extracted text content, formatted cleanly with section headers. Do not add any commentary.`,
//             },
//             {
//               type: "image_url",
//               image_url: { url: `data:${mimeType};base64,${base64}` },
//             },
//           ],
//         },
//       ],
//       temperature: 0.1,
//       max_tokens: 4000,
//     }),
//   });

//   // Surface rate-limit and billing errors to the client
//   if (!aiResponse.ok) {
//     if (aiResponse.status === 429) {
//       throw Object.assign(new Error("Rate limit exceeded. Please try again later."), { status: 429 });
//     }
//     if (aiResponse.status === 402) {
//       throw Object.assign(new Error("AI credits exhausted. Please add funds to continue."), { status: 402 });
//     }
//     const errorText = await aiResponse.text();
//     console.error("AI extraction error:", errorText);
//     throw new Error("Failed to extract text from document");
//   }

//   const aiData = await aiResponse.json();
//   return aiData.choices[0]?.message?.content?.trim() || "";
// }


import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function extractWithGemini(fileData: Blob, mimeType: string): Promise<string> {
  const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
  if (!geminiApiKey) throw new Error("GEMINI_API_KEY is not configured");

  const arrayBuffer = await fileData.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  let binary = "";
  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  const base64 = btoa(binary);

  const aiResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              inline_data: {
                mime_type: mimeType,
                data: base64,
              }
            },
            {
              text: `Extract all text content from this resume document. Preserve the structure including:
- Contact information (name, email, phone, location)
- Professional summary/objective
- Work experience (job titles, companies, dates, descriptions)
- Education (degrees, institutions, dates)
- Skills
- Certifications
- Any other relevant sections

Return ONLY the extracted text with section headers. No commentary.`
            }
          ]
        }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 4000 },
      }),
    }
  );

  if (!aiResponse.ok) {
    const errorText = await aiResponse.text();
    console.error("Gemini error:", errorText);
    if (aiResponse.status === 429) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }
    throw new Error("Failed to extract text from document");
  }

  const aiData = await aiResponse.json();
  return aiData.candidates[0]?.content?.parts[0]?.text?.trim() || "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    /* ---- Authenticate ---- */
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

    /* ---- Validate input ---- */
    const { filePath } = await req.json();
    if (!filePath) {
      return new Response(
        JSON.stringify({ error: "File path is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    /* ---- Download the file from storage ---- */
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("resumes")
      .download(filePath);

    if (downloadError || !fileData) {
      console.error("Download error:", downloadError);
      return new Response(
        JSON.stringify({ error: "Failed to download file" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    /* ---- Extract text based on file type ---- */
    const extension = filePath.split(".").pop()?.toLowerCase();
    let extractedText = "";

    if (extension === "txt" || extension === "md") {
      extractedText = await fileData.text();

    } else if (extension === "pdf") {
      extractedText = await extractWithGemini(fileData, "application/pdf");

    } else if (extension === "docx" || extension === "doc") {
      extractedText = await extractWithGemini(
        fileData,
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );

    } else {
      return new Response(
        JSON.stringify({ error: "Unsupported file format. Please upload PDF, DOCX, or TXT." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error("No text could be extracted from the document.");
    }

    /* ---- Clean up the temporary upload ---- */
    await supabase.storage.from("resumes").remove([filePath]);

    return new Response(
      JSON.stringify({ text: extractedText }),
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