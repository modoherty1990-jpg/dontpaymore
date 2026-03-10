export default function Hero({ onCategoryClick }) {
  const categories = [
    { id: 'mobile', label: '📱 Mobile Plans' },
    { id: 'broadband', label: '🌐 Broadband' },
    { id: 'savings', label: '🏦 Savings Accounts' },
    { id: 'streaming', label: '📺 Streaming' },
    { id: null, label: '🚗 Car Insurance', soon: true },
    { id: null, label: '🏠 Home Loans', soon: true },
  ]

  return (
    <section style={{
      background: 'linear-gradient(135deg, #1a6b3c 0%, #0f4a28 100%)',
      padding: '4rem 2rem 3rem',
      textAlign: 'center',
    }}>
      <div style={{maxWidth: '700px', margin: '0 auto'}}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'rgba(255,255,255,0.9)',
          fontSize: '0.75rem',
          fontWeight: 600,
          padding: '0.35rem 1rem',
          borderRadius: '999px',
          marginBottom: '1.5rem',
        }}>
          ✓ No paid placements. No sponsored results. Ever.
        </div>

        <h1 style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
          fontWeight: 600,
          color: 'white',
          lineHeight: 1.15,
          marginBottom: '1rem',
          letterSpacing: '-0.02em',
        }}>
          Tell us what you pay.<br />
          <em style={{color: '#7fffb2', fontStyle: 'italic'}}>We'll find something cheaper.</em>
        </h1>

        <p style={{
          color: 'rgba(255,255,255,0.75)',
          fontSize: '1rem',
          maxWidth: '520px',
          margin: '0 auto 2.5rem',
          lineHeight: 1.7,
        }}>
          Australia's only comparison site that starts with your price — not a list of products that paid to be here.
        </p>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          textAlign: 'left',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--text-light)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '1rem',
          }}>
            What do you want to compare?
          </div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
            {categories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => !cat.soon && onCategoryClick(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'var(--offwhite)',
                  border: '1.5px solid var(--border)',
                  borderRadius: '8px',
                  padding: '0.6rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: cat.soon ? '#bbb' : 'var(--text)',
                  cursor: cat.soon ? 'default' : 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {cat.label}
                {cat.soon && <span style={{fontSize: '0.7rem', fontWeight: 400}}> · Soon</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}