'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/* ── Tipos ─────────────────────────────────────────────────────────────────── */
type BadgeColor = 'blue' | 'cyan' | 'gold' | 'green' | 'gray'
type FilterKey  = 'todos' | 'landing-page' | 'ecommerce' | 'dashboard' | 'institucional'

interface Project {
  id:          string
  title:       string
  description: string
  filter:      FilterKey
  tags:        { label: string; color: BadgeColor }[]
  stack:       string[]
  level:       { label: string; color: BadgeColor }
  deliveryDays: number
  slug:        string
  preview:     React.ReactNode
}

/* ── Estilos de badge ──────────────────────────────────────────────────────── */
const BADGE = {
  blue:  'bg-[rgba(0,102,255,0.15)]   text-accent-mid',
  cyan:  'bg-[rgba(0,194,224,0.12)]   text-cyan',
  gold:  'bg-[rgba(240,165,0,0.12)]   text-gold',
  green: 'bg-[rgba(34,197,94,0.12)]   text-[#4ade80]',
  gray:  'bg-[rgba(255,255,255,0.06)] text-text-muted',
} as const

/* ── Filtros ───────────────────────────────────────────────────────────────── */
const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'todos',         label: 'Todos'        },
  { key: 'landing-page',  label: 'Landing Page' },
  { key: 'ecommerce',     label: 'E-commerce'   },
  { key: 'dashboard',     label: 'Dashboard'    },
  { key: 'institucional', label: 'Institucional' },
]

/* ── Projetos ──────────────────────────────────────────────────────────────── */
const PROJECTS: Project[] = [
  {
    id:           'landing-saas',
    title:        'FlowDesk — Landing SaaS',
    description:  'Landing page de produto SaaS com hero animado, seção de features, pricing e integração com lista de espera. Dark mode nativo.',
    filter:       'landing-page',
    tags:         [{ label: 'Landing Page', color: 'blue' }, { label: 'SaaS', color: 'cyan' }],
    stack:        ['Next.js', 'TailwindCSS', 'Framer Motion', 'Resend'],
    level:        { label: 'Nível Pro', color: 'gray' },
    deliveryDays: 14,
    slug:         'landing-saas',
    preview:      <PreviewSaaS />,
  },
  {
    id:           'ecommerce',
    title:        'Áurea Store — E-commerce',
    description:  'Loja virtual completa com catálogo, filtros, carrinho e checkout. Integração com Stripe e painel admin para gestão de produtos.',
    filter:       'ecommerce',
    tags:         [{ label: 'E-commerce', color: 'gold' }, { label: 'Moda', color: 'cyan' }],
    stack:        ['Next.js', 'TailwindCSS', 'Stripe', 'Prisma', 'PostgreSQL'],
    level:        { label: 'Enterprise', color: 'gold' },
    deliveryDays: 30,
    slug:         'ecommerce',
    preview:      <PreviewEcommerce />,
  },
  {
    id:           'dashboard-admin',
    title:        'NexPanel — Dashboard Admin',
    description:  'Sistema administrativo com autenticação, gráficos de métricas, gestão de usuários e permissões por role. Dark mode.',
    filter:       'dashboard',
    tags:         [{ label: 'Dashboard', color: 'blue' }, { label: 'Admin', color: 'cyan' }],
    stack:        ['Next.js', 'NextAuth', 'Recharts', 'Prisma', 'PostgreSQL'],
    level:        { label: 'Enterprise', color: 'gold' },
    deliveryDays: 30,
    slug:         'dashboard-admin',
    preview:      <PreviewDashboard />,
  },
  {
    id:           'site-clinica',
    title:        'Clínica Serena — Site Saúde',
    description:  'Site institucional para clínica de saúde com agendamento online, equipe médica, especialidades e SEO local para Fortaleza.',
    filter:       'institucional',
    tags:         [{ label: 'Institucional', color: 'green' }, { label: 'Saúde', color: 'cyan' }],
    stack:        ['Next.js', 'TailwindCSS', 'JSON-LD', 'Cal.com'],
    level:        { label: 'Nível Pro', color: 'blue' },
    deliveryDays: 14,
    slug:         'site-clinica',
    preview:      <PreviewClinica />,
  },
]

