'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
const editorialIntros = {
  mobile: "Australians overpay on mobile by an average of <strong>$180 a year</strong> — usually because they signed up years ago and never looked again. The market has changed dramatically: MVNOs like Boost, Amaysim and Circles.Life now run on the same Telstra and Optus towers as the big names, often at half the price. Enter what you currently pay and how much data you actually use — we'll show you every plan that beats it.",
  broadband: "NBN pricing is one of the most competitive spaces in Australia right now — but most people are still on a plan they set up at connection and haven't revisited since. <strong>Providers regularly offer 1–2 months free to new customers</strong>, which we factor into the true cost so you're not fooled by headline prices. Pick your minimum speed tier and enter your current monthly cost.",
  savings: "With the RBA cash rate elevated, savings account rates have risen sharply — but your bank almost certainly hasn't passed the full increase on. <strong>The gap between the best and worst savings rates in Australia is currently over 2% p.a.</strong> — on a $20,000 balance, that's $400 a year you're leaving on the table. Enter your current rate and balance.",
  streaming: "The average Australian household now spends over <strong>$50 a month on streaming</strong> — and subscription creep is real. Services that launched cheaply have steadily raised prices while most people haven't reassessed. Enter your total monthly streaming spend and what you mainly watch.",
}

const editorialFooters = {
  mobile: "<strong>Switching mobile is one of the easiest bill reductions you can make</strong> — number porting takes under 24 hours and your number comes with you. Watch out for plans with data expiry and check whether your phone is unlocked before switching networks.",
  broadband: "<strong>Evening speeds matter more than peak speeds</strong> — the headline \"NBN 100\" speed is a maximum, not a guarantee. Providers like Aussie Broadband and Superloop consistently top independent speed tests during peak hours (7–11pm). Most no-lock-in plans let you leave with 30 days notice.",
  savings: "<strong>Always read the conditions before opening a new savings account</strong> — most high rates require a monthly deposit and no withdrawals to qualify. Missing one month's condition typically drops you to the base rate for that entire month. Your money is protected under the Australian Government's Financial Claims Scheme up to $250,000.",
  streaming: "<strong>Before subscribing to a new service, check whether your existing subscriptions overlap.</strong> Disney+ includes Star content that duplicates a lot of what Binge offers. Many services also offer annual billing at a discount of up to 20% versus monthly.",
}

const panelTitles = {
  mobile: '📱 Compare Mobile Plans',
  broadband: '🌐 Compare Home Broadband',
  savings: '🏦 Compare Savings Accounts',
  streaming: '📺 Compare Streaming',
}

