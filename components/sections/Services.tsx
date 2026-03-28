'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { PROJECT_LEVELS } from '@/lib/constants'

const SERVICES = [
  {
    id: 'landing-page',
    title: 'Landing Page',
    desc: 'Páginas de alta conversão para captar leads, lançar produtos e vender mais com clareza e velocidade.',
    badge: 'Mais vendido',
    badgeClass: 'bg-accent-light text-[#0050CC]',
    accentColor: '#0066FF',
    topBarClass: 'bg-accent',
    iconBg: 'bg-[rgba(0,102,255,0.10)]',
    bullets: [
      'Otimizada para conversão e SEO',
      'Formulário integrado + analytics',
      `Deploy em até ${PROJECT_LEVELS[0].deliveryDays} dias`,
      'Score 90+ no Lighthouse',
    ],
    days: `${PROJECT_LEVELS[0].deliveryDays} dias`,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
      </svg>
    ),
  },
  {
    id: 'institutional',
    title: 'Site Institucional',
    desc: 'Presença digital profissional com SEO local e nacional para que seu cliente te encontre antes do concorrente.',
    badge: 'SEO local',
    badgeClass: 'bg-cyan-light text-[#007A8C]',
    accentColor: '#00C2E0',
    topBarClass: 'bg-cyan',
    iconBg: 'bg-[rgba(0,194,224,0.10)]',
    bullets: [
      'SEO completo + JSON-LD estruturado',
      'Otimizado para Fortaleza e Brasil',
      'Dark mode + WCAG 2.2 AA',
      'Entrega em até 14 dias',
    ],
    days: '14 dias',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    id: 'ecommerce',
    title: 'E-commerce',
    desc: 'Lojas virtuais rápidas, seguras e otimizadas para conversão — do catálogo ao checkout em um fluxo sem atrito.',
    badge: 'Premium',
    badgeClass: 'bg-gold-light text-[#8A5C00]',
    accentColor: '#F0A500',
    topBarClass: 'bg-gold',
    iconBg: 'bg-[rgba(240,165,0,0.10)]',
    bullets: [
      'Integração com meios de pagamento',
      'Painel admin para gerenciar produtos',
      'Performance máxima no mobile',
      'LGPD e segurança em dia',
    ],
    days: `${PROJECT_LEVELS[2].deliveryDays} dias`,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
  },
  {
    id: 'web-app',
    title: 'Aplicação Web',
    desc: 'Sistemas e dashboards que automatizam processos, centralizam dados e escalam junto com o seu negócio.',
    badge: 'Enterprise',
    badgeClass: 'bg-[#DCFCE7] text-[#166534]',
    accentColor: '#22c55e',
    topBarClass: 'bg-[#22c55e]',
    iconBg: 'bg-[rgba(34,197,94,0.10)]',
    bullets: [
      'Autenticação e painel admin',
      'Integrações via API REST',
      'CI/CD configurado na Vercel',
      'Suporte técnico pós-entrega',
    ],
    days: `${PROJECT_LEVELS[2].deliveryDays} dias`,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
  },
]

const cardVariant = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.09, ease: [0.4, 0, 0.2, 1] },
  }),
}

export default function Services() {
  const ref           = useRef<HTMLElement>(null)
  const inView        = useInView(ref, { once: true, margin: '-60px' })
  const prefersReduced = useReducedMotion()

  return (
    <section
      id="servicos"
      ref={ref}
      className="bg-surface section-padding"
      aria-labelledby="services-heading"
    >
      <div className="container-nx">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="mb-14"
        >
          <p className="text-caption text-accent font-[600] tracking-[0.14em] uppercase mb-4 flex items-center gap-2">
            <span className="w-8 h-px bg-accent/40" aria-hidden="true" />
            O que entregamos
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 id="services-heading" className="font-syne text-h1 text-text-dark max-w-[500px] leading-[1.1]">
              Soluções digitais para{' '}
              <span className="text-accent">cada etapa</span>{' '}
              do seu negócio
            </h2>
            <p className="text-body-sm text-text-muted max-w-[280px] leading-relaxed">
              Do primeiro site ao sistema completo — tecnologia de ponta, prazos reais e foco total em resultado.
            </p>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {SERVICES.map((service, i) => (
            <motion.article
              key={service.id}
              custom={i}
              variants={prefersReduced ? {} : cardVariant}
              initial="hidden"
              animate={inView ? 'show' : 'hidden'}
              className={cn(
                'group relative bg-white border border-border rounded-nx-lg p-7 overflow-hidden',
                'transition-all duration-300 hover:-translate-y-1 hover:shadow-nx-md hover:border-transparent',
              )}
              style={{ '--service-accent': service.accentColor } as React.CSSProperties}
            >
              {/* Top color bar */}
              <div className={cn('absolute top-0 inset-x-0 h-[3px] rounded-t-nx-lg', service.topBarClass)} aria-hidden="true" />

              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-nx-lg"
                style={{ background: `radial-gradient(ellipse 60% 40% at 20% 20%, ${service.accentColor}06, transparent)` }}
                aria-hidden="true"
              />

              {/* Icon */}
              <div
                className={cn('w-12 h-12 rounded-[12px] flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110', service.iconBg)}
                style={{ color: service.accentColor }}
              >
                {service.icon}
              </div>

              {/* Badge */}
              <span className={cn('inline-block text-[11px] font-[600] px-2.5 py-[3px] rounded-nx-full mb-4 tracking-[0.04em]', service.badgeClass)}>
                {service.badge}
              </span>

              {/* Title */}
              <h3 className="font-syne text-h3 font-[600] text-text-dark mb-2.5 tracking-[0.02em]">{service.title}</h3>

              {/* Desc */}
              <p className="text-body-sm text-text-muted leading-relaxed mb-5">{service.desc}</p>

              {/* Bullets */}
              <ul className="flex flex-col gap-2 mb-6" role="list">
                {service.bullets.map(b => (
                  <li key={b} className="flex items-start gap-2 text-body-sm text-text-muted">
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-[6px] flex-shrink-0 transition-transform duration-300 group-hover:scale-125"
                      style={{ background: service.accentColor }}
                      aria-hidden="true"
                    />
                    {b}
                  </li>
                ))}
              </ul>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Link
                  href="#contato"
                  className="text-body-sm font-[600] flex items-center gap-1.5 transition-all duration-200 group-hover:gap-2.5"
                  style={{ color: service.accentColor }}
                  aria-label={`Solicitar proposta para ${service.title}`}
                >
                  Solicitar proposta
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <span className="text-caption text-text-muted">
                  A partir de <strong className="text-text-dark">{service.days}</strong>
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}