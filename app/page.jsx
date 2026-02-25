"use client";
import { useState, useEffect } from "react";
import StoryCard from "@/components/StoryCard";
import TerminalBar from "@/components/TerminalBar";

export default function HomePage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <main className="main" style={{ padding: '1.5rem 1rem' }}>
      
      {/* 1. MOCKUP HEADER & TABS */}
      <div className="mockup-header">
        <div className="mockup-title">&gt;&gt;&gt;&gt; SHELL/SIGNAL [LIVE]</div>
        <div style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}>≡</div>
      </div>
      
      <div className="mockup-date">2026-02-24</div>
      
      <div className="tab-nav">
        <div className="tab-item active">HOME</div>
        <div className="tab-item">ARCHIVE</div>
        <div className="tab-item" style={{ marginLeft: 'auto', color: 'var(--green)' }}>SCRIPTS ☁️</div>
      </div>

      {/* 2. MOCKUP DAILY BRIEF CARD */}
      <div className="mockup-brief-card">
        <div className="brief-header">DAILY BRIEF</div>
        <ul className="brief-list">
          <li><span className="check-icon">✔</span> AI Summary</li>
          <li><span className="check-icon">✔</span> AI curated list and trends</li>
        </ul>
        
        <div className="mockup-snippet-box">
          <div className="snippet-title">📁 Daily Snippet</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--green)', lineHeight: '1.4' }}>
            <span style={{ color: 'var(--amber)' }}>(console.log "matrix init")</span><br/>
            &nbsp;&nbsp;[ loading dependencies ]<br/>
            &nbsp;&nbsp;[ formatting protocol ]<br/>
            <span style={{ color: 'var(--text-dim)' }}>&gt; await system.ready()</span>
          </div>
        </div>
      </div>

      {/* 3. TOP STORIES */}
      <div style={{ color: 'var(--text-bright)', fontFamily: 'var(--sans)', fontWeight: 'bold', fontSize: '1rem', marginBottom: '1rem', letterSpacing: '0.05em' }}>
        TOP STORIES
      </div>

      {loading ? (
        <div className="loading">CONNECTING TO SATELLITE...</div>
      ) : (
        <div className="stories-list">
          {/* We slice to 5 just to keep the mobile view clean like the mockup */}
          {stories.slice(0, 5).map((story, i) => (
            <StoryCard key={story.id} story={story} index={i} />
          ))}
        </div>
      )}

      <div style={{ height: '100px' }} /> 
      <TerminalBar onResult={(cmd) => console.log(cmd)} />
    </main>
  );
          }
