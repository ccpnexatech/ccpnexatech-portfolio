'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { PROJECT_LEVELS } from '@/lib/constants'

/* ── Dados dos serviços ────────────────────────────────────────────────────── */
const SERVICES_DATA = [
  {
    id:       'landing-page',
    title:    'Landing Page',
    desc:     'Páginas de alta conversão para captar leads, lançar produtos e vender mais com clareza e velocidade.',
    badge:    { label: 'Mais vendido', color: 'blue' as const },
    accent:   '#0066FF',
    iconBg:   'bg-[rgba(0,102,255,0.10)]',
    topBar:   'bg-accent',
    bullets: [
      'Otimizada para conversão e SEO',
      'Formulário integrado + analytics',
      `Deploy em até ${PROJECT_LEVELS[0].deliveryDays} dias`,
      'Score 90+ no Lighthouse',
    ],
    days: `${PROJECT_LEVELS[0].deliveryDays} dias`,
  },
  {
    id:       'institutional',
    title:    'Site Institucional',
    desc:     'Presença digital profissional com SEO local e nacional para que seu cliente te encontre antes do concorrente.',
    badge:    { label: 'SEO local', color: 'cyan' as const },
    accent:   '#00C2E0',
    iconBg:   'bg-[rgba(0,194,224,0.10)]',
    topBar:   'bg-cyan',
    bullets: [
      'SEO completo + JSON-LD',
      'Otimizado para Fortaleza e Brasil',
      'Dark mode + acessibilidade WCAG 2.2',
      'Entrega em até 14 dias',
    ],
    days: '14 dias',
  },
  {
    id:       'ecommerce',
    title:    'E-commerce',
    desc:     'Lojas virtuais rápidas, seguras e otimizadas para conversão — do catálogo ao checkout em um fluxo sem atrito.',
    badge:    { label: 'Premium', color: 'gold' as const },
    accent:   '#F0A500',
    iconBg:   'bg-[rgba(240,165,0,0.10)]',
    topBar:   'bg-gold',
    bullets: [
      'Integração com meios de pagamento',
      'Painel admin para gerenciar produtos',
      'Performance máxima no mobile',
      'LGPD e segurança em dia',
    ],
    days: `${PROJECT_LEVELS[2].deliveryDays} dias`,
  },
  {
    id:       'web-app',
    title:    'Aplicação Web',
    desc:     'Sistemas e dashboards que automatizam processos, centralizam dados e escalam junto com o seu negócio.',
    badge:    { label: 'Enterprise', color: 'green' as const },
    accent:   '#22c55e',
    iconBg:   'bg-[rgba(34,197,94,0.10)]',
    topBar:   'bg-[#22c55e]',
    bullets: [
      'Autenticação e painel admin',
      'Integrações via API REST',
      'CI/CD configurado na Vercel',
      'Suporte técnico pós-entrega',
    ],
    days: `${PROJECT_LEVELS[2].deliveryDays} dias`,
  },
] as const

/* ── Badge colors ──────────────────────────────────────────────────────────── */
const BADGE_STYLES = {
  blue:  'bg-accent-light  text-[#0050CC]',
  cyan:  'bg-cyan-light    text-[#007A8C]',
  gold:  'bg-gold-light    text-[#8A5C00]',
  green: 'bg-[#DCFCE7]     text-[#166534]',
} as const

/* ── Bullet color per service ──────────────────────────────────────────────── */
const BULLET_STYLES = {
  'landing-page': 'bg-accent',
  institutional:  'bg-cyan',
  ecommerce:      'bg-gold',
  'web-app':      'bg-[#22c55e]',
} as const

/* ── Ícones SVG ────────────────────────────────────────────────────────────── */
function IconLandingPage({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M3 9h18M9 21V9"/>
    </svg>
  )
}
function IconInstitutional({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  )
}
function IconEcommerce({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  )
}
function IconWebApp({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <path d="M8 21h8M12 17v4"/>
    </svg>
  )
}

const SERVICE_ICONS = {
  'landing-page': IconLandingPage,
  institutional:  IconInstitutional,
  ecommerce:      IconEcommerce,
  'web-app':      IconWebApp,
} as const

/* ── Animações ─────────────────────────────────────────────────────────────── */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const cardAnim = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
}

const headerAnim = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
}

/* ── Componente principal ──────────────────────────────────────────────────── */
export default function Services() {
  return (
    <section id="servicos" className="bg-surface section-padding">
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
            O que entregamos
          </p>
          <h2 className="text-h1 font-syne text-text-dark mb-3">
            Soluções digitais para{' '}
            <span className="text-accent">cada etapa</span>{' '}
            do seu negócio
          </h2>
          <p className="text-body-lg text-text-muted max-w-[520px] leading-relaxed">
            Do primeiro site ao sistema completo — entregamos com tecnologia de
            ponta, prazos reais e foco total em resultado.
          </p>
        </motion.div>

        {/* Grid de cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {SERVICES_DATA.map((service) => {
            const Icon = SERVICE_ICONS[service.id]
            return (
              <ServiceCard
                key={service.id}
                service={service}
                Icon={<Icon color={service.accent} />}
              />
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}

/* ── ServiceCard ───────────────────────────────────────────────────────────── */
interface ServiceCardProps {
  service: typeof SERVICES_DATA[number]
  Icon: React.ReactNode
}

function ServiceCard({ service, Icon }: ServiceCardProps) {
  return (
    <motion.div
      variants={cardAnim}
      className="group bg-white border border-border rounded-nx-lg p-7 relative overflow-hidden transition-all duration-nx-default hover:-translate-y-0.5 hover:shadow-nx-md"
    >
      {/* Barra de cor no topo */}
      <div
        className={cn('absolute top-0 inset-x-0 h-[3px] rounded-t-nx-lg', service.topBar)}
        aria-hidden="true"
      />

      {/* Ícone */}
      <div className={cn('w-12 h-12 rounded-[12px] flex items-center justify-center mb-[18px]', service.iconBg)}>
        {Icon}
      </div>

      {/* Badge */}
      <span className={cn(
        'inline-block text-[11px] font-[500] px-2.5 py-[3px] rounded-nx-full mb-4',
        BADGE_STYLES[service.badge.color],
      )}>
        {service.badge.label}
      </span>

      {/* Título */}
      <h3 className="font-syne text-h3 font-[600] text-text-dark mb-2 tracking-[0.02em]">
        {service.title}
      </h3>

      {/* Descrição */}
      <p className="text-body-sm text-text-muted leading-relaxed mb-[18px]">
        {service.desc}
      </p>

      {/* Bullets */}
      <ul className="flex flex-col gap-[7px]" role="list">
        {service.bullets.map((b) => (
          <li key={b} className="flex items-start gap-2 text-body-sm text-text-muted">
            <span
              className={cn(
                'w-[5px] h-[5px] rounded-full mt-[6px] flex-shrink-0',
                BULLET_STYLES[service.id],
              )}
              aria-hidden="true"
            />
            {b}
          </li>
        ))}
      </ul>

      {/* Rodapé do card */}
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
        <Link
          href="#contato"
          className="text-body-sm font-[500] flex items-center gap-1 transition-colors duration-nx-fast"
          style={{ color: service.accent }}
          aria-label={`Solicitar proposta para ${service.title}`}
        >
          Solicitar proposta
          <span aria-hidden="true">→</span>
        </Link>
        <span className="text-caption text-text-muted">
          A partir de {service.days}
        </span>
      </div>
    </motion.div>
  )
}