'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { PROJECT_LEVELS } from '@/lib/constants'

/* ── Faixas de preço por tier ──────────────────────────────────────────────── */
const PRICE_RANGES = {
  basic:      { label: 'R$ 800 – R$ 1.800',  color: 'text-accent' },
  pro:        { label: 'R$ 2.000 – R$ 4.500', color: 'text-accent' },
  enterprise: { label: 'Sob consulta',        color: 'text-gold'   },
} as const

/* ── Linhas da tabela ──────────────────────────────────────────────────────── */
const TABLE_ROWS: {
  label: string
  basic:      React.ReactNode
  pro:        React.ReactNode
  enterprise: React.ReactNode
}[] = [
  {
    label:      'Seções',
    basic:      <Tag color="blue">Até 5</Tag>,
    pro:        <Tag color="blue">Até 10</Tag>,
    enterprise: <Tag color="gold">Ilimitadas</Tag>,
  },
  {
    label:      'SEO',
    basic:      'Básico',
    pro:        'Completo + JSON-LD',
    enterprise: 'Completo + JSON-LD',
  },
  {
    label:      'Animações',
    basic:      <Dash />,
    pro:        <Check />,
    enterprise: <Check />,
  },
  {
    label:      'Dark mode',
    basic:      <Dash />,
    pro:        <Check />,
    enterprise: <Check />,
  },
  {
    label:      'Analytics integrado',
    basic:      <Dash />,
    pro:        <Check />,
    enterprise: <Check />,
  },
  {
    label:      'Autenticação + admin',
    basic:      <Dash />,
    pro:        <Dash />,
    enterprise: <Check />,
  },
  {
    label:      'Integrações via API',
    basic:      <Dash />,
    pro:        <Dash />,
    enterprise: <Check />,
  },
  {
    label:      'CI/CD configurado',
    basic:      <Dash />,
    pro:        <Dash />,
    enterprise: <Check />,
  },
  {
    label:      'Suporte pós-entrega',
    basic:      '30 dias',
    pro:        '60 dias',
    enterprise: '90 dias',
  },
]

/* ── Animações ─────────────────────────────────────────────────────────────── */
const headerAnim = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
}

const tableAnim = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } },
}

