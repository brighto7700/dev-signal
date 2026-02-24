import { supabase } from "./supabase";

export async function summarizeWithAI(input, url = null) {
  // 1. Handle Daily Brief (Array of stories)
  if (Array.isArray(input)) {
    const briefContext = input.slice(0, 5).map(s => `- ${s.title}`).join('\n');
    
    // Forcing the instructions into the USER prompt because free models often ignore system prompts
    const userPrompt = `Here are today's top dev stories:\n${briefContext}\n\nYou MUST do exactly two things in order. Do not add any conversational filler.\n\nTask 1: Write a 3-bullet technical summary of the stories.\nTask 2: Add a section titled "### 💻 Daily Snippet" and write one highly useful, copy-pasteable terminal/bash command for developers inside a markdown code block.`;

    return await callOpenRouter(
      "You are a strict, ruthless technical AI that follows formatting instructions perfectly.",
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
