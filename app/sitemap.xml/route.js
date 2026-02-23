import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data: briefs } = await supabase
    .from("daily_briefs")
    .select("date")
    .order("date", { ascending: false });

  const dynamicEntries = briefs?.map((b) => `
    <url>
      <loc>https://dev-signal.vercel.app/daily-brief/${b.date}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>never</changefreq>
      <priority>0.7</priority>
    </url>`).join('') || '';

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://dev-signal.vercel.app</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      ${dynamicEntries}
    </urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml", // Forces the correct header
    },
  });
}
