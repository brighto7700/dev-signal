import { ImageResponse } from 'next/og';
import { supabase } from '@/lib/supabase';

export const runtime = 'edge';
export const alt = 'ShellSignal Daily Brief';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }) {
  const { date } = params;

  // 1. Fetch from Supabase
  const { data, error } = await supabase
    .from('daily_briefs')
    .select('summary')
    .eq('date', date)
    .single();

  // 2. Fallback text if data is missing or database connection fails
  const displaySummary = data?.summary 
    ? data.summary.substring(0, 180) + "..." 
    : "Daily technical takeaways for senior developers. Real-time signal from HN & GitHub.";

  return new ImageResponse(
    (
      <div style={{
        background: '#0a0a0a',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '60px',
        border: '10px solid #00ff41',
        fontFamily: 'monospace',
      }}>
        <div style={{ fontSize: 40, color: '#00ff41', marginBottom: 30, letterSpacing: '2px' }}>
          SHELL/SIGNAL // {date}
        </div>
        <div style={{ fontSize: 54, color: 'white', lineHeight: 1.4, display: 'flex' }}>
          {displaySummary}
        </div>
        <div style={{ position: 'absolute', bottom: 40, right: 60, fontSize: 24, color: '#444' }}>
          shellsignal.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
