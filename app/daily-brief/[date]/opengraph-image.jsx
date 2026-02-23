import { ImageResponse } from 'next/og';
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = 'edge'; // Runs as a fast edge function
export const alt = 'Daily Dev Brief Archive';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }) {
  const { date } = await params;

  // 1. Fetch the brief from Supabase for this specific date
  const { data: brief } = await supabaseAdmin
    .from("daily_briefs")
    .select("summary, top_stories")
    .eq("date", date)
    .single();

  const title = brief?.top_stories?.[0]?.title || "Daily Dev Brief";

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0a0a0a', // Your dark background
          padding: '60px',
          border: '4px solid #1a1a1a',
        }}
      >
        <div style={{ display: 'flex', color: '#10b981', fontSize: 24, fontFamily: 'monospace', marginBottom: 20 }}>
          THE DEV/SIGNAL · {date}
        </div>
        
        <div style={{ display: 'flex', color: 'white', fontSize: 56, fontWeight: 'bold', lineHeight: 1.2, marginBottom: 30 }}>
          {title}
        </div>

        <div style={{ display: 'flex', color: '#9ca3af', fontSize: 28, lineHeight: 1.5 }}>
          {brief?.summary?.slice(0, 150)}...
        </div>

        {/* Decorative terminal cursor */}
        <div style={{ display: 'flex', width: 20, height: 40, backgroundColor: '#10b981', marginTop: 'auto' }} />
      </div>
    ),
    { ...size }
  );
        }
