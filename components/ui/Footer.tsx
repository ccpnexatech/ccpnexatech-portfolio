import Link from 'next/link'
import { COMPANY, NAV_LINKS, SERVICES } from '@/lib/constants'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-navy border-t border-[rgba(255,255,255,0.06)]">

      {/* Corpo principal */}
      <div className="container-nx py-nx-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Coluna 1 — Marca */}
        <div className="lg:col-span-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-nx-sm"
            aria-label={`${COMPANY.name} — página inicial`}
          >
            <LogoMark />
            <span className="font-syne font-[700] text-[1rem] tracking-[0.04em] text-[#E8EDF5]">
              CCP <span className="text-accent">NEXA</span>TECH
            </span>
          </Link>

          <p className="text-body-sm text-text-muted leading-relaxed max-w-[320px] mb-5">
            {COMPANY.tagline}. Soluções digitais de alto impacto para empresários
            que querem crescer de verdade.
          </p>

          <p className="text-caption text-text-muted font-mono">
            CNPJ {COMPANY.cnpj}
          </p>
          <p className="text-caption text-text-muted mt-1">
            {COMPANY.city}, {COMPANY.state} · Brasil
          </p>

          <a
            href={`mailto:${COMPANY.email}`}
            className="inline-block mt-3 text-caption text-accent hover:text-accent-mid transition-colors duration-nx-fast"
          >
            {COMPANY.email}
          </a>
        </div>

        {/* Coluna 2 — Navegação */}
        <div>
          <h3 className="text-caption font-[500] text-[#E8EDF5] tracking-[0.1em] uppercase mb-4">
            Navegação
          </h3>
          <ul className="flex flex-col gap-2.5" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-body-sm text-text-muted hover:text-[#E8EDF5] transition-colors duration-nx-fast"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Coluna 3 — Serviços */}
        <div>
          <h3 className="text-caption font-[500] text-[#E8EDF5] tracking-[0.1em] uppercase mb-4">
            Serviços
          </h3>
          <ul className="flex flex-col gap-2.5" role="list">
            {SERVICES.map((s) => (
              <li key={s.id}>
                <Link
                  href="#servicos"
                  className="text-body-sm text-text-muted hover:text-[#E8EDF5] transition-colors duration-nx-fast"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Barra inferior */}
      <div className="border-t border-[rgba(255,255,255,0.06)]">
        <div className="container-nx py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-caption text-text-muted">
            © {year} {COMPANY.name} LTDA. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacidade"
              className="text-caption text-text-muted hover:text-[#E8EDF5] transition-colors duration-nx-fast"
            >
              Privacidade
            </Link>
            <span className="text-caption text-text-muted" aria-hidden="true">·</span>
            <Link
              href="/termos"
              className="text-caption text-text-muted hover:text-[#E8EDF5] transition-colors duration-nx-fast"
            >
              Termos de uso
            </Link>
          </div>
        </div>
      </div>

    </footer>
  )
}

/* ── Logo mark inline ──────────────────────────────────────────────────────── */
function LogoMark() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <polygon
        points="80,8 148,44 148,116 80,152 12,116 12,44"
        stroke="#0066FF"
        strokeWidth="6"
        fill="rgba(0,102,255,0.08)"
      />
      <polygon
        points="80,28 128,54 128,106 80,132 32,106 32,54"
        stroke="#0066FF"
        strokeWidth="4"
        fill="rgba(0,102,255,0.14)"
      />
      <polygon points="80,52 104,80 80,108 56,80" fill="#0066FF" />
      <circle cx="80" cy="80" r="10" fill="white" />
    </svg>
  )
}