/* ── Animações ─────────────────────────────────────────────────────────────── */
const headerAnim = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
}

const gridAnim = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
}

const cardAnim = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show:   { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
  exit:   { opacity: 0, scale: 0.96, transition: { duration: 0.2 } },
}

/* ── Componente principal ──────────────────────────────────────────────────── */
export default function Portfolio() {
  const [active, setActive] = useState<FilterKey>('todos')

  const filtered = active === 'todos'
    ? PROJECTS
    : PROJECTS.filter((p) => p.filter === active)

  return (
    <section id="portfolio" className="bg-navy section-padding">
      <div className="container-nx">

        {/* Cabeçalho */}
        <motion.div
          className="mb-10"
          variants={headerAnim}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
        >
          <p className="text-caption text-accent font-[500] tracking-[0.12em] uppercase mb-3">
            Portfólio
          </p>
          <h2 className="text-h1 font-syne text-[#E8EDF5] mb-3">
            Projetos que{' '}
            <span className="text-accent">provam o que fazemos</span>
          </h2>
          <p className="text-body-lg text-text-muted max-w-[520px] leading-relaxed">
            Templates reais, construídos com o mesmo rigor técnico dos projetos
            para clientes. Cada um pode ser personalizado para o seu negócio.
          </p>
        </motion.div>

        {/* Filtros */}
        <motion.div
          className="flex flex-wrap gap-2 mb-8"
          variants={headerAnim}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          role="tablist"
          aria-label="Filtrar projetos por categoria"
        >
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActive(f.key)}
              role="tab"
              aria-selected={active === f.key}
              className={cn(
                'text-caption font-[500] px-4 py-[5px] rounded-nx-full border transition-all duration-nx-fast',
                active === f.key
                  ? 'bg-[rgba(0,102,255,0.15)] border-[rgba(0,102,255,0.40)] text-accent-mid'
                  : 'border-[rgba(255,255,255,0.10)] text-text-muted hover:border-[rgba(255,255,255,0.20)] hover:text-[#c8d0e0]',
              )}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* Grid de projetos */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          variants={gridAnim}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-12 text-center"
          variants={headerAnim}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <p className="text-body-sm text-text-muted mb-4">
            Quer algo parecido para o seu negócio?
          </p>
          <Link
            href="#contato"
            className="inline-flex items-center gap-2 bg-accent text-white text-cta font-[500] px-8 py-3.5 rounded-nx-sm shadow-nx-accent transition-all duration-nx-fast hover:scale-[1.02] hover:shadow-[0_6px_28px_rgba(0,102,255,0.45)] active:scale-[0.98]"
          >
            Solicitar projeto similar
            <span aria-hidden="true">→</span>
          </Link>
        </motion.div>

      </div>
    </section>
  )
}

