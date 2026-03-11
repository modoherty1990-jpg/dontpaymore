'use client'
import { useState, useRef, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import ComparePanel from './components/ComparePanel'
import CategoryGrid from './components/CategoryGrid'
import HowItWorks from './components/HowItWorks'
import TrustBlock from './components/TrustBlock'
import Footer from './components/Footer'

export default function Home() {
  const [activeCategory, setActiveCategory] = useState(null)
  const panelRef = useRef(null)

  useEffect(() => {
    if (activeCategory && panelRef.current) {
      panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [activeCategory])

  return (
    <main>
      <Header />
      <Hero onCategoryClick={setActiveCategory} />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
        {activeCategory && (
          <div ref={panelRef}>
            <ComparePanel
              category={activeCategory}
              onClose={() => setActiveCategory(null)}
            />
          </div>
        )}
        <CategoryGrid onCategoryClick={setActiveCategory} />
        <HowItWorks />
        <TrustBlock />
      </div>
      <Footer />
    </main>
  )
}