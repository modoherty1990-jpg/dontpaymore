export default function CategoryGrid({ onCategoryClick }) {
  const categories = [
    { id: 'mobile', icon: '📱', name: 'Mobile Plans', desc: 'SIM-only plans across all Australian networks including all current offers', count: '30 plans tracked', live: true },
    { id: 'broadband', icon: '🌐', name: 'Home Broadband', desc: 'NBN plans across every speed tier including free month deals', count: '19 plans tracked', live: true },
    { id: 'savings', icon: '🏦', name: 'Savings Accounts', desc: 'High-interest savings rates from banks and digital fintechs', count: '11 accounts tracked', live: true },
    { id: 'streaming', icon: '📺', name: 'Streaming', desc: 'Netflix, Stan, Binge, Disney+ and more — find your cheapest bundle', count: '11 services compared', live: true },
    { id: null, icon: '💳', name: 'Credit Cards', desc: 'Annual fees, purchase rates and rewards compared honestly', live: false },
    { id: null, icon: '🚗', name: 'Car Insurance', desc: 'Comprehensive, third party and CTP cover compared', live: false },
    { id: null, icon: '🏠', name: 'Home Loans', desc: 'Variable and fixed rate mortgages across all major lenders', live: false },
    { id: null, icon: '⚡', name: 'Energy', desc: 'Electricity and gas plans compared by state and usage', live: false },
  ]

  return (
    <div style={{ marginBottom: '3.5rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Compare by category</div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>Tell us what you pay. We find something cheaper — or confirm you're already on a great deal.</div>
      </div>

      <div className="category-grid">
        {categories.map((cat) => (
          <div
            key={cat.name}
            onClick={() => cat.live && onCategoryClick(cat.id)}
            style={{
              background: 'white',
              border: '1.5px solid var(--border)',
              borderRadius: '12px',
              padding: '1.5rem 1.25rem',
              cursor: cat.live ? 'pointer' : 'default',
              opacity: cat.live ? 1 : 0.55,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { if (cat.live) { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)' }}}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <div style={{ fontSize: '2rem' }}>{cat.icon}</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{cat.name}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', lineHeight: 1.4 }}>{cat.desc}</div>
            {cat.live
              ? <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--brand)', marginTop: 'auto', paddingTop: '0.5rem' }}>{cat.count} · Updated daily</div>
              : <div style={{ fontSize: '0.65rem', fontWeight: 700, background: 'var(--offwhite)', color: 'var(--text-light)', padding: '0.2rem 0.6rem', borderRadius: '999px', border: '1px solid var(--border)', display: 'inline-block', marginTop: 'auto', width: 'fit-content' }}>Coming soon</div>
            }
          </div>
        ))}
      </div>
    </div>
  )
}