export default function ComparePanel({ category, onClose }) {
  const [results, setResults] = useState(null)
  const [searched, setSearched] = useState(false)

  // Mobile form state
  const [mobPrice, setMobPrice] = useState('')
  const [mobData, setMobData] = useState('')

  // Broadband form state
  const [bbPrice, setBbPrice] = useState('')
  const [bbSpeed, setBbSpeed] = useState('50')

  // Savings form state
  const [savRate, setSavRate] = useState('')
  const [savBalance, setSavBalance] = useState('')

  // Streaming form state
  const [strPrice, setStrPrice] = useState('')
  const [strType, setStrType] = useState('all')

  if (!category) return null

  const inputStyle = {
    fontFamily: 'inherit',
    fontSize: '0.95rem',
    fontWeight: 500,
    padding: '0.75rem 1rem',
    border: '1.5px solid var(--border)',
    borderRadius: '8px',
    background: 'var(--offwhite)',
    color: 'var(--text)',
    outline: 'none',
    width: '100%',
  }

  const labelStyle = {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--text-mid)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '0.4rem',
    display: 'block',
  }

  const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: '150px',
  }

  function handleSearch() {
    if (category === 'mobile') searchMobile()
    if (category === 'broadband') searchBroadband()
    if (category === 'savings') searchSavings()
    if (category === 'streaming') searchStreaming()
  }

  function calcEffective(p) {
    const contract = p.contractMonths || 1
    const free = p.freeMonths || 0
    const discMonths = p.discountedMonths || 0
    const discAmt = p.discountAmount || 0
    const paidMonths = contract - free
    const total = (p.price * paidMonths) - (discAmt * discMonths)
    return Math.round((total / contract) * 100) / 100
  }

  async function searchMobile() {
  const price = parseFloat(mobPrice)
  const data = parseFloat(mobData)
  if (!price || !data) { alert('Please enter your current price and minimum data needed.'); return }

  const { data: plans, error } = await supabase
    .from('mobile_plans')
    .select('*')
    .lt('price', price)
    .gte('data', data)

  if (error) { console.error(error); return }

  const results = plans
    .map(p => ({ ...p, effective: calcEffective(p) }))
    .filter(p => p.effective < price)
    .sort((a, b) => a.effective - b.effective)

  setResults({ items: results, type: 'mobile', userPrice: price })
  setSearched(true)
}

  async function searchBroadband() {
  const price = parseFloat(bbPrice)
  const speed = parseInt(bbSpeed)
  if (!price) { alert('Please enter your current price.'); return }

  const { data: plans, error } = await supabase
    .from('broadband_plans')
    .select('*')
    .lt('price', price)
    .gte('speed', speed)

  if (error) { console.error(error); return }

  const results = plans
    .map(p => ({ ...p, effective: calcEffective(p) }))
    .filter(p => p.effective < price)
    .sort((a, b) => a.effective - b.effective)

  setResults({ items: results, type: 'broadband', userPrice: price, speed })
  setSearched(true)
}

  async function searchSavings() {
  const rate = parseFloat(savRate)
  const balance = parseFloat(savBalance) || 10000
  if (!rate) { alert('Please enter your current interest rate.'); return }

  const { data: accounts, error } = await supabase
    .from('savings_accounts')
    .select('*')
    .gt('rate', rate)
    .order('rate', { ascending: false })

  if (error) { console.error(error); return }

  setResults({ items: accounts, type: 'savings', userRate: rate, balance })
  setSearched(true)
}

  async function searchStreaming() {
  const price = parseFloat(strPrice)
  if (!price) { alert('Please enter your current monthly streaming spend.'); return }

  const { data: services, error } = await supabase
    .from('streaming_services')
    .select('*')
    .lt('price', price)

  if (error) { console.error(error); return }

  let filtered = services
  if (strType === 'entertainment') filtered = filtered.filter(s => s.tags.includes('entertainment'))
  if (strType === 'sport') filtered = filtered.filter(s => s.tags.includes('sport'))
  if (strType === 'kids') filtered = filtered.filter(s => s.tags.includes('kids') || s.tags.includes('entertainment'))

  filtered = filtered.sort((a, b) => a.price - b.price)

  setResults({ items: filtered, type: 'streaming', userPrice: price })
  setSearched(true)
}

  return (
    <div style={{
      background: 'white',
      border: '1.5px solid var(--border)',
      borderRadius: '12px',
      overflow: 'hidden',
      marginBottom: '3.5rem',
    }}>
      {/* Header */}
      <div style={{
        background: 'var(--brand-light)',
        borderBottom: '1px solid var(--border)',
        padding: '1.25rem 1.75rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{fontSize: '1.05rem', fontWeight: 800, color: 'var(--brand)'}}>{panelTitles[category]}</div>
        <button onClick={onClose} style={{background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-light)'}}>✕</button>
      </div>

      {/* Editorial Intro */}
      <div style={{padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--border)'}}>
        <p style={{fontSize: '0.875rem', color: 'var(--text-mid)', lineHeight: 1.75, maxWidth: '720px'}}
          dangerouslySetInnerHTML={{__html: editorialIntros[category]}} />
      </div>

      {/* Form */}
      <div style={{padding: '1.75rem', display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap'}}>
        {category === 'mobile' && <>
          <div style={fieldStyle}>
            <label style={labelStyle}>What you currently pay ($/mo)</label>
            <input style={inputStyle} type="number" placeholder="e.g. 45" value={mobPrice} onChange={e => setMobPrice(e.target.value)} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Minimum data you need (GB)</label>
            <input style={inputStyle} type="number" placeholder="e.g. 20" value={mobData} onChange={e => setMobData(e.target.value)} />
          </div>
        </>}

        {category === 'broadband' && <>
          <div style={fieldStyle}>
            <label style={labelStyle}>What you currently pay ($/mo)</label>
            <input style={inputStyle} type="number" placeholder="e.g. 89" value={bbPrice} onChange={e => setBbPrice(e.target.value)} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Minimum speed tier</label>
            <select style={inputStyle} value={bbSpeed} onChange={e => setBbSpeed(e.target.value)}>
              <option value="25">NBN 25 — Basic</option>
              <option value="50">NBN 50 — Standard</option>
              <option value="100">NBN 100 — Fast</option>
              <option value="250">NBN 250 — Superfast</option>
              <option value="1000">NBN 1000 — Ultrafast</option>
            </select>
          </div>
        </>}

        {category === 'savings' && <>
          <div style={fieldStyle}>
            <label style={labelStyle}>Your current interest rate (% p.a.)</label>
            <input style={inputStyle} type="number" placeholder="e.g. 4.50" step="0.01" value={savRate} onChange={e => setSavRate(e.target.value)} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Your balance (for $ comparison)</label>
            <input style={inputStyle} type="number" placeholder="e.g. 10000" value={savBalance} onChange={e => setSavBalance(e.target.value)} />
          </div>
        </>}

        {category === 'streaming' && <>
          <div style={fieldStyle}>
            <label style={labelStyle}>Your total monthly streaming spend ($/mo)</label>
            <input style={inputStyle} type="number" placeholder="e.g. 45" value={strPrice} onChange={e => setStrPrice(e.target.value)} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>What do you mainly watch?</label>
            <select style={inputStyle} value={strType} onChange={e => setStrType(e.target.value)}>
              <option value="all">Everything — shows, movies, sport, kids</option>
              <option value="entertainment">Shows & movies only</option>
              <option value="sport">Sport essential</option>
              <option value="kids">Kids content essential</option>
            </select>
          </div>
        </>}

        <button onClick={handleSearch} style={{
          background: 'var(--brand)',
          color: 'white',
          border: 'none',
          fontFamily: 'inherit',
          fontSize: '0.9rem',
          fontWeight: 700,
          padding: '0.75rem 2rem',
          borderRadius: '8px',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>
          Find cheaper →
        </button>
      </div>

      {/* Results */}
      {searched && (
        <div style={{padding: '0 1.75rem 1.75rem'}}>
          <div style={{borderTop: '1px solid var(--border)', padding: '1rem 0', marginBottom: '0.75rem'}}>
            <strong style={{fontSize: '0.875rem'}}>
              {results.items.length
                ? `${results.items.length} cheaper option${results.items.length !== 1 ? 's' : ''} found`
                : category === 'savings' ? "You're on a great rate." : "You're on a great deal."
              }
            </strong>
          </div>

          {results.items.length === 0 && (
            <div style={{
              border: '2px solid var(--brand)',
              borderRadius: '12px',
              padding: '2.5rem 2rem',
              textAlign: 'center',
              background: 'var(--brand-light)',
            }}>
              <div style={{width: 56, height: 56, background: 'var(--brand)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem', color: 'white'}}>✓</div>
              <div style={{fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand)', marginBottom: '0.5rem'}}>Nothing better found in market.</div>
              <div style={{fontSize: '0.875rem', color: 'var(--text-mid)', lineHeight: 1.7}}>We checked every plan in our database and couldn't find anything that beats yours. You're already on a competitive deal.</div>
            </div>
          )}

          {results.items.map((item, i) => (
            <ResultRow key={i} item={item} index={i} results={results} category={category} />
          ))}

          {/* Editorial Footer */}
          <div style={{
            marginTop: '1.25rem',
            background: 'var(--offwhite)',
            border: '1.5px solid var(--border)',
            borderRadius: '8px',
            padding: '1rem 1.25rem',
          }}>
            <div style={{fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--brand)', marginBottom: '0.4rem'}}>💡 Good to know</div>
            <p style={{fontSize: '0.82rem', color: 'var(--text-mid)', lineHeight: 1.7}}
              dangerouslySetInnerHTML={{__html: editorialFooters[category]}} />
          </div>
        </div>
      )}
    </div>
  )
}

function ResultRow({ item, index, results, category }) {
  const isTop = index === 0
  const hasOffer = (item.freeMonths > 0) || (item.discountedMonths > 0 && item.discountAmount > 0)
  const isBundle = item.isBundle

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
    if (item.freeMonths > 0) {
      const paidMonths = item.contractMonths - item.freeMonths
      return [
        { label: `Months 1–${paidMonths}`, value: `$${item.price}/mo` },
        { label: `Months ${paidMonths + 1}–${item.contractMonths}`, value: 'FREE' },
        { label: 'Avg monthly cost', value: `$${item.effective}/mo`, bold: true },
      ]
    }
    if (item.discountedMonths > 0 && item.discountAmount > 0) {
      const discountedPrice = item.price - item.discountAmount
      const remainingMonths = item.contractMonths - item.discountedMonths
      return [
        { label: `Months 1–${item.discountedMonths}`, value: `$${discountedPrice}/mo` },
        { label: `Months ${item.discountedMonths + 1}–${item.contractMonths}`, value: `$${item.price}/mo` },
        { label: 'Avg monthly cost', value: `$${item.effective}/mo`, bold: true },
      ]
    }
    return null
  }

  const breakdown = getOfferBreakdown()

  // Network/contract tags for mobile and broadband
  function getTags() {
    if (category !== 'mobile' && category !== 'broadband') return null
    const tags = []
    if (category === 'mobile') {
      // Simple heuristic — bigger networks tend to have 5G
      const has5g = ['Telstra','Optus','Vodafone','Boost Mobile','Belong','Felix Mobile'].includes(item.provider)
      tags.push({ label: has5g ? '5G' : '4G', type: has5g ? '5g' : '4g' })
    }
    if (!item.contractMonths || item.contractMonths <= 1) {
      tags.push({ label: 'No lock-in', type: 'nolock' })
    } else {
      tags.push({ label: `${item.contractMonths}-month contract`, type: 'contract' })
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
      borderRadius: '12px',
      marginBottom: '0.75rem',
      background: 'white',
      overflow: 'hidden',
    }}>
      {/* Banner */}
      {isTop && !hasOffer && !isBundle && (
        <div style={{background: 'var(--brand)', color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '0.35rem 1.25rem', letterSpacing: '0.05em', textTransform: 'uppercase'}}>
          ★ Best value — cheapest effective monthly cost
        </div>
      )}
      {(hasOffer || isBundle) && (
        <div style={{background: 'var(--offer)', color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '0.35rem 1.25rem', letterSpacing: '0.05em'}}>
          🏷 {isBundle ? 'Bundle deal' : hasOffer && item.freeMonths > 0 ? `${item.freeMonths} months free · Avg monthly cost calculated honestly` : `$${item.discountAmount}/mo off first ${item.discountedMonths} months · Avg monthly cost calculated honestly`}
        </div>
      )}

      {/* Main row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: category === 'savings' ? '2fr 1fr 1.3fr auto' : '2fr 1fr 1fr 1fr 1.3fr auto',
        alignItems: 'center',
        padding: '1rem 1.25rem',
        gap: '0.75rem',
        background: isTop && !hasOffer ? 'var(--brand-light)' : 'white',
      }}>
        {/* Provider */}
        <div>
          <div style={{fontSize: '1rem', fontWeight: 800, color: 'var(--text)'}}>{item.provider}</div>
          <div style={{fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.15rem'}}>{item.meta || item.plan}</div>
          {category === 'savings' && item.conditions && (
            <div style={{fontSize: '0.7rem', color: '#b45309', marginTop: '0.2rem', fontWeight: 500}}>⚠ {item.conditions}</div>
          )}
          {tags && (
            <div style={{display: 'flex', gap: '0.3rem', marginTop: '0.35rem', flexWrap: 'wrap'}}>
              {tags.map(tag => (
                <span key={tag.label} style={{
                  fontSize: '0.62rem', fontWeight: 700,
                  padding: '0.15rem 0.5rem', borderRadius: '999px',
                  border: `1px solid ${tagColors[tag.type].border}`,
                  background: tagColors[tag.type].bg,
                  color: tagColors[tag.type].color,
                }}>
                  {tag.label}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        {category === 'mobile' && <>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-light)', marginBottom: '0.2rem'}}>Data</div>
            <div style={{fontSize: '1rem', fontWeight: 800}}>{item.data >= 999 ? 'Unlimited' : `${item.data}GB`}</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-light)', marginBottom: '0.2rem'}}>Calls</div>
            <div style={{fontSize: '1rem', fontWeight: 800}}>Unltd</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-light)', marginBottom: '0.2rem'}}>SMS</div>
            <div style={{fontSize: '1rem', fontWeight: 800}}>Unltd</div>
          </div>
        </>}

        {category === 'broadband' && <>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-light)', marginBottom: '0.2rem'}}>Speed</div>
            <div style={{fontSize: '1rem', fontWeight: 800}}>{item.speed >= 1000 ? '1Gbps' : `${item.speed}Mbps`}</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-light)', marginBottom: '0.2rem'}}>Eve. Speed</div>
            <div style={{fontSize: '1rem', fontWeight: 800}}>{item.eve}</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-light)', marginBottom: '0.2rem'}}>Contract</div>
            <div style={{fontSize: '0.82rem', fontWeight: 800}}>{!item.contractMonths || item.contractMonths <= 1 ? 'None' : `${item.contractMonths}mo`}</div>
          </div>
        </>}

        {category === 'savings' && <>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-light)', marginBottom: '0.2rem'}}>Rate p.a.</div>
            <div style={{fontSize: '1rem', fontWeight: 800}}>{item.rate}%</div>
          </div>
        </>}

        {category === 'streaming' && <>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-light)', marginBottom: '0.2rem'}}>Quality</div>
            <div style={{fontSize: '1rem', fontWeight: 800}}>{item.quality}</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-light)', marginBottom: '0.2rem'}}>Screens</div>
            <div style={{fontSize: '1rem', fontWeight: 800}}>{item.simultaneous || '—'}</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-light)', marginBottom: '0.2rem'}}>Type</div>
            <div style={{fontSize: '0.78rem', fontWeight: 800}}>{item.isBundle ? 'Bundle' : 'Single'}</div>
          </div>
        </>}

        {/* Price */}
        <div style={{textAlign: 'center'}}>
          {hasOffer && (
            <div style={{fontSize: '0.62rem', color: '#bbb', marginBottom: '0.1rem'}}>Standard: <s>${item.price}/mo</s></div>
          )}
          {!hasOffer && <div style={{fontSize: '0.62rem', color: 'var(--text-light)', marginBottom: '0.15rem'}}>Monthly cost</div>}
          <div style={{
            fontSize: '1.4rem', fontWeight: 800, lineHeight: 1,
            color: category === 'streaming' && item.price === 0 ? 'var(--brand)' : isTop ? 'var(--brand)' : 'var(--text)'
          }}>
            {getEffectivePrice()}
          </div>
          <div style={{fontSize: '0.62rem', color: 'var(--text-light)'}}>{getPriceLabel()}</div>
          <div style={{fontSize: '0.7rem', fontWeight: 700, color: 'var(--brand)', marginTop: '0.3rem'}}>{getSaving()}</div>
        </div>

        {/* CTA */}
        <button
          onClick={() => window.open(item.url, '_blank')}
          style={{
            background: 'var(--brand)', color: 'white', border: 'none',
            fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 700,
            padding: '0.75rem 1.25rem', borderRadius: '8px', cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}>
          View plan →
        </button>
      </div>

      {/* Offer breakdown row */}
      {breakdown && (
        <div style={{
          background: 'var(--offer-light)',
          borderTop: '1px solid #d8c8ff',
          padding: '0.5rem 1.25rem',
          display: 'flex',
          gap: '2rem',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
          {breakdown.map((item, i) => (
            <span key={i} style={{fontSize: '0.7rem', color: 'var(--offer)', fontWeight: item.bold ? 700 : 500}}>
              <strong style={{fontWeight: 700}}>{item.label}:</strong> {item.value}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}// ── DATA ─────────────────────────────────────────────────────────────────────

const mobilePlans = [
  {provider:"Telstra",meta:"Large network, best regional coverage",price:58,data:20,contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://telstra.com.au"},
  {provider:"Telstra",meta:"Large network, best regional coverage",price:68,data:40,contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://telstra.com.au"},
  {provider:"Telstra",meta:"Large network, best regional coverage",price:88,data:60,contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://telstra.com.au"},
  {provider:"Optus",meta:"Strong metro and suburban coverage",price:49,data:20,contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://optus.com.au"},
  {provider:"Optus",meta:"Strong metro and suburban coverage",price:59,data:40,contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://optus.com.au"},
  {provider:"Optus",meta:"Strong metro and suburban coverage",price:79,data:100,contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://optus.com.au"},
  {provider:"Vodafone",meta:"Good metro coverage",price:45,data:20,contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://vodafone.com.au"},
  {provider:"Vodafone",meta:"Good metro coverage",price:55,data:40,contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://vodafone.com.au"},
  {provider:"Belong",meta:"Runs on Telstra network",price:28,data:14,contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://belong.com.au"},
  {provider:"Belong",meta:"Runs on Telstra network",price:38,data:25,contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://belong.com.au"},
  {provider:"Boost Mobile",meta:"Runs on Telstra network · Best value Telstra MVNO",price:23,data:15,contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://boost.com.au"},
  {provider:"Boost Mobile",meta:"Runs on Telstra network · Best value Telstra MVNO",price:30,data:25,contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://boost.com.au"},
  {provider:"Boost Mobile",meta:"Runs on Telstra network · Best value Telstra MVNO",price:40,data:60,contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://boost.com.au"},
  {provider:"Amaysim",meta:"Runs on Optus network",price:18,data:8,contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://amaysim.com.au"},
  {provider:"Amaysim",meta:"Runs on Optus network",price:25,data:20,contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://amaysim.com.au"},
  {provider:"Amaysim",meta:"Runs on Optus network",price:35,data:40,contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://amaysim.com.au"},
  {provider:"Woolworths Mobile",meta:"Runs on Telstra network · Everyday Rewards points",price:20,data:10,contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://woolworthsmobile.com.au"},
  {provider:"Woolworths Mobile",meta:"Runs on Telstra network · Everyday Rewards points",price:30,data:30,contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://woolworthsmobile.com.au"},
  {provider:"Aldi Mobile",meta:"Runs on Telstra network",price:15,data:8,contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://aldimobile.com.au"},
  {provider:"Aldi Mobile",meta:"Runs on Telstra network",price:20,data:15,contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://aldimobile.com.au"},
  {provider:"Circles.Life",meta:"Runs on Optus network · Highly customisable",price:18,data:8,contractMonths:6,freeMonths:3,discountedMonths:0,discountAmount:0,url:"https://circles.life/au"},
  {provider:"Circles.Life",meta:"Runs on Optus network · Highly customisable",price:28,data:30,contractMonths:6,freeMonths:3,discountedMonths:0,discountAmount:0,url:"https://circles.life/au"},
  {provider:"Lebara",meta:"Runs on Vodafone network · Great for international calls",price:14,data:5,contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://lebara.com.au"},
  {provider:"Lebara",meta:"Runs on Vodafone network · Great for international calls",price:24,data:20,contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://lebara.com.au"},
  {provider:"Tangerine",meta:"Runs on Telstra network",price:18,data:15,contractMonths:12,freeMonths:0,discountedMonths:6,discountAmount:10,url:"https://tangerine.com.au"},
  {provider:"Tangerine",meta:"Runs on Telstra network",price:28,data:35,contractMonths:12,freeMonths:0,discountedMonths:6,discountAmount:10,url:"https://tangerine.com.au"},
  {provider:"Kogan Mobile",meta:"Runs on Vodafone network",price:15,data:8,contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://kogan.com/au/kogan-mobile"},
  {provider:"Kogan Mobile",meta:"Runs on Vodafone network",price:22,data:20,contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://kogan.com/au/kogan-mobile"},
  {provider:"Felix Mobile",meta:"Runs on Optus network · Carbon neutral",price:35,data:999,contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://felix.com.au"},
  {provider:"Spintel",meta:"Runs on Optus network",price:19,data:15,contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://spintel.net.au"},
]

const broadbandPlans = [
  {provider:"Aussie Broadband",meta:"Top-rated for customer service",price:69,speed:50,eve:"47 Mbps",contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://aussiebroadband.com.au"},
  {provider:"Aussie Broadband",meta:"Top-rated for customer service",price:89,speed:100,eve:"95 Mbps",contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://aussiebroadband.com.au"},
  {provider:"Superloop",meta:"Fast evening speeds",price:69,speed:50,eve:"47 Mbps",contractMonths:12,freeMonths:2,discountedMonths:0,discountAmount:0,url:"https://superloop.com"},
  {provider:"Superloop",meta:"Fast evening speeds",price:79,speed:100,eve:"90 Mbps",contractMonths:12,freeMonths:2,discountedMonths:0,discountAmount:0,url:"https://superloop.com"},
  {provider:"Tangerine",meta:"Budget-friendly with intro discount",price:54,speed:50,eve:"45 Mbps",contractMonths:18,freeMonths:0,discountedMonths:6,discountAmount:20,url:"https://tangerine.com.au"},
  {provider:"Tangerine",meta:"Budget-friendly with intro discount",price:64,speed:100,eve:"88 Mbps",contractMonths:18,freeMonths:0,discountedMonths:6,discountAmount:20,url:"https://tangerine.com.au"},
  {provider:"TPG",meta:"No lock-in, reliable network",price:59,speed:25,eve:"22 Mbps",contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://tpg.com.au"},
  {provider:"TPG",meta:"No lock-in, reliable network",price:69,speed:50,eve:"46 Mbps",contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://tpg.com.au"},
  {provider:"TPG",meta:"No lock-in, reliable network",price:79,speed:100,eve:"91 Mbps",contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://tpg.com.au"},
  {provider:"Exetel",meta:"1 month free on 12-month contract",price:59,speed:50,eve:"45 Mbps",contractMonths:12,freeMonths:1,discountedMonths:0,discountAmount:0,url:"https://exetel.com.au"},
  {provider:"Exetel",meta:"1 month free on 12-month contract",price:69,speed:100,eve:"87 Mbps",contractMonths:12,freeMonths:1,discountedMonths:0,discountAmount:0,url:"https://exetel.com.au"},
  {provider:"Dodo",meta:"Budget option, no lock-in",price:55,speed:25,eve:"20 Mbps",contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://dodo.com"},
  {provider:"Dodo",meta:"Budget option, no lock-in",price:65,speed:50,eve:"44 Mbps",contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://dodo.com"},
  {provider:"Belong",meta:"Telstra-owned, simple plans",price:65,speed:25,eve:"22 Mbps",contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://belong.com.au"},
  {provider:"Belong",meta:"Telstra-owned, simple plans",price:75,speed:50,eve:"46 Mbps",contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://belong.com.au"},
  {provider:"Spintel",meta:"Budget-friendly, no lock-in",price:49,speed:25,eve:"21 Mbps",contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://spintel.net.au"},
  {provider:"Spintel",meta:"Budget-friendly, no lock-in",price:59,speed:50,eve:"44 Mbps",contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://spintel.net.au"},
  {provider:"Kogan Internet",meta:"Cheap, no lock-in",price:55,speed:25,eve:"22 Mbps",contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://kogan.com/au/kogan-internet"},
  {provider:"Kogan Internet",meta:"Cheap, no lock-in",price:65,speed:50,eve:"45 Mbps",contractMonths:1,freeMonths:0,discountedMonths:0,discountAmount:0,url:"https://kogan.com/au/kogan-internet"},
]

const savingsAccounts = [
  {provider:"BOQ Future Saver",meta:"Bank of Queensland",rate:5.80,conditions:"Age 14–35, deposit $1,000/mo",url:"https://boq.com.au"},
  {provider:"ING Savings Maximiser",meta:"ING Direct",rate:5.50,conditions:"Deposit $1,000/mo + 5 card purchases",url:"https://ing.com.au"},
  {provider:"Great Southern Bank",meta:"Great Southern Bank",rate:5.50,conditions:"Deposit $1/mo, no withdrawals",url:"https://greatsouthernbank.com.au"},
  {provider:"Rabobank High Interest",meta:"Rabobank",rate:5.40,conditions:"Intro rate first 4 months",url:"https://rabobank.com.au"},
  {provider:"Macquarie Savings",meta:"Macquarie Bank",rate:5.35,conditions:"Intro rate first 4 months",url:"https://macquarie.com.au"},
  {provider:"Virgin Money Boost Saver",meta:"Virgin Money",rate:5.35,conditions:"10 transactions/mo on linked account",url:"https://virginmoney.com.au"},
  {provider:"Westpac Life",meta:"Westpac",rate:5.20,conditions:"Grow balance each month",url:"https://westpac.com.au"},
  {provider:"Ubank Save",meta:"Ubank (NAB)",rate:5.10,conditions:"Deposit $200/mo",url:"https://ubank.com.au"},
  {provider:"ANZ Plus Save",meta:"ANZ",rate:5.00,conditions:"Deposit $10+ per month",url:"https://anz.com.au"},
  {provider:"NAB Reward Saver",meta:"NAB",rate:5.00,conditions:"One deposit, no withdrawals per month",url:"https://nab.com.au"},
  {provider:"Commonwealth GoalSaver",meta:"CommBank",rate:4.90,conditions:"Deposit $200+ per month",url:"https://commbank.com.au"},
]

const streamingServices = [
  {provider:"Netflix",plan:"Standard with Ads",price:7.99,quality:"1080p",simultaneous:2,tags:["entertainment"],url:"https://netflix.com/au",meta:"Ad-supported · 2 screens · 1080p"},
  {provider:"Netflix",plan:"Standard",price:18.99,quality:"1080p",simultaneous:2,tags:["entertainment"],url:"https://netflix.com/au",meta:"No ads · 2 screens · 1080p"},
  {provider:"Stan",plan:"Basic",price:10,quality:"1080p",simultaneous:1,tags:["entertainment"],url:"https://stan.com.au",meta:"1 screen · 1080p"},
  {provider:"Disney+",plan:"Standard",price:13.99,quality:"4K",simultaneous:4,tags:["entertainment","kids"],url:"https://disneyplus.com/en-au",meta:"4 screens · 4K · Disney, Marvel, Star Wars"},
  {provider:"Binge",plan:"Basic",price:10,quality:"1080p",simultaneous:1,tags:["entertainment"],url:"https://binge.com.au",meta:"1 screen · 1080p"},
  {provider:"Apple TV+",plan:"Monthly",price:12.99,quality:"4K",simultaneous:6,tags:["entertainment"],url:"https://tv.apple.com",meta:"6 screens · 4K · Originals only"},
  {provider:"Paramount+",plan:"Monthly",price:8.99,quality:"4K",simultaneous:3,tags:["entertainment","sport"],url:"https://paramountplus.com/au",meta:"3 screens · 4K"},
  {provider:"Kayo Sports",plan:"Basic",price:25,quality:"4K",simultaneous:2,tags:["sport"],url:"https://kayosports.com.au",meta:"2 screens · 4K · 50+ sports"},
  {provider:"ABC iview",plan:"Free",price:0,quality:"1080p",simultaneous:99,tags:["entertainment","kids"],url:"https://iview.abc.net.au",meta:"Free forever · No subscription required"},
  {provider:"SBS On Demand",plan:"Free",price:0,quality:"1080p",simultaneous:99,tags:["entertainment"],url:"https://sbs.com.au/ondemand",meta:"Free forever · Ad-supported"},
  {provider:"Netflix + Disney+",plan:"Bundle",price:29.99,quality:"4K",simultaneous:4,tags:["entertainment","kids"],url:"https://netflix.com/au",meta:"Netflix Standard + Disney+ Standard",isBundle:true},
]