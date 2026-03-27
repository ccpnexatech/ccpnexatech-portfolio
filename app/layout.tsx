import type { Metadata } from 'next'
import { syne, inter } from './fonts'
import '@/styles/globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://ccpnexatech.com.br'),
  title: {
    template: '%s | CCP NEXATECH',
    default: 'CCP NEXATECH — Tecnologia que transforma negócios',
  },
  description:
    'Desenvolvimento de sites, landing pages e sistemas web de alto impacto para empresários e pequenos negócios. SEO, performance e design profissional.',
  keywords: [
    'desenvolvimento web',
    'landing page',
    'sistema web',
    'Next.js',
    'Fortaleza',
    'CCP NEXATECH',
    'criação de site',
    'portfólio digital',
  ],
  authors: [{ name: 'CCP NEXATECH', url: 'https://ccpnexatech.com.br' }],
  creator: 'CCP NEXATECH',
  publisher: 'CCP NEXATECH',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://ccpnexatech.com.br',
    siteName: 'CCP NEXATECH',
    title: 'CCP NEXATECH — Tecnologia que transforma negócios',
    description:
      'Desenvolvimento de sites, landing pages e sistemas web de alto impacto para empresários e pequenos negócios.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'CCP NEXATECH' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CCP NEXATECH — Tecnologia que transforma negócios',
    description:
      'Desenvolvimento de sites, landing pages e sistemas web de alto impacto.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${syne.variable} ${inter.variable}`} suppressHydrationWarning>
      <body>
        {/* Skip to main — acessibilidade */}
        <a href="#main-content" className="skip-to-main">
          Ir para o conteúdo principal
        </a>

        {/* JSON-LD — Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'CCP NEXATECH',
              legalName: 'CCP NEXATECH LTDA',
              taxID: '59.691.989/0001-70',
              url: 'https://ccpnexatech.com.br',
              logo: 'https://ccpnexatech.com.br/logo/logo.svg',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Fortaleza',
                addressRegion: 'CE',
                addressCountry: 'BR',
              },
              description:
                'Desenvolvimento de sites, landing pages e sistemas web para empresários e pequenos negócios.',
              knowsAbout: ['Next.js', 'TailwindCSS', 'SEO', 'Web Development', 'Landing Pages'],
            }),
          }}
        />

        <main id="main-content">{children}</main>
      </body>
    </html>
  )
}
