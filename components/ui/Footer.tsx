import Link from 'next/link'
import { COMPANY, NAV_LINKS, SERVICES } from '@/lib/constants'

const SOCIAL_LINKS = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-navy relative overflow-hidden" role="contentinfo">
      {/* Gradient mesh top edge */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" aria-hidden="true" />
      <div className="absolute top-0 left-1/4 w-[400px] h-[200px] rounded-full pointer-events-none opacity-[0.06]"
        style={{ background: 'radial-gradient(circle, rgba(0,102,255,1) 0%, transparent 70%)', filter: 'blur(60px)' }}
        aria-hidden="true"
      />
      <div className="absolute top-0 right-1/4 w-[300px] h-[150px] rounded-full pointer-events-none opacity-[0.04]"
        style={{ background: 'radial-gradient(circle, rgba(0,194,224,1) 0%, transparent 70%)', filter: 'blur(80px)' }}
        aria-hidden="true"
      />

      {/* Main content */}
      <div className="relative container-nx py-nx-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Col 1 — Brand */}
        <div className="lg:col-span-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 mb-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-nx-sm group"
            aria-label={`${COMPANY.name} — página inicial`}
          >
            <svg width="28" height="28" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
              className="transition-transform duration-500 group-hover:rotate-[30deg]">
              <polygon points="80,8 148,44 148,116 80,152 12,116 12,44" stroke="#0066FF" strokeWidth="6" fill="rgba(0,102,255,0.08)" />
              <polygon points="80,28 128,54 128,106 80,132 32,106 32,54" stroke="#0066FF" strokeWidth="4" fill="rgba(0,102,255,0.14)" />
              <polygon points="80,52 104,80 80,108 56,80" fill="#0066FF" />
              <circle cx="80" cy="80" r="10" fill="white" />
            </svg>
            <span className="font-syne font-[700] text-[1rem] tracking-[0.04em] text-[#E8EDF5]">
              CCP <span className="text-accent">NEXA</span>TECH
            </span>
          </Link>

          <p className="text-body-sm text-text-muted leading-relaxed max-w-[320px] mb-5">
            {COMPANY.tagline}. Soluções digitais de alto impacto para empresários
            que querem crescer de verdade.
          </p>

          {/* Contact info */}
          <div className="flex flex-col gap-2 mb-5">
            <a href={`mailto:${COMPANY.email}`}
              className="flex items-center gap-2 text-caption text-accent hover:text-accent-mid transition-colors duration-150 w-fit">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              {COMPANY.email}
            </a>
            <p className="flex items-center gap-2 text-caption text-text-muted">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              {COMPANY.city}, {COMPANY.state} · Brasil
            </p>
            <p className="font-mono text-caption text-text-muted">{COMPANY.cnpj}</p>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-2" aria-label="Redes sociais">
            {SOCIAL_LINKS.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-8 h-8 rounded-nx-sm flex items-center justify-center text-text-muted bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] transition-all duration-200 hover:text-accent hover:bg-[rgba(0,102,255,0.10)] hover:border-[rgba(0,102,255,0.20)]"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Col 2 — Navigation */}
        <div>
          <h3 className="text-caption font-[700] text-[#E8EDF5] tracking-[0.10em] uppercase mb-5">Navegação</h3>
          <ul className="flex flex-col gap-2.5" role="list">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-body-sm text-text-muted hover:text-[#E8EDF5] transition-colors duration-150 flex items-center gap-1.5 group w-fit"
                >
                  <span className="w-0 group-hover:w-3 h-px bg-accent transition-all duration-200 flex-shrink-0" aria-hidden="true" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Services */}
        <div>
          <h3 className="text-caption font-[700] text-[#E8EDF5] tracking-[0.10em] uppercase mb-5">Serviços</h3>
          <ul className="flex flex-col gap-2.5" role="list">
            {SERVICES.map(s => (
              <li key={s.id}>
                <Link
                  href="#servicos"
                  className="text-body-sm text-text-muted hover:text-[#E8EDF5] transition-colors duration-150 flex items-center gap-1.5 group w-fit"
                >
                  <span className="w-0 group-hover:w-3 h-px bg-accent transition-all duration-200 flex-shrink-0" aria-hidden="true" />
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-[rgba(255,255,255,0.06)]">
        <div className="container-nx py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-caption text-text-muted">
            © {year} {COMPANY.name} LTDA. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacidade" className="text-caption text-text-muted hover:text-[#E8EDF5] transition-colors duration-150">
              Privacidade
            </Link>
            <span className="text-caption text-text-muted" aria-hidden="true">·</span>
            <Link href="/termos" className="text-caption text-text-muted hover:text-[#E8EDF5] transition-colors duration-150">
              Termos de uso
            </Link>
            <span className="text-caption text-text-muted" aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5 text-caption text-[#22c55e]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" aria-hidden="true" />
              LGPD
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}