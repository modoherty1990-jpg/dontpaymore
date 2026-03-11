export default function TrustBlock() {
  const points = [
    {
      icon: '🚫',
      title: 'No paid placements',
      desc: 'Providers cannot pay to appear higher in results. Rankings are effective price only, always.'
    },
    {
      icon: '🧮',
      title: 'Offers calculated honestly',
      desc: 'Free months and intro discounts are factored into the true cost — not hidden or ignored.'
    },
    {
      icon: '✅',
      title: 'Honest "you\'re fine" results',
      desc: 'If you\'re already on a great deal, we say so. No fake urgency to switch.'
    },
  ]

  return (
   <div className="trust-grid" style={{
      background: 'linear-gradient(135deg, #1a6b3c 0%, #0f4a28 100%)',
      borderRadius: '12px',
      padding: '2.5rem',
      marginBottom: '3.5rem',
    }}>
      <div>
        <h2 style={{
          fontSize: '1.75rem',
          color: 'white',
          fontWeight: 600,
          lineHeight: 1.25,
          marginBottom: '0.75rem',
          letterSpacing: '-0.02em',
        }}>
          Built different.<br />On purpose.
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', lineHeight: 1.7 }}>
          Every other comparison site in Australia makes money when you switch. That means their results are never truly unbiased. Don't Pay More works differently — providers don't pay us for placement, ever.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {points.map(point => (
          <div key={point.title} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
            <div style={{
              width: 36, height: 36,
              background: 'rgba(255,255,255,0.12)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              flexShrink: 0,
            }}>
              {point.icon}
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'white', marginBottom: '0.2rem' }}>{point.title}</h4>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{point.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}