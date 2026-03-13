import { supabase } from '../lib/supabase.js'

export async function scrapeMobilePlans() {
  const { default: FirecrawlApp } = await import('@mendable/firecrawl-js')
  const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY })

  const providers = [
    { provider: 'Boost Mobile', url: 'https://boost.com.au/pages/sim-only-plans', network: 'Telstra', has_5g: true },
    { provider: 'Amaysim', url: 'https://www.amaysim.com.au/plans/mobile-plans', network: 'Optus', has_5g: false },
    { provider: 'Woolworths Mobile', url: 'https://www.woolworthsmobile.com.au/plans', network: 'Telstra', has_5g: true },
    { provider: 'Aldi Mobile', url: 'https://www.aldimobile.com.au/pages/plans', network: 'Telstra', has_5g: false },
    { provider: 'Lebara', url: 'https://www.lebara.com.au/sim-only-plans.html', network: 'Vodafone', has_5g: false },
    { provider: 'Kogan Mobile', url: 'https://www.kogan.com/au/kogan-mobile/', network: 'Vodafone', has_5g: false },
    { provider: 'Felix Mobile', url: 'https://felix.com.au/plans', network: 'Optus', has_5g: false },
    { provider: 'Spintel', url: 'https://www.spintel.net.au/mobile', network: 'Optus', has_5g: false },
  ]

  const allPlans = []

  for (const provider of providers) {
    try {
      console.log(`Scraping ${provider.provider}...`)

      const result = await firecrawl.scrapeUrl(provider.url, {
        formats: ['extract'],
        extract: {
          prompt: `Extract all SIM only mobile plans from this page. For each plan return: price (number, monthly cost in AUD), data (number, GB per month, use 999 for unlimited), contract_months (number, 1 if no contract), free_months (number, 0 if none), discounted_months (number, 0 if none), discount_amount (number, 0 if none). Return as a JSON array called plans.`
        }
      })

      if (result.extract?.plans) {
        const plans = result.extract.plans.map(p => ({
          provider: provider.provider,
          meta: `Runs on ${provider.network} network`,
          price: parseFloat(p.price) || 0,
          data: parseFloat(p.data) || 0,
          contract_months: parseInt(p.contract_months) || 1,
          free_months: parseInt(p.free_months) || 0,
          discounted_months: parseInt(p.discounted_months) || 0,
          discount_amount: parseFloat(p.discount_amount) || 0,
          url: provider.url,
          network: provider.network,
          has_5g: provider.has_5g,
        }))
        allPlans.push(...plans)
        console.log(`✓ ${provider.provider}: ${plans.length} plans found`)
      }
    } catch (err) {
      console.error(`✗ ${provider.provider}: ${err.message}`)
    }
  }

  if (allPlans.length > 0) {
    const providerNames = providers.map(p => p.provider)
    await supabase.from('mobile_plans').delete().in('provider', providerNames)
    const { error } = await supabase.from('mobile_plans').insert(allPlans)
    if (error) console.error('Supabase insert error:', error)
    else console.log(`✓ Saved ${allPlans.length} plans to database`)
  }

  return allPlans
}