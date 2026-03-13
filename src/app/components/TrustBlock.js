export default function TrustBlock() {
  const points = [
    {
      icon: '🚫',
      title: 'Ranked by price, nothing else',
      desc: 'No provider can pay to appear higher. The cheapest option always comes first, full stop.'
    },
    {
      icon: '🧮',
      title: 'We calculate what you actually pay',
      desc: 'Free months and intro discounts are factored in. We show the real cost, not the headline price.'
    },
    {
      icon: '✅',
      title: "We'll tell you if you're already on a good deal",
      desc: "No fake urgency. If you don't need to switch, we'll say so."
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
          Why Don't Pay More is different
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', lineHeight: 1.7 }}>
          Most money saving sites rank results based on who pays them the most. That means the best deal for them isn't always the best deal for you. We do it differently — results are always ranked by real cost, nothing else.
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