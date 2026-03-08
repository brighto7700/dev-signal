import Link from "next/link";
import StoryCard from "@/components/StoryCard";

// 1. Metadata: Forces Google to show "Shell Signal" instead of the double URL
export const metadata = {
  title: "Shell Signal — Terminal-Style Dev Dashboard",
  description: "Real-time developer news, AI-curated briefs, and technical signals. Built for the next billion engineers.",
  openGraph: {
    siteName: "Shell Signal", // 🔥 Fixes the Google Search Brand Label
  },
};

export default async function HomePage() {
  // 2. Server-Side Fetching: Respects your original /api/stories logic
  // We use the absolute URL to ensure the server can reach itself during the build
  let stories = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://shellsignal.brgt.site'}/api/stories`, {
      next: { revalidate: 60 } // Cache for 1 minute for elite performance
    });
    const data = await res.json();
    stories = data.stories || [];
  } catch (error) {
    console.error("Signal Fetch Failed:", error);
  }

  const today = new Date().toISOString().split("T")[0];

  // 3. WebSite Schema: The ID card to fix the search results snippet
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
        {stories.length > 0 ? (
          stories.slice(0, 15).map((story) => (
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
