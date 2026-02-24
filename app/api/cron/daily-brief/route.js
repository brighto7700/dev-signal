import { getTopStories } from "@/lib/hackernews";
import { enrichWithGitHub } from "@/lib/github";
import { summarizeWithAI } from "@/lib/ai";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request) {
  // 1. Verify this is a legitimate cron call
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error("Cron Auth Failed");
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const today = new Date().toISOString().split("T")[0];
    console.log(`Starting cron job for: ${today}`);

    // 2. Safely check if we already ran today using maybeSingle()
    const { data: existing, error: checkError } = await supabaseAdmin
      .from("daily_briefs")
      .select("id")
      .eq("date", today)
      .maybeSingle(); 

    if (checkError) {
      console.error("Supabase Check Error:", checkError);
      throw checkError;
    }

    if (existing) {
      console.log("Brief already exists. Skipping.");
      return Response.json({ message: "Already generated for today" });
    }

    console.log("Fetching stories...");
    // 3. Fetch and enrich stories
    const stories = await getTopStories(10);
    const enriched = await enrichWithGitHub(stories);

    console.log("Generating AI summary...");
    
    // 4. Clean up the data so the AI doesn't choke on the raw JSON
    const cleanPrompt = enriched
      .map((story, index) => `${index + 1}. ${story.title}`)
      .join('\n');

    // Send only the clean text to the AI
    const summary = await summarizeWithAI(
      `Write a sharp, 3-bullet technical summary of today's top dev news based on these headlines:\n${cleanPrompt}`
    );

    if (!summary) {
       throw new Error("AI returned a null summary.");
    }

    console.log("Saving to Supabase...");
    // 5. Save to Supabase
    const { error: insertError } = await supabaseAdmin
      .from("daily_briefs")
      .insert({
        date: today,
        summary,
        top_stories: enriched, // Still saving the full rich data for the UI
      });

    if (insertError) {
      console.error("Supabase Insert Error:", insertError);
      throw insertError;
    }

    console.log("Success!");
    return Response.json({ success: true, date: today });
  } catch (err) {
    console.error("Cron Job Failed:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
