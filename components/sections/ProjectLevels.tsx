'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { PROJECT_LEVELS } from '@/lib/constants'

/* ── Animações ─────────────────────────────────────────────────────────────── */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const cardAnim = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
}

const headerAnim = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
}

/* ── Estilos por tier ──────────────────────────────────────────────────────── */
const TIER_STYLES = {
  basic: {
    badge:       'bg-[rgba(255,255,255,0.08)] text-text-muted',
    checkColor:  '#0066FF',
    ctaClass:    'border border-[rgba(255,255,255,0.12)] text-text-muted hover:border-[rgba(255,255,255,0.25)] hover:text-[#E8EDF5]',
    featured:     false,
  },
  pro: {
    badge:       'bg-[rgba(0,102,255,0.15)] text-accent-mid',
    checkColor:  '#0066FF',
    ctaClass:    'bg-accent text-white shadow-nx-accent hover:scale-[1.02] hover:shadow-[0_6px_24px_rgba(0,102,255,0.45)]',
    featured:     true,
  },
  enterprise: {
    badge:       'bg-[rgba(240,165,0,0.12)] text-gold',
    checkColor:  '#F0A500',
    ctaClass:    'border border-[rgba(240,165,0,0.30)] text-gold hover:border-[rgba(240,165,0,0.55)] hover:bg-[rgba(240,165,0,0.06)]',
    featured:     false,
  },
} as const

/* ── Ícone de check ────────────────────────────────────────────────────────── */
function IconCheck({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="flex-shrink-0 mt-[1px]">
      <circle cx="8" cy="8" r="7" stroke={color} strokeWidth="1.2" />
      <path d="M5 8l2 2 4-4" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── Ícone de X (não incluso) ──────────────────────────────────────────────── */
function IconX() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="flex-shrink-0 mt-[1px] opacity-30">
      <circle cx="8" cy="8" r="7" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
      <path d="M5.5 10.5l5-5M10.5 10.5l-5-5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

/* ── Ícone de clock ────────────────────────────────────────────────────────── */
function IconClock() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" stroke="#6B7A9B" strokeWidth="1.2" />
      <path d="M8 4.5V8l2.5 1.5" stroke="#6B7A9B" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

/* ── Features que existem apenas em Pro+ ou Enterprise ─────────────────────── */
const EXTRA_FEATURES = {
  basic: [
    { label: 'Animações avançadas', included: false },
    { label: 'Dark mode',           included: false },
  ],
  pro: [
    { label: 'Autenticação de usuários', included: false },
    { label: 'Integrações via API',      included: false },
  ],
  enterprise: [] as { label: string; included: boolean }[],
} as const

/* ── Componente principal ──────────────────────────────────────────────────── */
export default function ProjectLevels() {
  return (
    <section id="niveis" className="bg-navy section-padding">
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
            Níveis de projeto
          </p>
          <h2 className="text-h1 font-syne text-[#E8EDF5] mb-3">
            Escolha o nível{' '}
            <span className="text-accent">certo para você</span>
          </h2>
          <p className="text-body-lg text-text-muted max-w-[520px] leading-relaxed">
            Cada nível foi pensado para um momento do negócio. Comece pequeno
            e cresça — ou vá direto ao Pro se performance é prioridade.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {PROJECT_LEVELS.map((level) => {
            const styles  = TIER_STYLES[level.id as keyof typeof TIER_STYLES]
            const extras  = EXTRA_FEATURES[level.id as keyof typeof EXTRA_FEATURES]
            const isFeatured = 'featured' in level && level.featured === true

            return (
              <motion.div
                key={level.id}
                variants={cardAnim}
                className={cn(
                  'bg-[#0A1828] rounded-nx-lg p-7 border flex flex-col relative',
                  isFeatured
                    ? 'border-[rgba(0,102,255,0.50)]'
                    : 'border-[rgba(255,255,255,0.08)]',
                )}
              >
                {/* Badge "Mais popular" */}
                {isFeatured && (
                  <div className="absolute -top-3 inset-x-0 flex justify-center" aria-label="Plano mais popular">
                    <span className="bg-accent text-white text-[11px] font-[500] px-4 py-[3px] rounded-nx-full tracking-[0.04em]">
                      Mais popular
                    </span>
                  </div>
                )}

                {/* Topo */}
                <div className="mb-5">
                  <span className={cn(
                    'inline-block text-[11px] font-[500] px-2.5 py-[3px] rounded-nx-full mb-3',
                    styles.badge,
                  )}>
                    {isFeatured ? '⚡ ' : ''}{level.name}
                  </span>
                  <h3 className="font-syne text-[1.375rem] font-[700] text-[#E8EDF5] mb-1.5">
                    {level.name}
                  </h3>
                  <p className="text-body-sm text-text-muted leading-snug">
                    {level.description}
                  </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-[rgba(255,255,255,0.07)] mb-5" aria-hidden="true" />

                {/* Features */}
                <ul className="flex flex-col gap-[9px] flex-1" role="list">
                  {/* Label "tudo do X + mais" para Pro e Enterprise */}
                  {level.id !== 'basic' && (
                    <li className="text-[12px] text-[#c8d0e0] italic mb-1">
                      Tudo do {level.id === 'pro' ? 'Basic' : 'Pro'}, mais:
                    </li>
                  )}

                  {level.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-body-sm text-[#c8d0e0]">
                      <IconCheck color={styles.checkColor} />
                      {feat}
                    </li>
                  ))}

                  {/* Features não incluídas */}
                  {extras.map((extra) => (
                    <li key={extra.label} className="flex items-start gap-2 text-body-sm text-text-muted">
                      <IconX />
                      {extra.label}
                    </li>
                  ))}
                </ul>

                {/* Rodapé */}
                <div className="mt-6">
                  <div className="flex items-center gap-1.5 text-caption text-text-muted mb-3">
                    <IconClock />
                    Entrega em{' '}
                    <strong className="text-[#E8EDF5] font-[500]">
                      {level.deliveryDays} dias
                    </strong>
                  </div>

                  <Link
                    href="#contato"
                    className={cn(
                      'flex items-center justify-center gap-1.5 w-full py-3 rounded-nx-sm text-cta font-[500] transition-all duration-nx-fast active:scale-[0.98]',
                      styles.ctaClass,
                    )}
                    aria-label={`Solicitar plano ${level.name}`}
                  >
                    Solicitar {level.name}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}