/* ── Componente principal ──────────────────────────────────────────────────── */
export default function Pricing() {
  return (
    <section id="precos" className="bg-surface section-padding">
      <div className="container-nx">

        {/* Cabeçalho */}
        <motion.div
          className="mb-12"
          variants={headerAnim}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
        >
          <p className="text-caption text-accent font-[500] tracking-[0.12em] uppercase mb-3">
            Investimento
          </p>
          <h2 className="text-h1 font-syne text-text-dark mb-3">
            Transparência em{' '}
            <span className="text-accent">cada projeto</span>
          </h2>
          <p className="text-body-lg text-text-muted max-w-[520px] leading-relaxed">
            Sem valores escondidos. Cada faixa reflete complexidade, prazo e
            suporte incluído — você sabe exatamente o que está contratando.
          </p>
        </motion.div>

        {/* Tabela */}
        <motion.div
          variants={tableAnim}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="overflow-x-auto"
        >
          <table className="w-full border-separate border-spacing-0 border border-border rounded-nx-lg overflow-hidden bg-white text-left">

            {/* Cabeçalho da tabela */}
            <thead>
              <tr className="border-b border-border">
                <th className="w-[30%] px-5 py-6 font-syne text-[15px] font-[600] text-text-dark border-b border-border">
                  O que você recebe
                </th>
                {PROJECT_LEVELS.map((level) => {
                  const price    = PRICE_RANGES[level.id as keyof typeof PRICE_RANGES]
                  const featured = 'featured' in level && level.featured

                  return (
                    <th
                      key={level.id}
                      className={cn(
                        'px-5 py-6 font-[400] text-text-muted text-body-sm border-b border-border',
                        featured && 'bg-[#EEF4FF]',
                      )}
                    >
                      <span className="font-syne text-[14px] font-[600] text-text-dark block mb-1">
                        {level.name}
                        {featured && (
                          <span className="text-accent ml-1" aria-hidden="true">⚡</span>
                        )}
                      </span>
                      <span className={cn('text-body-sm font-[500] block mb-1.5', price.color)}>
                        {price.label}
                      </span>
                      <span className="inline-flex items-center gap-1 text-caption text-text-muted">
                        <IconClock />
                        {level.deliveryDays} dias
                      </span>
                    </th>
                  )
                })}
              </tr>
            </thead>

            {/* Linhas de features */}
            <tbody>
              {TABLE_ROWS.map((row, i) => (
                <tr
                  key={row.label}
                  className={cn(
                    'border-b border-border transition-colors duration-nx-fast hover:bg-[#FAFBFD]',
                    i === TABLE_ROWS.length - 1 && 'border-b-0',
                  )}
                >
                  <td className="px-5 py-[14px] text-body-sm font-[500] text-text-dark">
                    {row.label}
                  </td>
                  {PROJECT_LEVELS.map((level) => {
                    const featured = 'featured' in level && level.featured
                    const value    = row[level.id as keyof typeof row] as React.ReactNode

                    return (
                      <td
                        key={level.id}
                        className={cn(
                          'px-5 py-[14px] text-body-sm text-text-muted',
                          featured && 'bg-[#F7FAFF]',
                        )}
                      >
                        {value}
                      </td>
                    )
                  })}
                </tr>
              ))}

              {/* Linha de CTAs */}
              <tr className="border-t border-border">
                <td className="px-5 py-5" />
                {PROJECT_LEVELS.map((level) => {
                  const featured = 'featured' in level && level.featured

                  return (
                    <td
                      key={level.id}
                      className={cn('px-5 py-5', featured && 'bg-[#EEF4FF]')}
                    >
                      <Link
                        href="#contato"
                        aria-label={`Solicitar plano ${level.name}`}
                        className={cn(
                          'flex items-center justify-center gap-1.5 w-full py-2.5 rounded-nx-sm text-cta font-[500] transition-all duration-nx-fast active:scale-[0.98]',
                          featured
                            ? 'bg-accent text-white shadow-nx-accent hover:scale-[1.02]'
                            : level.id === 'enterprise'
                              ? 'border border-[rgba(240,165,0,0.40)] text-gold hover:border-[rgba(240,165,0,0.65)]'
                              : 'border border-border text-text-muted hover:border-accent hover:text-accent',
                        )}
                      >
                        Solicitar {level.name}
                        <span aria-hidden="true">→</span>
                      </Link>
                    </td>
                  )
                })}
              </tr>
            </tbody>
          </table>
        </motion.div>

        {/* Nota de rodapé */}
        <motion.div
          variants={headerAnim}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-6 flex items-start gap-3 bg-white border border-border rounded-nx-md p-5"
          role="note"
        >
          <div
            className="w-8 h-8 bg-accent-light rounded-[8px] flex items-center justify-center flex-shrink-0 mt-0.5"
            aria-hidden="true"
          >
            <IconInfo />
          </div>
          <p className="text-body-sm text-text-muted leading-relaxed">
            <strong className="text-text-dark font-[500]">Pagamento em 2x:</strong>{' '}
            50% para iniciar o projeto e 50% na entrega. Projetos Enterprise são
            orçados individualmente conforme escopo técnico. Todos os projetos
            incluem deploy na Vercel, domínio configurado e código-fonte
            entregue via GitHub.
          </p>
        </motion.div>

      </div>
    </section>
  )
}

/* ── Utilitários visuais ───────────────────────────────────────────────────── */

function Check() {
  return (
    <span className="w-[18px] h-[18px] rounded-full bg-accent-light inline-flex items-center justify-center">
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-label="Incluído">
        <path d="M2 6l3 3 5-5" stroke="#0066FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

function Dash() {
  return (
    <span className="text-border text-[16px] leading-none select-none" aria-label="Não incluso">
      —
    </span>
  )
}

interface TagProps {
  children: React.ReactNode
  color: 'blue' | 'gold'
}

function Tag({ children, color }: TagProps) {
  return (
    <span
      className={cn(
        'inline-block text-[11px] font-[500] px-2 py-[2px] rounded-nx-full',
        color === 'blue' ? 'bg-accent-light text-[#0050CC]' : 'bg-gold-light text-[#8A5C00]',
      )}
    >
      {children}
    </span>
  )
}

function IconClock() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" stroke="#6B7A9B" strokeWidth="1.3" />
      <path d="M8 4.5V8l2.5 1.5" stroke="#6B7A9B" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function IconInfo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="#0066FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}