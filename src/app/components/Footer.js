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
          All plan data sourced directly from provider websites and refreshed daily. Effective monthly costs are calculated by dividing total contract cost by contract length. Don't Pay More does not accept payment from providers for placement or ranking. Always verify plan details with the provider before switching.
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', textAlign: 'right' }}>
          <span style={{
            display: 'inline-block',
            width: 7, height: 7,
            background: 'var(--brand)',
            borderRadius: '50%',
            marginRight: '0.3rem',
            verticalAlign: 'middle',
            animation: 'blink 2s ease-in-out infinite',
          }} />
          Data live as of today<br />
          <span style={{ marginTop: '0.3rem', display: 'block' }}>dontpaymore.com.au</span>
        </div>
      </div>
    </footer>
  )
}