import { getTopStories } from "@/lib/hackernews";
import { enrichWithGitHub } from "@/lib/github";
import { summarizeWithAI } from "@/lib/ai";
import { supabaseAdmin } from "@/lib/supabase";
import { publishToHashnode } from "@/lib/hashnode"; // 1. Import the utility

export const dynamic = "force-dynamic";

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const today = new Date().toISOString().split("T")[0];
    
    const { data: existing, error: checkError } = await supabaseAdmin
      .from("daily_briefs")
      .select("id")
      .eq("date", today)
      .maybeSingle(); 

    if (checkError) throw checkError;
    if (existing) return Response.json({ message: "Already generated for today" });

    const stories = await getTopStories(10);
    const enriched = await enrichWithGitHub(stories);

    console.log("Generating AI summary...");
    const summary = await summarizeWithAI(enriched);

    if (!summary) throw new Error("AI returned a null summary.");

    console.log("Saving to Supabase...");
    const { error: insertError } = await supabaseAdmin
      .from("daily_briefs")
      .insert({
        date: today,
        summary,
        top_stories: enriched, 
      });

    if (insertError) throw insertError;

    // 2. THE SYNDICATION STEP
    // We do this AFTER the save to ensure we don't post half-baked or failed data.
    console.log("Syndicating to Hashnode...");
    await publishToHashnode(`Shell Signal :: ${today}`, summary);

    return Response.json({ success: true, date: today });
  } catch (err) {
    console.error("Cron Job Failed:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
        }
