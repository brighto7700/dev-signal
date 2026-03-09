import { ImageResponse } from 'next/og';
import { supabase } from '@/lib/supabase';

export const runtime = 'edge';
export const alt = 'ShellSignal Daily Brief';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }) {
  // 🚨 1. NEXT.JS BUG FIX: Await the params object!
  const resolvedParams = await params;
  const { date } = resolvedParams;

  // 2. Fetch from Supabase
  const { data, error } = await supabase
    .from('daily_briefs')
    .select('summary')
    .eq('date', date)
    .single();

  // 3. Fallback text 
  const displaySummary = data?.summary 
    ? data.summary.substring(0, 180) + "..." 
    : "Daily technical takeaways for senior developers. Real-time signal from HN & GitHub.";

  return new ImageResponse(
    (
      <div style={{
        background: '#0b0d11', // Matches your exact terminal background
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '60px',
        border: '8px solid #39d98a', // Matches your green prompt
        // Removed fontFamily: 'monospace' for now to prevent Satori from crashing
      }}>
        <div style={{ fontSize: 40, color: '#39d98a', marginBottom: 30, letterSpacing: '2px', display: 'flex' }}>
          {`> SHELL_SIGNAL // ${date}`}
        </div>
        
        <div style={{ fontSize: 54, color: '#f8f8f2', lineHeight: 1.4, display: 'flex' }}>
          {displaySummary}
        </div>
        
        <div style={{ position: 'absolute', bottom: 40, right: 60, fontSize: 24, color: '#f0a023', display: 'flex' }}>
          https://shellsignal.brgt.site
        </div>
      </div>
    ),
    { ...size }
  );
}
