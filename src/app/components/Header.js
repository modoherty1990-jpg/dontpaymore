export default function Header() {
  return (
    <header style={{
      background: 'white',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 200,
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
      }}>
        <div style={{fontSize: '1.3rem', fontWeight: 800, color: 'var(--brand)', letterSpacing: '-0.03em'}}>
          don't pay <span style={{color: 'var(--accent)'}}>more</span>
        </div>
        <nav style={{display: 'flex', gap: '2rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-mid)'}}>
          <a href="#">Mobile</a>
          <a href="#">Broadband</a>
          <a href="#">Savings</a>
          <a href="#">Streaming</a>
        </nav>
      </div>
    </header>
  )
}