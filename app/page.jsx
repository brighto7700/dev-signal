"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import StoryCard from "@/components/StoryCard";

export default function HomePage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get today's date for the Daily Brief link
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetch("/api/stories")
      .then((r) => r.json())
      .then(({ stories }) => {
        setStories(stories || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      {/* DAILY BRIEF CARD - Now a massive clickable link! */}
      <Link href={`/daily-brief/${today}`} style={{ display: 'block', textDecoration: 'none' }}>
        <div className="brief-card" style={{ transition: 'transform 0.1s', cursor: 'pointer' }}>
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
            {/* JSX-safe string literals so Vercel doesn't crash! */}
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

      {loading ? (
        <div style={{ color: 'var(--green)', fontFamily: 'var(--mono)', fontSize: '0.8rem', textAlign: 'center', padding: '2rem' }}>
          CONNECTING...
        </div>
      ) : (
        /* Render exactly 15 stories using our beautiful new StoryCard component */
        stories.slice(0, 15).map((story) => (
          <StoryCard key={story.id} story={story} />
        ))
      )}
    </>
  );
}
