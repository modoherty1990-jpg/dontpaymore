export default function HowItWorks() {
  const steps = [
    {
      num: 1,
      title: 'Tell us what you\'re paying',
      desc: 'Enter your current monthly cost and what you need. No account required, no personal details collected.'
    },
    {
      num: 2,
      title: 'We calculate the true cost',
      desc: 'Free months and intro discounts are factored in. We compare on effective monthly cost — not misleading headline prices.'
    },
    {
      num: 3,
      title: 'Get an honest answer',
      desc: 'If something is genuinely cheaper, we show it with full working. If you\'re already on the best deal, we tell you clearly.'
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