export default function Footer() {
  return (
    <footer style={{
      background: 'white',
      borderTop: '1px solid var(--border)',
      padding: '2rem',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '2rem',
        flexWrap: 'wrap',
      }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--brand)' }}>
          don't pay <span style={{ color: 'var(--accent)' }}>more</span>
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', lineHeight: 1.7, maxWidth: '580px' }}>
          Plan data is sourced directly from provider websites and updated regularly. Always confirm current pricing with the provider before switching.
        </div>
      </div>
    </footer>
  )
}