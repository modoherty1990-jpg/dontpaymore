'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function CategoryGrid({ onCategoryClick }) {
  const [counts, setCounts] = useState({})

  useEffect(() => {
    async function fetchCounts() {
      const tables = [
        { id: 'mobile', table: 'mobile_plans' },
        { id: 'broadband', table: 'broadband_plans' },
        { id: 'savings', table: 'savings_accounts' },
        { id: 'streaming', table: 'streaming_services' },
      ]
      const results = {}
      for (const { id, table } of tables) {
        const { count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
          .eq('hidden', false)
        results[id] = count || 0
      }
      setCounts(results)
    }
    fetchCounts()
  }, [])

  function countLabel(id) {
    const n = counts[id]
    if (n === undefined) return '...'
    if (id === 'savings') return `${n} account${n !== 1 ? 's' : ''} tracked`
    if (id === 'streaming') return `${n} service${n !== 1 ? 's' : ''} compared`
    return `${n} plan${n !== 1 ? 's' : ''} tracked`
  }

  const categories = [
    { id: 'mobile', icon: '📱', name: 'Mobile Plans', desc: 'SIM-only plans across all Australian networks including all current offers', live: true },
    { id: 'broadband', icon: '🌐', name: 'Home Broadband', desc: 'Compare NBN plans by speed tier across all major providers. Free months and intro discounts calculated into the real monthly cost.', live: true },
    { id: 'savings', icon: '🏦', name: 'Savings Accounts', desc: 'Compare high-interest savings accounts from the big four banks and digital challengers. Find out how much more you could be earning.', live: true },
    { id: 'streaming', icon: '📺', name: 'Streaming', desc: 'Compare Netflix, Stan, Binge, Disney+, Kayo and more. Find out if you\'re doubling up — or if a bundle saves you money.', live: true },
    { id: null, icon: '💳', name: 'Credit Cards', desc: 'Annual fees, purchase rates and rewards compared honestly', live: false },
    { id: null, icon: '🚗', name: 'Car Insurance', desc: 'Comprehensive, third party and CTP cover compared', live: false },
    { id: null, icon: '🏠', name: 'Home Loans', desc: 'Variable and fixed rate mortgages across all major lenders', live: false },
    { id: null, icon: '⚡', name: 'Energy', desc: 'Electricity and gas plans compared by state and usage', live: false },
  ]

  return (
    <div style={{ marginBottom: '3.5rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Compare by category</div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>Pick a category. Enter what you pay. We'll do the rest.</div>
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
              ? <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--brand)', marginTop: 'auto', paddingTop: '0.5rem' }}>{countLabel(cat.id)}</div>
              : <div style={{ fontSize: '0.65rem', fontWeight: 700, background: 'var(--offwhite)', color: 'var(--text-light)', padding: '0.2rem 0.6rem', borderRadius: '999px', border: '1px solid var(--border)', display: 'inline-block', marginTop: 'auto', width: 'fit-content' }}>Coming soon</div>
            }
          </div>
        ))}
      </div>
    </div>
  )
}