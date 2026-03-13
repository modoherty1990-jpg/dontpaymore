import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata = {
  title: "Compare & Save on Mobile, NBN, Savings & Streaming | Don't Pay More",
  description: "Enter what you currently pay — we'll show you every genuinely cheaper option, or confirm you're already on a good deal. No sponsored results. No paid placements. Always unbiased.",
  keywords: "compare mobile plans australia, compare NBN plans, best savings account australia, cheapest streaming australia, save money on bills australia",
  metadataBase: new URL('https://dontpaymore.com.au'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Compare & Save on Mobile, NBN, Savings & Streaming | Don't Pay More",
    description: "Enter what you currently pay — we'll show you every genuinely cheaper option, or confirm you're already on a good deal. No sponsored results. Always unbiased.",
    url: 'https://dontpaymore.com.au',
    siteName: "Don't Pay More",
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Compare & Save on Mobile, NBN, Savings & Streaming | Don't Pay More",
    description: "Enter what you currently pay — we'll show you every genuinely cheaper option, or confirm you're already on a good deal.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={jakarta.className}>
        {children}
      </body>
    </html>
  )
}