import Link from 'next/link'

export const metadata = {
  robots: {
    index: false, // Prevents Google from indexing broken links
    follow: false,
  },
}

export default function NotFound() {
  return (
    <main className="not-found-container" style={{
      padding: '100px 20px',
      textAlign: 'center',
      fontFamily: 'monospace'
    }}>
      <h2 style={{ color: '#00ff41', fontSize: '2rem' }}>[404] SIGNAL LOST</h2>
      <p style={{ color: '#888', marginBottom: '20px' }}>
        The requested brief or story could not be found in the archive.
      </p>
      <Link 
        href="/" 
        style={{ 
          color: '#00ff41', 
          textDecoration: 'underline',
          border: '1px solid #00ff41',
          padding: '10px 20px'
        }}
      >
        RETURN TO FEED
      </Link>
    </main>
  )
}
