"use client";
import { useState, useEffect } from "react";
import StoryCard from "@/components/StoryCard";

export default function HomePage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchedAt, setFetchedAt] = useState(null);

  useEffect(() => {
    fetch("/api/stories")
      .then((r) => r.json())
      .then(({ stories, fetched }) => {
        setStories(stories || []);
        setFetchedAt(fetched);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const githubCount = stories.filter((s) => s.github).length;
  const avgScore =
    stories.length > 0
      ? Math.round(stories.reduce((a, s) => a + s.score, 0) / stories.length)
      : 0;

  return (
    <main className="main">
      <div className="signal-bar">
        <div className="signal-item">
          <span className="signal-label">STORIES</span>
          <span className="signal-value">{stories.length}</span>
        </div>
        <div className="signal-item">
          <span className="signal-label">GITHUB REPOS</span>
          <span className="signal-value">{githubCount}</span>
        </div>
        <div className="signal-item">
          <span className="signal-label">AVG SCORE</span>
          <span className="signal-value">{avgScore}</span>
        </div>
        <div className="signal-item">
          <span className="signal-label">UPDATED</span>
          <span className="signal-value">
            {fetchedAt ? new Date(fetchedAt).toLocaleTimeString() : "—"}
          </span>
        </div>
        <div className="signal-item">
          <span className="signal-label">SOURCE</span>
          <span className="signal-value">HN + GITHUB</span>
        </div>
      </div>

      <div className="ad-slot">
        [ CARBON ADS / BUYSELLADS SLOT — developer-targeted advertising ]
      </div>

      <p className="section-heading">TOP STORIES · RANKED BY SCORE</p>

      {loading ? (
        <div className="loading">FETCHING SIGNAL...</div>
      ) : (
        <div className="stories-list">
          {stories.map((story, i) => (
            <StoryCard key={story.id} story={story} index={i} />
          ))}
        </div>
      )}
    </main>
  );
      }
