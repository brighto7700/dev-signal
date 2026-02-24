"use client";
import { useState } from "react";

// Helper functions kept for logic
function timeAgo(unixTime) {
  const diff = Date.now() / 1000 - unixTime;
  if (diff < 3600) return `${Math.round(diff / 60)}m`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h`;
  return `${Math.round(diff / 86400)}d`;
}

function getDomain(url) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch { return url; }
}

export default function StoryCard({ story, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="story-card">
      <div className="story-body">
        {/* Title: High contrast for readability */}
        <a href={story.url} target="_blank" rel="noopener noreferrer" className="story-title">
          {story.title}
        </a>

        {/* Metadata Row: Simplified dots and muted text */}
        <div className="story-meta">
          <span className="story-domain">{getDomain(story.url)}</span>
          <span className="dot">•</span>
          <span>{story.score} pts</span>
          <span className="dot">•</span>
          <span>{timeAgo(story.time)} ago</span>
          <span className="dot">•</span>
          <a href={story.hnUrl} target="_blank" rel="noopener noreferrer" className="hn-link">
            {story.descendants} comments
          </a>
        </div>

        {/* Dev Health: Modular pill design from mockup */}
        {story.github && (
          <div className="dev-health">
            <span className="health-label">DEV HEALTH</span>
            <span>★ {story.github.stars?.toLocaleString()}</span>
            <span>! {story.github.openIssues}</span>
            <span>⏱ {story.github.lastCommit}</span>
          </div>
        )}

        {/* Key Takeaways: Terminal-style dropdown */}
        {story.summary && (
          <div className="summary" style={{ marginTop: '12px' }}>
            <button 
              className="summary-toggle" 
              onClick={() => setExpanded(!expanded)}
              style={{ color: expanded ? 'var(--amber)' : 'var(--text-dim)' }}
            >
              {expanded ? "[ - ]" : "[ + ]"} TAKEAWAYS
            </button>
            {expanded && (
              <div className="summary-text" style={{ borderLeft: '1px solid var(--amber)' }}>
                {story.summary}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
            }
                      
