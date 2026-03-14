'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

const editorialIntros = {
  mobile: "Australians overpay on mobile by an average of <strong>$180 a year</strong> — usually because they signed up years ago and never looked again. The market has changed dramatically — you can now get the same network coverage for half the price. Enter what you currently pay and how much data you actually use — we'll show you every plan that beats it.",
  broadband: "NBN pricing is one of the most competitive spaces in Australia right now — but most people are still on a plan they set up at connection and haven't revisited since. <strong>Providers regularly offer 1–2 months free to new customers</strong>, which we factor into the true cost so you're not fooled by headline prices. Pick your minimum speed tier and enter your current monthly cost.",
  savings: "Most Australians have their savings in a big four bank earning well below the market rate. <strong>The difference between the best and worst savings rates right now is over 2%</strong> — on a $20,000 balance that's $400 a year. Enter your current rate and we'll show you every account paying more.",
  streaming: "The average Australian household spends over <strong>$50 a month</strong> on streaming — often across three or four services they barely use. Enter your total monthly spend and we'll show you what's cheaper, what overlaps, and whether a bundle saves you money."
}

function calcEffective(p) {
  if (!p.contract_months || p.contract_months <= 1) return p.price
  const totalCost = (p.price * (p.contract_months - (p.free_months || 0))) - ((p.discount_amount || 0) * (p.discounted_months || 0))
  return Math.round((totalCost / p.contract_months) * 100) / 100
}

function OverpayingBanner({ results, category }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (!results || results.items.length === 0) return null

  let maxSaving = 0
  if (category === 'savings') {
    const best = results.items[0]
    maxSaving = Math.round((results.balance || 10000) * (best.rate - results.userRate) / 100)
  } else {
    const cheapest = results.items[0]
    maxSaving = Math.round((results.userPrice - (cheapest.effective || cheapest.price)) * 12)
  }

  if (maxSaving <= 0) return null

  async function handleSubmit() {
    if (!email || !email.includes('@')) return
    setSubmitting(true)
    await supabase.from('email_signups').insert({
      email,
      category,
      user_price: results.userPrice || results.userRate,
      signup_type: 'both',
    })
    setSubmitted(true)
    setSubmitting(false)
  }

  return (
    <div style={{
      background: '#fff8e6',
      border: '1.5px solid #f5c518',
      borderRadius: '12px',
      padding: '1rem 1.25rem',
      marginBottom: '1.25rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: '#f5c518', display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 20h20L12 2z" fill="#7a5c00"/>
            <path d="M12 9v5M12 16v1" stroke="#7a5c00" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
         <div style={{ fontSize: '15px', fontWeight: 700, color: '#7a5c00' }}>
  {category === 'savings'
    ? <>You could be earning an extra <strong>${maxSaving.toLocaleString()}/year</strong> in interest</>
    : <>You could be overpaying by up to <strong>${maxSaving.toLocaleString()}/year</strong></>
  }
</div>
<div style={{ fontSize: '12px', color: '#9a7300', marginTop: '2px' }}>
  {category === 'savings'
    ? `${results.items.length} higher-rate account${results.items.length !== 1 ? 's' : ''} found below`
    : `${results.items.length} cheaper option${results.items.length !== 1 ? 's' : ''} found below`
  }
</div>
        </div>
      </div>

      {submitted ? (
        <div style={{
          background: '#f0faf5', border: '1px solid #a8dfc0', borderRadius: '8px',
          padding: '0.6rem 1rem', fontSize: '13px', color: '#1a6b3c', fontWeight: 600,
        }}>
          ✓ Done! We'll remind you in 12 months and send you the best deals each month.
        </div>
      ) : (
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#7a5c00', marginBottom: '7px' }}>
            Get a reminder in 12 months + our monthly best deals newsletter
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="your@email.com"
              style={{
                flex: 1, minWidth: '200px', padding: '8px 12px',
                border: '1.5px solid #d4a800', borderRadius: '8px',
                background: 'white', fontSize: '14px', fontFamily: 'inherit', outline: 'none',
              }}
            />
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                padding: '8px 18px', background: '#1a6b3c', color: 'white',
                border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700,
                cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1,
                fontFamily: 'inherit', whiteSpace: 'nowrap',
              }}
            >
              {submitting ? 'Saving...' : 'Notify me'}
            </button>
          </div>
          <div style={{ fontSize: '11px', color: '#9a7300', marginTop: '5px' }}>
            No spam. Unsubscribe any time.
          </div>
        </div>
      )}
    </div>
  )
}

