import "./globals.css";
import Script from 'next/script';

export const metadata = {
  title: "DevTerminal — Real-Time Developer Signal & AI Daily Brief",
  description: "A sharp, terminal-style dashboard for senior developers. Live HN/GitHub trends and AI-powered technical takeaways.",
  alternates: {
    canonical: 'https://devterminal.vercel.app', // Update this to your new Vercel URL
  },
  openGraph: {
    title: "DevTerminal",
    description: "The technical signal in the noise.",
    url: "https://devterminal.vercel.app",
    siteName: "DevTerminal",
    images: [{ url: "/og-main.png" }],
  },
};

export default function RootLayout({ children }) {
  // Define Schema.org data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "The DevTerminal — Real-Time Tech Dashboard",
    "description": "A terminal-style dashboard for developers tracking Hacker News and GitHub.",
    "author": {
      "@type": "Person",
      "name": "Brighto G" // Your professional handle
    },
    "publisher": {
      "@type": "Organization",
      "name": "DevTerminal",
      "logo": {
        "@type": "ImageObject",
        "url": "https://devterminal.vercel.app/og-main.png"
      }
    }
  };

  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1RKZ4EN7EM"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1RKZ4EN7EM');
          `}
        </Script>
      </head>
      <body>
        {/* Inject Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <header className="site-header">
          <a href="/" className="logo">
            THE DEV<span>/</span>SIGNAL
          </a>
          <nav className="site-nav">
            <a href="/">FEED</a>
            <a href="/daily-brief">DAILY BRIEF</a>
          </nav>
          <div className="live-badge">
            <span className="live-dot" />
            LIVE
          </div>
        </header>

        {children}

        <footer className="site-footer">
          <p>
            THE DEV SIGNAL · Data from{" "}
            <a href="https://news.ycombinator.com" target="_blank" rel="noopener">
              Hacker News
            </a>{" "}
            &amp;{" "}
            <a href="https://github.com" target="_blank" rel="noopener">
              GitHub
            </a>{" "}
            · Summaries by Gemini Flash
          </p>
        </footer>
      </body>
    </html>
  );
}
