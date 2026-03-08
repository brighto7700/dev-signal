import { supabase } from "@/lib/supabase";
import Link from "next/link";
import StoryCard from "@/components/StoryCard";

export const metadata = {
  title: "Shell Signal — Terminal-Style Dev Dashboard",
  description: "Real-time developer news, AI-curated briefs, and technical signals. Built for the next billion engineers.",
  openGraph: {
    siteName: "Shell Signal", // 🔥 Forces Google to show the brand name, not the URL
  },
};

export default async function HomePage() {
  // 2. Server-Side Fetching: This is faster than useEffect and better for SEO
  const { data: stories } = await supabase
    .from("stories")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(15);

  const today = new Date().toISOString().split("T")[0];

  // 3. WebSite Schema: The "Identity Card" to fix the double URL display
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Shell Signal",
    "alternateName": ["ShellSignal"],
    "url": "https://shellsignal.brgt.site",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* DAILY BRIEF CARD */}
      <Link href={`/daily-brief/${today}`} style={{ display: 'block', textDecoration: 'none' }}>
        <div className="brief-card" style={{ cursor: 'pointer' }}>
          <div className="brief-label">DAILY BRIEF</div>
          <ul className="brief-checks">
            <li><span className="check-icon">✔</span> AI Summary</li>
            <li><span className="check-icon">✔</span> AI curated list and trends</li>
          </ul>

          <div className="snippet-wrap">
            <div className="snippet-header">
              <span className="snippet-icon">📁</span>
              <span className="snippet-title-text">Daily Snippet</span>
            </div>
            <div className="snippet-body">
              <span className="c-amber">{"((<echo \"AI Summary:\\n m#sh:}:)"}</span><br/>
              &nbsp;&nbsp;<span className="c-blue">{"$(docker stats --no-stream --format"}</span> <span className="c-amber">{"\"table {{.Name}}\\t{n})"}</span><br/>
              &nbsp;&nbsp;<span className="c-dim">{";demo@stta=-]"}</span><br/>
              &nbsp;&nbsp;<span className="c-dim">{";MemUsage}}>\"(krxeonlc)"}</span><br/>
              <span className="c-dim">{"d.ckp>)"}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* TOP STORIES */}
      <div className="section-title">TOP STORIES</div>

      <div className="stories-container">
        {stories && stories.length > 0 ? (
          stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))
        ) : (
          <div style={{ color: 'var(--green)', fontFamily: 'var(--mono)', fontSize: '0.8rem', textAlign: 'center', padding: '2rem' }}>
            NO_SIGNAL_FOUND
          </div>
        )}
      </div>
    </>
  );
                }
