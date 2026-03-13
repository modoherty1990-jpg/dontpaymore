export default function HowItWorks() {
  const steps = [
    {
      num: 1,
      title: 'Enter what you pay',
      desc: 'Just your current monthly cost and what you need. No account, no email, no personal details.'
    },
    {
      num: 2,
      title: 'We calculate the real cost',
      desc: 'Free months, intro discounts and lock-in periods are all factored in. Unlike other sites, we don\'t compare on headline price.'
    },
    {
      num: 3,
      title: 'Get a straight answer',
      desc: 'Cheaper options shown ranked by real cost, with full working. If you\'re already on the best deal available, we\'ll tell you that too.'
    },
  ]

  return (
    <div style={{ marginBottom: '3.5rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.02em' }}>How it works</div>
      </div>
      <div className="how-grid">
        {steps.map(step => (
          <div key={step.num} style={{
            background: 'white',
            border: '1.5px solid var(--border)',
            borderRadius: '12px',
            padding: '1.75rem',
          }}>
            <div style={{
              width: 36, height: 36,
              background: 'var(--brand)',
              color: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem',
              fontWeight: 800,
              marginBottom: '1rem',
            }}>
              {step.num}
            </div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.4rem' }}>{step.title}</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', lineHeight: 1.6 }}>{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}