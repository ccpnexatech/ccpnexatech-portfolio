import type { Metadata, Viewport } from 'next'
import { syne, inter } from './fonts'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { COMPANY, NAV_LINKS, SERVICES } from '@/lib/constants'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import '@/styles/globals.css'

/* ── Viewport ──────────────────────────────────────────────────────────────── */
export const viewport: Viewport = {
  themeColor: '#0F1F3D',
  width: 'device-width',
  initialScale: 1,
}

/* ── Metadata ──────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL(COMPANY.url),

  title: {
    template: `%s | ${COMPANY.name}`,
    default: `${COMPANY.name} — ${COMPANY.tagline}`,
  },

  description:
    'Desenvolvimento de sites, landing pages e sistemas web de alto impacto para empresários e pequenos negócios em Fortaleza e todo o Brasil. SEO, performance e design profissional.',

  keywords: [
    'desenvolvimento web',
    'landing page',
    'sistema web',
    'Next.js',
    'Fortaleza',
    'CCP NEXATECH',
    'criação de site',
    'portfólio digital',
    'agência digital Fortaleza',
    'site para empresa',
    'SEO Fortaleza',
  ],

  authors: [{ name: COMPANY.name, url: COMPANY.url }],
  creator: COMPANY.name,
  publisher: COMPANY.name,

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },

  alternates: {
    canonical: COMPANY.url,
  },

  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: COMPANY.url,
    siteName: COMPANY.name,
    title: `${COMPANY.name} — ${COMPANY.tagline}`,
    description:
      'Desenvolvimento de sites, landing pages e sistemas web de alto impacto para empresários e pequenos negócios.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${COMPANY.name} — ${COMPANY.tagline}`,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: `${COMPANY.name} — ${COMPANY.tagline}`,
    description:
      'Desenvolvimento de sites, landing pages e sistemas web de alto impacto.',
    images: ['/og-image.png'],
  },

  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png' }],
  },

  manifest: '/site.webmanifest',
}

/* ── JSON-LD ───────────────────────────────────────────────────────────────── */
const jsonLdOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: COMPANY.name,
  legalName: `${COMPANY.name} LTDA`,
  taxID: COMPANY.cnpj,
  url: COMPANY.url,
  logo: `${COMPANY.url}/logo/logo.svg`,
  email: COMPANY.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: COMPANY.city,
    addressRegion: COMPANY.state,
    addressCountry: 'BR',
  },
  description:
    'Desenvolvimento de sites, landing pages e sistemas web para empresários e pequenos negócios.',
  knowsAbout: ['Next.js', 'TailwindCSS', 'SEO', 'Web Development', 'Landing Pages'],
}

const jsonLdLocalBusiness = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: COMPANY.name,
  url: COMPANY.url,
  email: COMPANY.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: COMPANY.city,
    addressRegion: COMPANY.state,
    addressCountry: 'BR',
  },
  areaServed: 'BR',
  priceRange: '$$',
}

const jsonLdWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: COMPANY.name,
  url: COMPANY.url,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${COMPANY.url}/?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

const jsonLdServices = SERVICES.map((s) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: s.title,
  description: s.description,
  provider: {
    '@type': 'Organization',
    name: COMPANY.name,
    url: COMPANY.url,
  },
}))

/* ── Layout ────────────────────────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="pt-BR"
      className={`${syne.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-surface text-text-dark antialiased">

        {/* Skip to main — acessibilidade via teclado */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-accent focus:text-white focus:px-4 focus:py-2 focus:rounded-nx-sm focus:text-cta focus:font-[500]"
        >
          Ir para o conteúdo principal
        </a>

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdLocalBusiness) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        {jsonLdServices.map((s) => (
          <script
            key={s.name}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
          />
        ))}

        {/* Navegação */}
        <Navbar links={NAV_LINKS} />

        {/* Conteúdo principal — pt-16 compensa a Navbar fixed de 64px */}
        <main id="main-content" tabIndex={-1} className="pt-16">
          {children}
        </main>

        {/* Rodapé */}
        <Footer />

        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}