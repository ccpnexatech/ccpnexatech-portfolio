'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { COMPANY } from '@/lib/constants'

const STATS = [
  { value: `${COMPANY.yearsExperience}+`, label: 'Anos de experiência em desenvolvimento web', color: 'text-accent', border: 'border-accent/20' },
  { value: '100%',                         label: 'Foco em performance e resultado real',       color: 'text-cyan',   border: 'border-cyan/20'   },
  { value: '3',                            label: 'Níveis de projeto: Basic, Pro e Enterprise', color: 'text-gold',   border: 'border-gold/20'   },
  { value: 'A+',                           label: 'Score de segurança e performance web',        color: 'text-[#E8EDF5]', border: 'border-white/10' },
]

const DIFFERENTIALS = [
  { icon: '⚡', label: 'Deploy em até 7 dias' },
  { icon: '🔒', label: 'Segurança LGPD' },
  { icon: '📊', label: 'SEO + Core Web Vitals' },
  { icon: '🇧🇷', label: 'Empresa registrada com CNPJ' },
]

// Shared animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
}
const stagger = { show: { transition: { staggerChildren: 0.08 } } }

function LogoMark() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none" aria-hidden="true">
      <polygon points="80,8 148,44 148,116 80,152 12,116 12,44" stroke="#0066FF" strokeWidth="1.5" fill="rgba(0,102,255,0.08)" />
      <polygon points="80,28 128,54 128,106 80,132 32,106 32,54" stroke="#0066FF" strokeWidth="1" fill="rgba(0,102,255,0.14)" />
      <polygon points="80,52 104,80 80,108 56,80" fill="#0066FF" />
      <circle cx="80" cy="80" r="4" fill="white" />
      <circle cx="80" cy="80" r="36" stroke="#0066FF" strokeWidth="0.5" strokeDasharray="3 3" fill="none" opacity="0.4" />
    </svg>
  )
}

export default function About() {
  const ref           = useRef<HTMLElement>(null)
  const inView        = useInView(ref, { once: true, margin: '-80px' })
  const prefersReduced = useReducedMotion()
  const animate       = inView && !prefersReduced ? 'show' : inView ? 'show' : 'hidden'

  return (
    <section
      id="sobre"
      ref={ref}
      className="bg-surface section-padding overflow-hidden"
      aria-labelledby="about-heading"
    >
      <div className="container-nx">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: text ────────────────────────────────────────────── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={animate}
          >
            {/* Label */}
            <motion.p
              variants={fadeUp}
              className="text-caption text-accent font-[600] tracking-[0.14em] uppercase mb-4 flex items-center gap-2"
            >
              <span className="w-8 h-px bg-accent/50" aria-hidden="true" />
              Quem somos
            </motion.p>

            {/* Heading */}
            <motion.h2
              variants={fadeUp}
              id="about-heading"
              className="font-syne text-h1 text-text-dark mb-5 leading-[1.1]"
            >
              Uma empresa jovem,{' '}
              <span className="relative inline-block">
                <span className="text-accent">com expertise</span>
                <span
                  className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-accent to-accent/0"
                  aria-hidden="true"
                />
              </span>
              {' '}de verdade
            </motion.h2>

            {/* Body */}
            <motion.p variants={fadeUp} className="text-body-lg text-text-muted mb-4 leading-relaxed">
              A CCP NEXATECH nasceu da convicção de que empresários merecem soluções
              digitais que realmente funcionam — não só bonitas, mas rápidas, seguras
              e estratégicas.
            </motion.p>
            <motion.p variants={fadeUp} className="text-body text-text-muted mb-6 leading-relaxed">
              Com <strong className="text-text-dark font-[500]">{COMPANY.yearsMarket} ano de mercado</strong> e{' '}
              <strong className="text-text-dark font-[500]">{COMPANY.yearsExperience} anos de experiência acumulada</strong>,
              entregamos projetos que geram resultados mensuráveis: mais leads,
              mais conversões, mais presença digital.
            </motion.p>

            {/* Location */}
            <motion.p variants={fadeUp} className="text-body-sm font-[500] text-text-dark mb-8 flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-accent flex-shrink-0" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              Sediados em {COMPANY.city}, {COMPANY.state} — atendendo todo o Brasil
            </motion.p>

            {/* Differentials pills */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
              {DIFFERENTIALS.map(d => (
                <span
                  key={d.label}
                  className="flex items-center gap-1.5 text-[12px] font-[600] text-text-dark bg-white border border-border rounded-nx-full px-3 py-1.5 shadow-nx-xs"
                >
                  <span aria-hidden="true">{d.icon}</span>
                  {d.label}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: stats grid + visual ────────────────────────────── */}
          <div className="relative">
            {/* Stats grid */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate={animate}
              className="grid grid-cols-2 gap-4 mb-4"
            >
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  variants={fadeUp}
                  transition={{ delay: i * 0.06 }}
                  className={`bg-white border ${s.border} rounded-nx-lg p-5 flex flex-col shadow-nx-sm hover:shadow-nx-md transition-shadow duration-300`}
                >
                  <p className={`font-syne font-[700] text-[2rem] leading-none mb-2 ${s.color}`}>{s.value}</p>
                  <p className="text-caption text-text-dark leading-relaxed">{s.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Logo card — grid breaking overlap */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
              animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.9, rotate: -3 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
              className="mt-6 hidden xl:block self-end"
            >
              <div className="relative bg-navy rounded-nx-xl p-8 flex items-center justify-center shadow-[0_20px_60px_rgba(15,31,61,0.4)]">
                <LogoMark />
                {/* Floating CNPJ label */}
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 font-mono text-[10px] text-text-muted/80 bg-white border border-border px-3 py-1.5 rounded-nx-sm whitespace-nowrap shadow-nx-xs">
                  {COMPANY.cnpj}
                </span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}