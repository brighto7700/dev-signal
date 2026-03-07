import "./globals.css";
import Script from 'next/script';
import AppShell from '@/components/AppShell';
import { JetBrains_Mono, Rajdhani } from 'next/font/google'; // 🔥 Performance: Localized Fonts

// 1. Font Optimization: This downloads fonts at build-time to Vercel
// This eliminates the 2.5s "Render Blocking" delay from Google Fonts
const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono', // This matches the var in your globals.css
});

const sans = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans', // This matches the var in your globals.css
});

export const metadata = {
  title: "Bright Emmanuel — Full-Stack Developer & Technical Writer",
  metadataBase: new URL('https://brgt.site'),
  description: "Official portfolio of Bright Emmanuel. Full-stack engineer specializing in Node.js, Go, and Python. Author at SitePoint and Dev.to.",
  alternates: {
    canonical: '/', 
  },
  openGraph: {
    title: "Bright Emmanuel",
    description: "Building the technical signal in the noise.",
    url: "https://brgt.site",
    siteName: "Bright Emmanuel",
    images: [{ url: "/og-main.png" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bright Emmanuel",
    description: "Full-stack engineer & Technical Writer.",
    images: ["https://brgt.site/og-main.png"],
    creator: "@brighto7700",
  },
};

export default function RootLayout({ children }) {
  // 2. The E-E-A-T Schema: Links your identity across all platforms
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Bright Emmanuel",
    "url": "https://brgt.site",
    "image": "https://brgt.site/og-main.png",
    "jobTitle": "Full-Stack Developer",
    "sameAs": [
      "https://github.com/brighto7700",
      "https://x.com/brighto7700",
      "https://www.linkedin.com/in/brighto7700",
      "https://dev.to/brighto7700",
      "https://www.sitepoint.com/author/bright-emmanuel"
    ],
    "knowsAbout": ["Full-Stack Development", "Node.js", "Go", "Python", "Technical Writing", "AI Development"]
  };

  return (
    <html lang="en" className={`${mono.variable} ${sans.variable}`}>
      <head>
        {/* Preconnect to external APIs to save milliseconds on mobile */}
        <link rel="preconnect" href="https://api.dicebear.com" />
        
        {/* Google Analytics - strategy="afterInteractive" ensures it doesn't block the initial render */}
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
        {/* Injecting Structured Data for the Knowledge Graph */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
