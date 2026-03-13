import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = "Don't Pay More — Compare & Save on Mobile, NBN, Savings & Streaming"
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #1a6b3c 0%, #0f4a28 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'rgba(255,255,255,0.9)',
          fontSize: '18px',
          fontWeight: 600,
          padding: '10px 24px',
          borderRadius: '999px',
          width: 'fit-content',
        }}>
          ✓ No paid placements. No sponsored results. Ever.
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{
            fontSize: '72px',
            fontWeight: 700,
            color: 'white',
            lineHeight: 1.1,
            letterSpacing: '-2px',
          }}>
            Stop overpaying.{' '}
            <span style={{ color: '#7fffb2', fontStyle: 'italic' }}>Start here.</span>
          </div>
          <div style={{
            fontSize: '28px',
            color: 'rgba(255,255,255,0.75)',
            lineHeight: 1.5,
            maxWidth: '800px',
          }}>
            Enter what you currently pay — we'll show you every genuinely cheaper option, or confirm you're already on a good deal.
          </div>
        </div>

        {/* Bottom row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}>
          {/* Logo */}
          <div style={{
            fontSize: '36px',
            fontWeight: 800,
            color: 'white',
          }}>
            don't pay <span style={{ color: '#ff6b2b' }}>more</span>
          </div>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {['📱 Mobile', '🌐 Broadband', '🏦 Savings', '📺 Streaming'].map(cat => (
              <div key={cat} style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '16px',
                fontWeight: 600,
                padding: '8px 18px',
                borderRadius: '8px',
              }}>
                {cat}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}