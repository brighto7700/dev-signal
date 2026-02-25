import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }

    // Call the OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://shellsignal.vercel.app", // OpenRouter likes to know who is calling
        "X-Title": "ShellSignal Dashboard",
      },
      body: JSON.stringify({
        // You can change this to any model you prefer on OpenRouter!
        // "meta-llama/llama-3-8b-instruct:free" is a great free option if needed.
        model: "google/gemini-2.5-flash", 
        messages: [
          {
            role: "system",
            content: "You are an elite DevOps engineer. The user will describe a task. You must return ONLY the raw, executable bash command or shell script to accomplish that task. DO NOT wrap the code in markdown blocks (no ```bash). DO NOT include explanations, greetings, or warnings. Output ONLY the raw code."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter Error Details:", errorText);
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();
    let command = data.choices[0].message.content.trim();

    // 🛡️ Failsafe: Just in case the AI disobeys and includes markdown backticks anyway, strip them out.
    command = command.replace(/^```(bash|sh)?\n?/i, '').replace(/```$/i, '').trim();

    return NextResponse.json({ command });

  } catch (error) {
    console.error("Failed to generate script:", error);
    return NextResponse.json({ error: "Failed to generate script" }, { status: 500 });
  }
      }
