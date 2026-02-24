import { supabase } from "./supabase";

export async function summarizeWithAI(input, url = null) {
  // 1. Handle Daily Brief (Array of stories)
  if (Array.isArray(input)) {
    const briefContext = input.slice(0, 5).map(s => `- ${s.title}`).join('\n');
    
    // One-Shot Prompting: Showing it a fake example forces it to copy the layout exactly.
    const userPrompt = `You are a terminal script. NO conversational text like "Here is your summary". Copy this exact format:

EXAMPLE OUTPUT:
- Stripe reaches $159B valuation as venture capital flows.
- Diode releases new hardware programming and simulation platform.
- Firefox 148 introduces setHTML to patch XSS vulnerabilities.

### 💻 Daily Snippet
\`\`\`bash
# Find and delete all node_modules folders to free up space
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
\`\`\`

ACTUAL STORIES TO PROCESS:
${briefContext}`;

    return await callOpenRouter(
      "You output raw markdown only. No preamble. No chat.",
      userPrompt
    );
  }

  // 2. Handle Individual Story (Single title/url)
  const title = input;
  const { data: existing } = await supabase
    .from("stories")
    .select("summary")
    .eq("url", url)
    .single();

  if (existing?.summary) return existing.summary;

  const summary = await callOpenRouter(
    "You are ShellSignal AI.",
    `Write EXACTLY 3 technical, witty bullet points (under 15 words each) summarizing this title: ${title}. NO introductory text.`
  );

  if (summary) {
    await supabase.from("stories").upsert({ url, title, summary });
  }

  return summary;
}

// Internal helper to keep code clean
async function callOpenRouter(systemPrompt, userPrompt) {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://shellsignal.vercel.app",
        "X-Title": "ShellSignal", 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Routing to the best free model available
        model: "openrouter/auto:free", 
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error("AI ERROR:", error.message);
    return null;
  }
          }
