export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { supabase } from "@/lib/supabase";
import Link from "next/link";

// 1. Updated Metadata (Killing "The Dev Signal")
export const metadata = {
  title: "Daily Dev Brief Archive | Shell Signal",
  description: "Daily AI-generated summaries of the top developer news stories.",
  metadataBase: new URL('https://shellsignal.brgt.site'),
  openGraph: {
    siteName: "Shell Signal", 
  },
};

export default async function DailyBriefIndexPage({ searchParams }) {
  // 2. Safely await searchParams in Next.js 14/15
  const params = await searchParams;
  const query = params?.q || '';

  // 3. Build the Supabase query with your original logic
  let dbQuery = supabase
    .from("daily_briefs")
    .select("date, summary")
    .order("date", { ascending: false })
    .limit(30); // Restored your safety limit!

  // 4. Apply the search filter if a query exists
  if (query) {
    dbQuery = dbQuery.ilike('summary', `%${query}%`);
  }

  const { data: briefs } = await dbQuery;

  // 5. Schema for Google Search Bar integration
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Shell Signal",
    "url": "https://shellsignal.brgt.site"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="main">
        <p className="section-heading">DAILY DEV BRIEF · ARCHIVE</p>

        {/* 6. The Terminal Search Bar */}
        <form action="/daily-brief" method="GET" style={{ display: 'flex', gap: '8px', marginBottom: '2rem', marginTop: '1rem' }}>
          <div className="terminal-input" style={{ flex: 1, position: 'relative', background: '#000', border: '1px solid var(--border)', borderRadius: '4px', padding: '8px 12px', display: 'flex', alignItems: 'center' }}>
            <span style={{ color: 'var(--green)', fontFamily: 'var(--mono)', fontSize: '0.8rem', marginRight: '8px' }}>$ grep</span>
            <input 
              type="text" 
              name="q" 
              defaultValue={query}
              placeholder="Search archive summaries..." 
              style={{ background: 'transparent', border: 'none', color: 'var(--bright)', fontFamily: 'var(--mono)', fontSize: '0.8rem', outline: 'none', width: '100%' }}
            />
          </div>
          <button type="submit" className="gen-btn" style={{ borderRadius: '4px' }}>Execute</button>
        </form>

        {/* Search Status */}
        {query && (
          <div style={{ fontFamily: "var(--mono)", color: "var(--amber)", fontSize: "0.75rem", marginBottom: "1.5rem" }}>
            {`> FILTER: "${query}" | FOUND: ${briefs?.length || 0}`}
            <Link href="/daily-brief" style={{ color: 'var(--red)', marginLeft: '12px', textDecoration: 'underline' }}>
              [CLEAR]
            </Link>
          </div>
        )}

        {/* 7. Restored your original UI and empty state */}
        {!briefs || briefs.length === 0 ? (
          <p style={{ fontFamily: "var(--mono)", color: "var(--text-dim)", fontSize: "0.8rem" }}>
            {query ? "ERR_NO_MATCHES_FOUND" : "No briefs yet. The first one will appear tomorrow at 08:00 UTC."}
          </p>
        ) : (
          <div className="stories-list">
            {briefs.map((b) => (
              <Link
                key={b.date}
                href={`/daily-brief/${b.date}`}
                style={{ display: "block", padding: "1rem 0", borderBottom: "1px solid var(--border)", textDecoration: "none" }}
              >
                <div style={{ fontFamily: "var(--mono)", color: "var(--amber)", fontSize: "0.75rem", marginBottom: 6 }}>
                  {b.date}
                </div>
                {/* Restored your summary slice! */}
                <div style={{ color: "var(--text)", fontSize: "0.9rem", lineHeight: 1.5 }}>
                  {b.summary?.slice(0, 120)}...
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
        }              <div style={{ color: "var(--text)", fontSize: "0.9rem", lineHeight: 1.5 }}>
                {b.summary?.slice(0, 120)}...
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
    }
