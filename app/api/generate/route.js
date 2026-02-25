import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://shellsignal.vercel.app",
      },
      body: JSON.stringify({
        // This is the specific model ID for the free tier of Gemini 2.0
        model: "google/gemini-2.0-flash-001", 
        messages: [
          {
            role: "system",
            content: "You are a bash script generator. Return ONLY raw code. No markdown. No text."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.1,
        top_p: 0.9
      })
    });

    const data = await response.json();

    // If we still get a credit error, return a helpful message in the UI
    if (data.error) {
      console.error("OpenRouter detailed error:", data.error);
      return NextResponse.json({ 
        command: `# API Error: ${data.error.message || "Insufficient Credits"}` 
      });
    }

    let command = data.choices[0].message.content.trim();
    
    // Final cleanup of any rogue markdown backticks
    command = command.replace(/^```(bash|sh)?\n?/i, '').replace(/```$/i, '').trim();

    return NextResponse.json({ command });

  } catch (error) {
    console.error("Vercel Function Error:", error);
    return NextResponse.json({ error: "Check Vercel Logs" }, { status: 500 });
  }
      }