export default function ComparePanel() {
  const [category, setCategory] = useState('mobile')
  const [results, setResults] = useState(null)
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  const [mobPrice, setMobPrice] = useState('')
  const [mobData, setMobData] = useState('')
  const [bbPrice, setBbPrice] = useState('')
  const [bbSpeed, setBbSpeed] = useState('50')
  const [savRate, setSavRate] = useState('')
  const [savBalance, setSavBalance] = useState('')
  const [strPrice, setStrPrice] = useState('')
  const [strType, setStrType] = useState('any')

  async function searchMobile() {
    const price = parseFloat(mobPrice)
    const data = parseFloat(mobData)
    if (!price || !data) { alert('Please enter your current price and minimum data needed.'); return }
    setLoading(true)
    const { data: plans, error } = await supabase
      .from('mobile_plans').select('*').eq('hidden', false).lt('price', price).gte('data', data)
    if (error) { console.error(error); setLoading(false); return }
    const res = plans.map(p => ({ ...p, effective: calcEffective(p) })).filter(p => p.effective < price).sort((a, b) => a.effective - b.effective)
    setResults({ items: res, type: 'mobile', userPrice: price })
    setSearched(true); setLoading(false)
  }

  async function searchBroadband() {
    const price = parseFloat(bbPrice)
    const speed = parseInt(bbSpeed)
    if (!price) { alert('Please enter your current price.'); return }
    setLoading(true)
    const { data: plans, error } = await supabase
      .from('broadband_plans').select('*').eq('hidden', false).lt('price', price).gte('speed', speed)
    if (error) { console.error(error); setLoading(false); return }
    const res = plans.map(p => ({ ...p, effective: calcEffective(p) })).filter(p => p.effective < price).sort((a, b) => a.effective - b.effective)
    setResults({ items: res, type: 'broadband', userPrice: price, speed })
    setSearched(true); setLoading(false)
  }

  async function searchSavings() {
    const rate = parseFloat(savRate)
    const balance = parseFloat(savBalance) || 10000
    if (!rate) { alert('Please enter your current interest rate.'); return }
    setLoading(true)
    const { data: accounts, error } = await supabase
      .from('savings_accounts').select('*').eq('hidden', false).gt('rate', rate).order('rate', { ascending: false })
    if (error) { console.error(error); setLoading(false); return }
    setResults({ items: accounts, type: 'savings', userRate: rate, balance })
    setSearched(true); setLoading(false)
  }

  async function searchStreaming() {
    const price = parseFloat(strPrice)
    if (!price) { alert('Please enter your current monthly streaming spend.'); return }
    setLoading(true)
    const { data: services, error } = await supabase
      .from('streaming_services').select('*').eq('hidden', false).lt('price', price)
    if (error) { console.error(error); setLoading(false); return }
    let filtered = services
    if (strType === 'entertainment') filtered = filtered.filter(s => s.tags && s.tags.includes('entertainment'))
    if (strType === 'sport') filtered = filtered.filter(s => s.tags && s.tags.includes('sport'))
    if (strType === 'kids') filtered = filtered.filter(s => s.tags && (s.tags.includes('kids') || s.tags.includes('entertainment')))
    filtered = filtered.sort((a, b) => a.price - b.price)
    setResults({ items: filtered, type: 'streaming', userPrice: price })
    setSearched(true); setLoading(false)
  }

  function handleSearch() {
    if (category === 'mobile') searchMobile()
    else if (category === 'broadband') searchBroadband()
    else if (category === 'savings') searchSavings()
    else if (category === 'streaming') searchStreaming()
  }

  const categories = [
    { id: 'mobile', label: '📱 Mobile' },
    { id: 'broadband', label: '🌐 Broadband' },
    { id: 'savings', label: '💰 Savings' },
    { id: 'streaming', label: '📺 Streaming' },
  ]

  return (
    <section style={{ background: 'var(--cream)', padding: '3rem 1rem' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {categories.map(c => (
            <button key={c.id} onClick={() => { setCategory(c.id); setResults(null); setSearched(false) }} style={{
              padding: '0.6rem 1.25rem', borderRadius: '999px', border: '2px solid',
              borderColor: category === c.id ? 'var(--brand)' : 'var(--border)',
              background: category === c.id ? 'var(--brand)' : 'white',
              color: category === c.id ? 'white' : 'var(--text)',
              fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
            }}>{c.label}</button>
          ))}
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '1.5rem', lineHeight: 1.6 }}
          dangerouslySetInnerHTML={{ __html: editorialIntros[category] }} />

        <div style={{
          background: 'white', borderRadius: '16px', padding: '1.5rem',
          border: '1.5px solid var(--border)', marginBottom: '1.5rem',
          display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end'
        }}>
          {category === 'mobile' && <>
            <div style={{ flex: 1, minWidth: '160px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>What you pay now</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                <span style={{ padding: '0 0.75rem', color: 'var(--text-light)', fontSize: '1rem', fontWeight: 700, background: '#f9f9f9' }}>$</span>
                <input type="number" value={mobPrice} onChange={e => setMobPrice(e.target.value)} placeholder="65" style={{ flex: 1, border: 'none', padding: '0.75rem 0.75rem 0.75rem 0.25rem', fontSize: '1rem', fontFamily: 'inherit', outline: 'none' }} />
                <span style={{ padding: '0 0.75rem', color: 'var(--text-light)', fontSize: '0.8rem', background: '#f9f9f9' }}>/mo</span>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: '160px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Minimum data needed</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                <input type="number" value={mobData} onChange={e => setMobData(e.target.value)} placeholder="20" style={{ flex: 1, border: 'none', padding: '0.75rem', fontSize: '1rem', fontFamily: 'inherit', outline: 'none' }} />
                <span style={{ padding: '0 0.75rem', color: 'var(--text-light)', fontSize: '0.8rem', background: '#f9f9f9' }}>GB</span>
              </div>
            </div>
          </>}

          {category === 'broadband' && <>
            <div style={{ flex: 1, minWidth: '160px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>What you pay now</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                <span style={{ padding: '0 0.75rem', color: 'var(--text-light)', fontSize: '1rem', fontWeight: 700, background: '#f9f9f9' }}>$</span>
                <input type="number" value={bbPrice} onChange={e => setBbPrice(e.target.value)} placeholder="89" style={{ flex: 1, border: 'none', padding: '0.75rem 0.75rem 0.75rem 0.25rem', fontSize: '1rem', fontFamily: 'inherit', outline: 'none' }} />
                <span style={{ padding: '0 0.75rem', color: 'var(--text-light)', fontSize: '0.8rem', background: '#f9f9f9' }}>/mo</span>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: '160px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Minimum speed</label>
              <select value={bbSpeed} onChange={e => setBbSpeed(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1.5px solid var(--border)', borderRadius: '8px', fontSize: '1rem', fontFamily: 'inherit', background: 'white' }}>
                <option value="25">Basic Evening Speed (25 Mbps)</option>
                <option value="50">Standard Evening Speed (50 Mbps)</option>
                <option value="100">Fast Evening Speed (100 Mbps)</option>
                <option value="250">Superfast (250 Mbps)</option>
                <option value="1000">Ultrafast (1 Gbps)</option>
              </select>
            </div>
          </>}

          {category === 'savings' && <>
            <div style={{ flex: 1, minWidth: '160px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your current rate</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                <input type="number" value={savRate} onChange={e => setSavRate(e.target.value)} placeholder="2.5" step="0.01" style={{ flex: 1, border: 'none', padding: '0.75rem', fontSize: '1rem', fontFamily: 'inherit', outline: 'none' }} />
                <span style={{ padding: '0 0.75rem', color: 'var(--text-light)', fontSize: '0.8rem', background: '#f9f9f9' }}>% p.a.</span>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: '160px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Balance (optional)</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                <span style={{ padding: '0 0.75rem', color: 'var(--text-light)', fontSize: '1rem', fontWeight: 700, background: '#f9f9f9' }}>$</span>
                <input type="number" value={savBalance} onChange={e => setSavBalance(e.target.value)} placeholder="10,000" style={{ flex: 1, border: 'none', padding: '0.75rem 0.75rem 0.75rem 0.25rem', fontSize: '1rem', fontFamily: 'inherit', outline: 'none' }} />
              </div>
            </div>
          </>}

          {category === 'streaming' && <>
            <div style={{ flex: 1, minWidth: '160px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monthly streaming spend</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                <span style={{ padding: '0 0.75rem', color: 'var(--text-light)', fontSize: '1rem', fontWeight: 700, background: '#f9f9f9' }}>$</span>
                <input type="number" value={strPrice} onChange={e => setStrPrice(e.target.value)} placeholder="45" style={{ flex: 1, border: 'none', padding: '0.75rem 0.75rem 0.75rem 0.25rem', fontSize: '1rem', fontFamily: 'inherit', outline: 'none' }} />
                <span style={{ padding: '0 0.75rem', color: 'var(--text-light)', fontSize: '0.8rem', background: '#f9f9f9' }}>/mo</span>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: '160px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Content type</label>
              <select value={strType} onChange={e => setStrType(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1.5px solid var(--border)', borderRadius: '8px', fontSize: '1rem', fontFamily: 'inherit', background: 'white' }}>
                <option value="any">Any</option>
                <option value="entertainment">Entertainment / Drama</option>
                <option value="sport">Sport</option>
                <option value="kids">Kids</option>
              </select>
            </div>
          </>}

          <button onClick={handleSearch} disabled={loading} style={{
            background: 'var(--accent)', color: 'white', border: 'none',
            fontFamily: 'inherit', fontSize: '1rem', fontWeight: 800,
            padding: '0.75rem 2rem', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, whiteSpace: 'nowrap',
          }}>
            {loading ? 'Searching...' : 'Find cheaper →'}
          </button>
        </div>

        {searched && results && (
          <div>
            <OverpayingBanner results={results} category={results.type} />

            {results.items.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '16px', border: '1.5px solid var(--border)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✓</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>You're already on a good deal</div>
                <div style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>We couldn't find anything cheaper that meets your requirements right now.</div>
              </div>
            ) : (
              <>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
                  {results.items.length} cheaper option{results.items.length !== 1 ? 's' : ''} found
                </p>
                {results.items.map((item, i) => (
                  <ResultRow key={item.id || i} item={item} index={i} results={results} category={results.type} />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

function ResultRow({ item, index, results, category }) {
  const isTop = index === 0
  const hasOffer = (item.free_months > 0) || (item.discounted_months > 0 && item.discount_amount > 0)
  const isBundle = item.is_bundle

  function getSaving() {
    if (category === 'savings') {
      const extra = Math.round((results.balance || 10000) * (item.rate - results.userRate) / 100)
      return `+${(item.rate - results.userRate).toFixed(2)}% p.a. · +$${extra.toLocaleString()}/yr`
    }
    const saving = Math.round((results.userPrice - (item.effective || item.price)) * 100) / 100
    return `Save $${saving}/mo · $${Math.round(saving * 12)}/yr`
  }

  function getEffectivePrice() {
    if (category === 'savings') return `${item.rate}%`
    if (category === 'streaming' && item.price === 0) return 'FREE'
    return `$${item.effective || item.price}`
  }

  function getPriceLabel() {
    if (category === 'savings') return 'p.a.'
    if (category === 'streaming' && item.price === 0) return 'no subscription'
    if (hasOffer) return 'avg/month over contract'
    return '/month'
  }

  function getOfferBreakdown() {
    if (!hasOffer) return null
    if (item.free_months > 0) {
      const paidMonths = item.contract_months - item.free_months
      return [
        { label: `Months 1–${paidMonths}`, value: `$${item.price}/mo` },
        { label: `Months ${paidMonths + 1}–${item.contract_months}`, value: 'FREE' },
        { label: 'Avg monthly cost', value: `$${item.effective}/mo`, bold: true },
      ]
    }
    if (item.discounted_months > 0 && item.discount_amount > 0) {
      const discountedPrice = item.price - item.discount_amount
      return [
        { label: `Months 1–${item.discounted_months}`, value: `$${discountedPrice}/mo` },
        { label: `Months ${item.discounted_months + 1}–${item.contract_months}`, value: `$${item.price}/mo` },
        { label: 'Avg monthly cost', value: `$${item.effective}/mo`, bold: true },
      ]
    }
    return null
  }

  const breakdown = getOfferBreakdown()

  function getTags() {
    if (category !== 'mobile' && category !== 'broadband') return null
    const tags = []
    if (category === 'mobile') {
      tags.push({ label: item.has_5g ? '5G' : '4G', type: item.has_5g ? '5g' : '4g' })
    }
    if (!item.contract_months || item.contract_months <= 1) {
      tags.push({ label: 'No lock-in', type: 'nolock' })
    } else {
      tags.push({ label: `${item.contract_months}-month contract`, type: 'contract' })
    }
    return tags
  }

  const tags = getTags()
  const tagColors = {
    '5g': { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
    '4g': { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
    'nolock': { bg: 'var(--brand-light)', color: 'var(--brand)', border: '#a8dfc0' },
    'contract': { bg: 'var(--offwhite)', color: 'var(--text-light)', border: 'var(--border)' },
  }

  return (
    <div style={{
      border: `1.5px solid ${isTop ? 'var(--brand)' : hasOffer || isBundle ? '#c4aaff' : 'var(--border)'}`,
      borderRadius: '12px', marginBottom: '0.75rem', background: 'white', overflow: 'hidden',
    }}>
      {isTop && !hasOffer && !isBundle && (
        <div style={{ background: 'var(--brand)', color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '0.35rem 1.25rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          ★ Best value — cheapest effective monthly cost
        </div>
      )}
      {(hasOffer || isBundle) && (
        <div style={{ background: 'var(--offer)', color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '0.35rem 1.25rem', letterSpacing: '0.05em' }}>
          🏷 {isBundle ? 'Bundle deal' : hasOffer && item.free_months > 0 ? `${item.free_months} months free · Avg monthly cost calculated honestly` : `$${item.discount_amount}/mo off first ${item.discounted_months} months · Avg monthly cost calculated honestly`}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: category === 'savings' ? '2fr 1fr 1.3fr auto' : '2fr 1fr 1fr 1fr 1.3fr auto',
        alignItems: 'center', padding: '1rem 1.25rem', gap: '0.75rem',
        background: isTop && !hasOffer ? 'var(--brand-light)' : 'white',
      }}>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text)' }}>{item.provider}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.15rem' }}>{item.meta || item.plan}</div>
          {item.offer && (
            <div style={{ fontSize: '0.7rem', color: '#7c3aed', marginTop: '0.2rem', fontWeight: 600 }}>🏷 {item.offer}</div>
          )}
          {category === 'savings' && item.conditions && (
            <div style={{ fontSize: '0.7rem', color: '#b45309', marginTop: '0.2rem', fontWeight: 500 }}>⚠ {item.conditions}</div>
          )}
          {tags && (
            <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
              {tags.map(tag => (
                <span key={tag.label} style={{
                  fontSize: '0.62rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '999px',
                  border: `1px solid ${tagColors[tag.type].border}`,
                  background: tagColors[tag.type].bg, color: tagColors[tag.type].color,
                }}>{tag.label}</span>
              ))}
            </div>
          )}
        </div>

        {category === 'mobile' && <>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-light)', marginBottom: '0.2rem' }}>Data</div>
            <div style={{ fontSize: '1rem', fontWeight: 800 }}>{item.data >= 999 ? 'Unlimited' : `${item.data}GB`}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-light)', marginBottom: '0.2rem' }}>Calls</div>
            <div style={{ fontSize: '1rem', fontWeight: 800 }}>Unltd</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-light)', marginBottom: '0.2rem' }}>SMS</div>
            <div style={{ fontSize: '1rem', fontWeight: 800 }}>Unltd</div>
          </div>
        </>}

        {category === 'broadband' && <>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-light)', marginBottom: '0.2rem' }}>Speed</div>
            <div style={{ fontSize: '1rem', fontWeight: 800 }}>{item.speed >= 1000 ? '1Gbps' : `${item.speed}Mbps`}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-light)', marginBottom: '0.2rem' }}>Eve. Speed</div>
            <div style={{ fontSize: '1rem', fontWeight: 800 }}>{item.eve}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-light)', marginBottom: '0.2rem' }}>Contract</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800 }}>{!item.contract_months || item.contract_months <= 1 ? 'None' : `${item.contract_months}mo`}</div>
          </div>
        </>}

        {category === 'savings' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-light)', marginBottom: '0.2rem' }}>Rate p.a.</div>
            <div style={{ fontSize: '1rem', fontWeight: 800 }}>{item.rate}%</div>
          </div>
        )}

        {category === 'streaming' && <>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-light)', marginBottom: '0.2rem' }}>Quality</div>
            <div style={{ fontSize: '1rem', fontWeight: 800 }}>{item.quality}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-light)', marginBottom: '0.2rem' }}>Screens</div>
            <div style={{ fontSize: '1rem', fontWeight: 800 }}>{item.simultaneous || '—'}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-light)', marginBottom: '0.2rem' }}>Type</div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800 }}>{item.is_bundle ? 'Bundle' : 'Single'}</div>
          </div>
        </>}

        <div style={{ textAlign: 'center' }}>
          {hasOffer && (
            <div style={{ fontSize: '0.62rem', color: '#bbb', marginBottom: '0.1rem' }}>Standard: <s>${item.price}/mo</s></div>
          )}
          {!hasOffer && <div style={{ fontSize: '0.62rem', color: 'var(--text-light)', marginBottom: '0.15rem' }}>Monthly cost</div>}
          <div style={{
            fontSize: '1.4rem', fontWeight: 800, lineHeight: 1,
            color: category === 'streaming' && item.price === 0 ? 'var(--brand)' : isTop ? 'var(--brand)' : 'var(--text)'
          }}>
            {getEffectivePrice()}
          </div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-light)' }}>{getPriceLabel()}</div>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--brand)', marginTop: '0.3rem' }}>{getSaving()}</div>
        </div>

        <button onClick={() => window.open(item.url, '_blank')} style={{
          background: 'var(--brand)', color: 'white', border: 'none',
          fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 700,
          padding: '0.75rem 1.25rem', borderRadius: '8px', cursor: 'pointer', whiteSpace: 'nowrap',
        }}>
          View plan →
        </button>
      </div>

      {breakdown && (
        <div style={{
          background: 'var(--offer-light)', borderTop: '1px solid #d8c8ff',
          padding: '0.5rem 1.25rem', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap',
        }}>
          {breakdown.map((b, i) => (
            <span key={i} style={{ fontSize: '0.7rem', color: 'var(--offer)', fontWeight: b.bold ? 700 : 500 }}>
              <strong style={{ fontWeight: 700 }}>{b.label}:</strong> {b.value}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}