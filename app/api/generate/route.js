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
        // This is a reliable free model that won't trigger 402/Credit errors
        model: "huggingfaceh4/zephyr-7b-beta:free", 
        messages: [
          {
            role: "system",
            content: "You are a shell script generator. Return ONLY the raw bash command. No markdown backticks. No explanation."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        // Force the lowest possible token footprint
        max_tokens: 100,
        temperature: 0.1
      })
    });

    const data = await response.json();

    // Check if OpenRouter specifically rejected it for credits again
    if (data.error && data.error.code === 402) {
      return NextResponse.json({ command: "# Error: OpenRouter account needs credits even for free models. Try a different API key." });
    }

    if (!data.choices || !data.choices[0]) {
      console.error("OpenRouter Empty Response:", data);
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    let command = data.choices[0].message.content.trim();
    
    // Clean up any accidental markdown backticks
    command = command.replace(/^```(bash|sh)?\n?/i, '').replace(/```$/i, '').trim();

    return NextResponse.json({ command });

  } catch (error) {
    console.error("Critical API Failure:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
  
