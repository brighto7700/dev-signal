"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

function getDomain(url) {
  try { return new URL(url).hostname.replace("www.", ""); }
  catch { return url; }
}

export default function HomePage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
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
      {/* DAILY BRIEF CARD */}
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
        stories.slice(0, 15).map((story) => (
          <a key={story.id} href={story.url} target="_blank" rel="noopener noreferrer" className="story">
            <img 
              className="avatar" 
              src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${story.id}&backgroundColor=1a2230`} 
              alt="avatar" 
            />
            <div className="story-content">
              <div className="story-title-text">{story.title}</div>
              <div className="story-meta">{getDomain(story.url)} • {story.score} PTS</div>
            </div>
            
            {story.github ? (
              <div className="story-badge">
                <span className="badge-label">DEV HEALTH</span>
                <span className="badge-score">
                  ★ <span style={{ color: 'var(--green)', fontSize: '0.78rem' }}>
                    {story.github.stars >= 1000 ? (story.github.stars / 1000).toFixed(1) + 'k' : story.github.stars}
                  </span>
                  <span style={{ marginLeft: '4px', color: 'var(--amber)' }}>!</span> 
                  <span style={{ color: 'var(--green)', fontSize: '0.78rem', marginLeft: '2px' }}>
                    {story.github.openIssues}
                  </span>
                  <span className="badge-arrow" style={{ marginLeft: '2px' }}> ›</span>
                </span>
              </div>
            ) : (
              <div className="story-badge" style={{ opacity: 0.5 }}>
                <span className="badge-label">SIGNAL</span>
                <span className="badge-score" style={{ color: 'var(--text-dim)' }}>READ <span className="badge-arrow">›</span></span>
              </div>
            )}
          </a>
        ))
      )}
    </>
  );
                    }