/* ── ProjectCard ───────────────────────────────────────────────────────────── */
function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      layout
      variants={cardAnim}
      initial="hidden"
      animate="show"
      exit="exit"
      className="group bg-[#0A1828] border border-[rgba(255,255,255,0.07)] rounded-nx-lg overflow-hidden transition-all duration-nx-default hover:border-[rgba(0,102,255,0.35)] hover:-translate-y-[3px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]"
    >
      {/* Preview */}
      <div className="relative aspect-video overflow-hidden">
        {project.preview}
        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,102,255,0.08)] opacity-0 group-hover:opacity-100 transition-opacity duration-nx-default">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 bg-accent text-white text-caption font-[500] px-4 py-2 rounded-nx-sm shadow-nx-accent"
            aria-label={`Ver projeto ${project.title}`}
          >
            Ver projeto
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="p-[22px]">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.tags.map((tag) => (
            <span
              key={tag.label}
              className={cn(
                'text-[11px] font-[500] px-[9px] py-[2px] rounded-nx-full',
                BADGE[tag.color],
              )}
            >
              {tag.label}
            </span>
          ))}
        </div>

        {/* Título */}
        <h3 className="font-syne text-[17px] font-[600] text-[#E8EDF5] mb-1.5 tracking-[0.02em]">
          {project.title}
        </h3>

        {/* Descrição */}
        <p className="text-body-sm text-text-muted leading-relaxed mb-4">
          {project.description}
        </p>

        {/* Stack */}
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="text-[11px] text-text-muted bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-[4px] px-[7px] py-[2px] font-mono"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)]">
          <span className={cn(
            'text-[11px] font-[500] px-[9px] py-[2px] rounded-nx-full',
            BADGE[project.level.color],
          )}>
            {project.level.label}
          </span>
          <span className="flex items-center gap-1 text-caption text-text-muted">
            <IconClock />
            {project.deliveryDays} dias de entrega
          </span>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Preview components (mockups SVG inline) ───────────────────────────────── */

function PreviewSaaS() {
  return (
    <div className="w-full h-full bg-[#060D1F] flex items-center justify-center p-4">
      <div className="w-[88%] h-[80%] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg overflow-hidden flex flex-col">
        <div className="h-6 bg-[rgba(255,255,255,0.04)] border-b border-[rgba(255,255,255,0.06)] flex items-center px-3 gap-1.5 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-accent opacity-60" />
          <span className="w-2 h-2 rounded-full bg-[rgba(255,255,255,0.15)]" />
          <span className="w-2 h-2 rounded-full bg-[rgba(255,255,255,0.15)]" />
        </div>
        <div className="flex-1 p-3 flex flex-col gap-2">
          <div className="flex-1 rounded bg-gradient-to-br from-[rgba(0,102,255,0.12)] to-[rgba(0,194,224,0.06)] border border-[rgba(0,102,255,0.15)] flex items-center justify-center">
            <div className="text-center">
              <div className="w-10 h-1 bg-accent rounded mx-auto mb-2" />
              <div className="w-16 h-1.5 bg-[rgba(255,255,255,0.15)] rounded mx-auto mb-1" />
              <div className="w-12 h-1.5 bg-[rgba(255,255,255,0.08)] rounded mx-auto mb-3" />
              <div className="w-14 h-5 bg-accent rounded mx-auto" />
            </div>
          </div>
          <div className="h-2 bg-[rgba(255,255,255,0.08)] rounded w-4/5" />
          <div className="h-2 bg-[rgba(255,255,255,0.05)] rounded w-3/5" />
        </div>
      </div>
    </div>
  )
}

