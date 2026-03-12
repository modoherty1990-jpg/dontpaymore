'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'


const PASSWORD = 'dontpaymore2024'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [input, setInput] = useState('')
  const [activeTable, setActiveTable] = useState('mobile_plans')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const tables = ['mobile_plans', 'broadband_plans', 'savings_accounts', 'streaming_services']

  useEffect(() => {
    if (authed) fetchData()
  }, [authed, activeTable])

  async function fetchData() {
    setLoading(true)
    const { data, error } = await supabase.from(activeTable).select('*').order('id')
    if (!error) setRows(data)
    setLoading(false)
  }

  async function updateRow(id, field, value) {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  async function saveRow(row) {
    setSaving(true)
    const { error } = await supabase.from(activeTable).update(row).eq('id', row.id)
    setMessage(error ? 'Error saving' : 'Saved ✓')
    setTimeout(() => setMessage(''), 2000)
    setSaving(false)
  }

  async function deleteRow(id) {
    if (!confirm('Delete this row?')) return
    await supabase.from(activeTable).delete().eq('id', id)
    setRows(prev => prev.filter(r => r.id !== id))
  }

  async function addRow() {
    const newRow = { provider: 'New Provider', price: 0 }
    const { data, error } = await supabase.from(activeTable).insert(newRow).select()
    if (!error) setRows(prev => [...prev, data[0]])
  }

  if (!authed) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>Admin Login</h2>
        <input
          type="password"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && input === PASSWORD && setAuthed(true)}
          placeholder="Password"
          style={{ padding: '0.5rem 1rem', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ccc', marginRight: '0.5rem' }}
        />
        <button
          onClick={() => input === PASSWORD && setAuthed(true)}
          style={{ padding: '0.5rem 1rem', background: '#1a6b3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' }}
        >
          Login
        </button>
      </div>
    </div>
  )

  const columns = rows.length > 0 ? Object.keys(rows[0]).filter(k => k !== 'created_at') : []

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '100%', overflowX: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Don't Pay More — Admin</h1>
        {message && <span style={{ color: 'green', fontWeight: 700 }}>{message}</span>}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {tables.map(t => (
          <button key={t} onClick={() => setActiveTable(t)} style={{
            padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600,
            background: activeTable === t ? '#1a6b3c' : '#eee',
            color: activeTable === t ? 'white' : '#333'
          }}>{t.replace('_', ' ')}</button>
        ))}
      </div>

      {loading ? <p>Loading...</p> : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr>
                {columns.map(col => (
                  <th key={col} style={{ textAlign: 'left', padding: '0.5rem', background: '#f5f5f5', borderBottom: '2px solid #ddd', whiteSpace: 'nowrap' }}>{col}</th>
                ))}
                <th style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id} style={{ borderBottom: '1px solid #eee' }}>
                  {columns.map(col => (
                    <td key={col} style={{ padding: '0.3rem' }}>
                      {col === 'id' ? row[col] : (
                        <input
                          value={row[col] ?? ''}
                          onChange={e => updateRow(row.id, col, e.target.value)}
                          style={{ width: '100%', padding: '0.25rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.78rem' }}
                        />
                      )}
                    </td>
                  ))}
                  <td style={{ padding: '0.3rem', whiteSpace: 'nowrap' }}>
                    <button onClick={() => saveRow(row)} style={{ marginRight: '0.3rem', padding: '0.25rem 0.5rem', background: '#1a6b3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>Save</button>
                    <button onClick={() => deleteRow(row.id)} style={{ padding: '0.25rem 0.5rem', background: '#e53e3e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={addRow} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#1a6b3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>+ Add Row</button>
        </>
      )}
    </div>
  )
}