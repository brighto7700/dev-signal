"use client";
import { useState } from "react";

export default function TerminalBar() {
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
        // Alert is just for testing; you can later output this to a terminal UI
        alert(`Generated Command:\n\n${data.command}`);
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
          placeholder={loading ? "WORKING..." : "ask for a script..."}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
          autoFocus
        />
        <button 
          type="submit" 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--green)', 
            fontFamily: 'var(--mono)', 
            fontSize: '0.7rem', 
            cursor: 'pointer',
            opacity: loading ? 0.5 : 1
          }}
        >
          [GENERATE]
        </button>
      </form>
    </div>
  );
            }
      
