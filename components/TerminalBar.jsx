"use client";
import { useState } from "react";

export default function TerminalBar({ onResult }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      
      if (data.command) {
        onResult(data.command); // Pass the command up to the Page
        setPrompt("");
      }
    } catch (err) {
      console.error("Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="terminal-bar">
      <form onSubmit={handleGenerate} style={{ display: "flex", width: "100%", alignItems: "center" }}>
        <span className="terminal-prompt">user@shell/signal:~$</span>
        <input
          type="text"
          className="terminal-input"
          placeholder={loading ? "COMPILING..." : "ask for a script..."}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
        />
        <button type="submit" style={{ display: 'none' }} />
      </form>
    </div>
  );
}