function PreviewEcommerce() {
  return (
    <div className="w-full h-full bg-[#F5F7FA] flex items-center justify-center p-4">
      <div className="w-[88%] h-[80%] bg-white border border-[#E2E8F0] rounded-lg overflow-hidden flex flex-col">
        <div className="h-6 bg-[#F5F7FA] border-b border-[#E2E8F0] flex items-center px-3 gap-2 flex-shrink-0">
          <div className="flex-1 h-2 bg-[#E2E8F0] rounded" />
          <div className="w-8 h-2 bg-accent rounded opacity-70" />
        </div>
        <div className="flex-1 p-3">
          <div className="grid grid-cols-3 gap-2 h-full">
            {[55, 70, 45].map((h, i) => (
              <div key={i} className="bg-[#F5F7FA] border border-[#E2E8F0] rounded flex flex-col items-center justify-end p-2 gap-1">
                <div className="w-full rounded bg-[#E2E8F0]" style={{ height: `${h}%` }} />
                <div className="w-4/5 h-1 bg-[#D1D5DB] rounded" />
                <div className="w-1/2 h-1 bg-accent rounded opacity-60" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PreviewDashboard() {
  return (
    <div className="w-full h-full bg-[#0A0F1E] flex items-center justify-center p-4">
      <div className="w-[88%] h-[80%] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-lg overflow-hidden flex flex-col">
        <div className="h-6 bg-[rgba(255,255,255,0.03)] border-b border-[rgba(255,255,255,0.06)] flex items-center px-3 gap-2 flex-shrink-0">
          <div className="w-10 h-1.5 bg-accent rounded opacity-70" />
          <div className="ml-auto w-4 h-4 bg-[rgba(255,255,255,0.06)] rounded-full" />
        </div>
        <div className="flex-1 p-2 flex gap-2">
          <div className="w-[28%] bg-[rgba(255,255,255,0.03)] rounded border border-[rgba(255,255,255,0.05)] flex flex-col gap-1.5 p-2">
            <div className="h-1.5 w-3/4 bg-accent rounded opacity-50" />
            {[80, 65, 75].map((w, i) => (
              <div key={i} className="h-1 bg-[rgba(255,255,255,0.08)] rounded" style={{ width: `${w}%` }} />
            ))}
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-1.5">
              <div className="bg-[rgba(0,102,255,0.10)] rounded border border-[rgba(0,102,255,0.20)] p-2">
                <div className="h-1 w-3/5 bg-[rgba(0,102,255,0.40)] rounded mb-1.5" />
                <div className="h-2.5 w-2/5 bg-accent rounded opacity-80" />
              </div>
              <div className="bg-[rgba(0,194,224,0.08)] rounded border border-[rgba(0,194,224,0.15)] p-2">
                <div className="h-1 w-3/5 bg-[rgba(0,194,224,0.30)] rounded mb-1.5" />
                <div className="h-2.5 w-2/5 bg-cyan rounded opacity-70" />
              </div>
            </div>
            <div className="flex-1 bg-[rgba(255,255,255,0.03)] rounded border border-[rgba(255,255,255,0.05)] flex items-end p-2 gap-1">
              {[40, 65, 50, 80, 55, 70].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{
                    height: `${h}%`,
                    background: i === 5 ? '#00C2E0' : '#0066FF',
                    opacity: i === 5 ? 0.8 : 0.5 + (i * 0.08),
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PreviewClinica() {
  return (
    <div className="w-full h-full bg-[#F0F7F4] flex items-center justify-center p-4">
      <div className="w-[88%] h-[80%] bg-white border border-[#D1E8DF] rounded-lg overflow-hidden flex flex-col">
        <div className="h-6 bg-[#F0F7F4] border-b border-[#D1E8DF] flex items-center px-3 gap-2 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#0F6E56] opacity-50" />
          <div className="flex-1 h-2 bg-[#D1E8DF] rounded" />
          <div className="w-10 h-2 bg-[#0F6E56] rounded opacity-60" />
        </div>
        <div className="flex-1 p-3 flex flex-col gap-2">
          <div className="flex-1 rounded bg-gradient-to-br from-[rgba(15,110,86,0.08)] to-[rgba(15,110,86,0.03)] border border-[rgba(15,110,86,0.10)] flex items-center justify-center">
            <div className="text-center">
              <div className="w-7 h-7 bg-[rgba(15,110,86,0.15)] rounded-full flex items-center justify-center mx-auto mb-2">
                <div className="w-2.5 h-2.5 bg-[#0F6E56] rounded-full opacity-70" />
              </div>
              <div className="w-14 h-1.5 bg-[rgba(15,110,86,0.30)] rounded mx-auto mb-1" />
              <div className="w-10 h-1.5 bg-[rgba(15,110,86,0.15)] rounded mx-auto mb-3" />
              <div className="w-12 h-4 bg-[#0F6E56] rounded mx-auto opacity-80" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-5 bg-[#F0F7F4] rounded border border-[#D1E8DF]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Ícone ─────────────────────────────────────────────────────────────────── */
function IconClock() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" stroke="#6B7A9B" strokeWidth="1.3" />
      <path d="M8 4.5V8l2.5 1.5" stroke="#6B7A9B" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}