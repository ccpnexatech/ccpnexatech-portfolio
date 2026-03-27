import { COMPANY } from '@/lib/constants'

export default function About() {
  return (
    <section id="sobre" className="bg-surface section-padding">
      <div className="container-nx">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Texto */}
          <div>
            <p className="text-caption text-accent font-[500] tracking-[0.12em] uppercase mb-3">
              Quem somos
            </p>
            <h2 className="text-h1 font-syne text-text-dark mb-5">
              Uma empresa jovem,{' '}
              <span className="text-accent">com expertise de verdade</span>
            </h2>
            <p className="text-body-lg text-text-muted mb-4 leading-relaxed">
              A CCP NEXATECH nasceu da convicção de que empresários merecem soluções
              digitais que realmente funcionam — não só bonitas, mas rápidas, seguras
              e estratégicas.
            </p>
            <p className="text-body-lg text-text-muted mb-4 leading-relaxed">
              Com {COMPANY.yearsMarket} ano de mercado e {COMPANY.yearsExperience} anos
              de experiência acumulada, entregamos projetos que geram resultados
              mensuráveis: mais leads, mais conversões, mais presença digital.
            </p>
            <p className="text-body font-[500] text-text-dark">
              Sediados em {COMPANY.city}, {COMPANY.state} — atendendo todo o Brasil.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <StatCard value={`${COMPANY.yearsExperience}+`} label="Anos de experiência em desenvolvimento web" color="text-accent" />
              <StatCard value="100%" label="Foco em performance e resultado real" color="text-cyan" />
              <StatCard value="3" label="Níveis de projeto: Basic, Pro e Enterprise" color="text-gold" />
              <StatCard value="Next.js" label="Stack moderno, seguro e escalável" color="text-text-dark" small />
            </div>
          </div>

          {/* Visual — logo mark */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="bg-navy rounded-nx-xl p-12 flex items-center justify-center min-h-[280px] w-full">
              <LogoMark />
            </div>
            <span className="absolute top-4 -right-2 bg-accent text-white text-caption font-[500] px-3 py-1.5 rounded-nx-sm whitespace-nowrap">
              CCP NEXATECH
            </span>
            <span className="absolute bottom-4 -left-2 bg-white border border-border text-text-muted text-[11px] px-3 py-1.5 rounded-nx-sm font-mono">
              {COMPANY.cnpj}
            </span>
          </div>

        </div>
      </div>
    </section>
  )
}

/* ── Sub-componentes ──────────────────────────────────────────────────────── */

interface StatCardProps {
  value: string
  label: string
  color?: string
  small?: boolean
}

function StatCard({ value, label, color = 'text-accent', small = false }: StatCardProps) {
  return (
    <div className="bg-white border border-border rounded-nx-md p-5 flex flex-col">
      <p className={`font-syne font-[700] leading-none mb-1.5 ${color} ${small ? 'text-h4' : 'text-[1.75rem]'} flex-1`}>
        {value}
      </p>
      <p className="text-caption text-text-muted">{label}</p>
    </div>
  )
}

function LogoMark() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Hexágono externo */}
      <polygon
        points="80,8 148,44 148,116 80,152 12,116 12,44"
        stroke="#0066FF"
        strokeWidth="1.5"
        fill="rgba(0,102,255,0.08)"
      />
      {/* Hexágono interno */}
      <polygon
        points="80,28 128,54 128,106 80,132 32,106 32,54"
        stroke="#0066FF"
        strokeWidth="1"
        fill="rgba(0,102,255,0.14)"
      />
      {/* Losango central */}
      <polygon points="80,52 104,80 80,108 56,80" fill="#0066FF" />
      {/* Ponto central */}
      <circle cx="80" cy="80" r="4" fill="white" />
      {/* Anel decorativo tracejado */}
      <circle
        cx="80"
        cy="80"
        r="36"
        stroke="#0066FF"
        strokeWidth="0.5"
        strokeDasharray="3 3"
        fill="none"
        opacity="0.4"
      />
    </svg>
  )
}