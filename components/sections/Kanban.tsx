'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/* ── Tipos ─────────────────────────────────────────────────────────────────── */
interface KanbanCard {
  label:     string
  labelColor: keyof typeof LABEL_STYLES
  title:     string
  owner:     'cliente' | 'nexatech'
  progress?: number
}

interface KanbanColumn {
  id:        string
  title:     string
  dotColor:  string
  cards:     KanbanCard[]
}

/* ── Estilos de label por cor ──────────────────────────────────────────────── */
const LABEL_STYLES = {
  gray:   'bg-[rgba(255,255,255,0.06)]   text-text-muted',
  blue:   'bg-[rgba(0,102,255,0.15)]     text-accent-mid',
  purple: 'bg-[rgba(139,92,246,0.12)]    text-[#a78bfa]',
  cyan:   'bg-[rgba(0,194,224,0.12)]     text-cyan',
  gold:   'bg-[rgba(240,165,0,0.12)]     text-gold',
  green:  'bg-[rgba(34,197,94,0.12)]     text-[#4ade80]',
} as const

/* ── Cor da barra de progresso por etapa ───────────────────────────────────── */
const PROGRESS_COLORS: Record<string, string> = {
  briefing:      '#6B7A9B',
  design:        '#0066FF',
  desenvolvimento: '#00C2E0',
  revisao:       '#F0A500',
  entrega:       '#22c55e',
}

/* ── Dados do board ────────────────────────────────────────────────────────── */
const COLUMNS: KanbanColumn[] = [
  {
    id:       'briefing',
    title:    'Briefing',
    dotColor: 'bg-text-muted',
    cards: [
      {
        label:      'Formulário',
        labelColor: 'gray',
        title:      'Preenchimento do briefing de projeto',
        owner:      'cliente',
        progress:   100,
      },
      {
        label:      'Reunião',
        labelColor: 'gray',
        title:      'Alinhamento de escopo e expectativas',
        owner:      'nexatech',
        progress:   100,
      },
    ],
  },
  {
    id:       'design',
    title:    'Design',
    dotColor: 'bg-accent',
    cards: [
      {
        label:      'Wireframe',
        labelColor: 'blue',
        title:      'Estrutura e arquitetura das seções',
        owner:      'nexatech',
        progress:   100,
      },
      {
        label:      'Aprovação',
        labelColor: 'blue',
        title:      'Revisão e aprovação do layout pelo cliente',
        owner:      'cliente',
        progress:   60,
      },
      {
        label:      'Tokens',
        labelColor: 'purple',
        title:      'Definição de cores, tipografia e design system',
        owner:      'nexatech',
      },
    ],
  },
  {
    id:       'desenvolvimento',
    title:    'Desenvolvimento',
    dotColor: 'bg-cyan',
    cards: [
      {
        label:      'Next.js',
        labelColor: 'cyan',
        title:      'Implementação das seções e componentes',
        owner:      'nexatech',
        progress:   75,
      },
      {
        label:      'SEO',
        labelColor: 'cyan',
        title:      'Metadados, JSON-LD e Core Web Vitals',
        owner:      'nexatech',
        progress:   50,
      },
      {
        label:      'Integrações',
        labelColor: 'cyan',
        title:      'Analytics, formulário e serviços externos',
        owner:      'nexatech',
      },
    ],
  },
  {
    id:       'revisao',
    title:    'Revisão',
    dotColor: 'bg-gold',
    cards: [
      {
        label:      'Staging',
        labelColor: 'gold',
        title:      'Deploy em homologação para aprovação final',
        owner:      'cliente',
        progress:   40,
      },
      {
        label:      'Ajustes',
        labelColor: 'gold',
        title:      'Até 2 rodadas de ajustes incluídas',
        owner:      'nexatech',
      },
    ],
  },
  {
    id:       'entrega',
    title:    'Entrega',
    dotColor: 'bg-[#22c55e]',
    cards: [
      {
        label:      'Produção',
        labelColor: 'green',
        title:      'Deploy na Vercel com domínio configurado',
        owner:      'nexatech',
        progress:   100,
      },
      {
        label:      'Handoff',
        labelColor: 'green',
        title:      'Código via GitHub + suporte pós-entrega',
        owner:      'cliente',
        progress:   100,
      },
    ],
  },
]

/* ── Animações ─────────────────────────────────────────────────────────────── */
const boardContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const colAnim = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
}

const headerAnim = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
}

/* ── Componente principal ──────────────────────────────────────────────────── */
export default function Kanban() {
  return (
    <section id="processo" className="bg-navy section-padding">
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
            Como trabalhamos
          </p>
          <h2 className="text-h1 font-syne text-[#E8EDF5] mb-3">
            Do briefing à{' '}
            <span className="text-accent">entrega em produção</span>
          </h2>
          <p className="text-body-lg text-text-muted max-w-[520px] leading-relaxed">
            Um processo claro, sem surpresas. Você acompanha cada etapa em
            tempo real e aprova antes de avançar.
          </p>
        </motion.div>

        {/* Board com scroll horizontal no mobile */}
        <div className="overflow-x-auto pb-2">
          <motion.div
            className="grid grid-cols-5 gap-3 min-w-[860px]"
            variants={boardContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            {COLUMNS.map((col) => (
              <KanbanCol key={col.id} col={col} />
            ))}
          </motion.div>
        </div>

        {/* Legenda de responsáveis */}
        <motion.div
          className="flex flex-wrap items-center gap-5 mt-8"
          variants={headerAnim}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <span className="text-caption text-text-muted">Responsáveis:</span>
          <span className="flex items-center gap-2 text-caption text-text-muted">
            <Avatar initial="N" /> NEXATECH
          </span>
          <span className="flex items-center gap-2 text-caption text-text-muted">
            <Avatar initial="C" color="bg-[rgba(255,255,255,0.12)]" textColor="text-[#E8EDF5]" /> Cliente
          </span>
        </motion.div>

      </div>
    </section>
  )
}

/* ── KanbanCol ─────────────────────────────────────────────────────────────── */
function KanbanCol({ col }: { col: KanbanColumn }) {
  return (
    <motion.div
      variants={colAnim}
      className="bg-[#0A1828] rounded-nx-md p-4 border border-[rgba(255,255,255,0.06)] flex flex-col"
    >
      {/* Cabeçalho da coluna */}
      <div className="flex items-center gap-2 mb-3.5">
        <span className={cn('w-2 h-2 rounded-full flex-shrink-0', col.dotColor)} aria-hidden="true" />
        <span className="text-caption font-[500] text-[#E8EDF5] tracking-[0.04em]">
          {col.title}
        </span>
        <span className="ml-auto text-[11px] text-text-muted bg-[rgba(255,255,255,0.06)] px-[7px] py-[1px] rounded-nx-full">
          {col.cards.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2">
        {col.cards.map((card, i) => (
          <KanbanCard key={i} card={card} colId={col.id} />
        ))}
      </div>
    </motion.div>
  )
}

/* ── KanbanCard ────────────────────────────────────────────────────────────── */
function KanbanCard({ card, colId }: { card: KanbanCard; colId: string }) {
  const progressColor = PROGRESS_COLORS[colId] ?? '#0066FF'

  return (
    <div className="bg-navy border border-[rgba(255,255,255,0.07)] rounded-[10px] p-3 transition-colors duration-nx-fast hover:border-[rgba(255,255,255,0.15)]">
      {/* Label */}
      <span
        className={cn(
          'inline-block text-[10px] font-[500] px-[7px] py-[2px] rounded-nx-full mb-2',
          LABEL_STYLES[card.labelColor],
        )}
      >
        {card.label}
      </span>

      {/* Título */}
      <p className="text-[12px] font-[500] text-[#c8d0e0] leading-[1.4] mb-2">
        {card.title}
      </p>

      {/* Responsável */}
      <div className="flex items-center gap-1.5">
        <Avatar
          initial={card.owner === 'nexatech' ? 'N' : 'C'}
          size="sm"
          color={card.owner === 'nexatech' ? 'bg-accent' : 'bg-[rgba(255,255,255,0.12)]'}
          textColor={card.owner === 'nexatech' ? 'text-white' : 'text-[#E8EDF5]'}
        />
        <span className="text-[11px] text-text-muted capitalize">
          {card.owner === 'nexatech' ? 'NEXATECH' : 'Cliente'}
        </span>
      </div>

      {/* Barra de progresso */}
      {card.progress !== undefined && (
        <div
          className="h-[3px] bg-[rgba(255,255,255,0.08)] rounded-full mt-2.5 overflow-hidden"
          role="progressbar"
          aria-valuenow={card.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progresso: ${card.progress}%`}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: progressColor }}
            initial={{ width: 0 }}
            whileInView={{ width: `${card.progress}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
          />
        </div>
      )}
    </div>
  )
}

/* ── Avatar ────────────────────────────────────────────────────────────────── */
interface AvatarProps {
  initial:    string
  size?:      'sm' | 'md'
  color?:     string
  textColor?: string
}

function Avatar({
  initial,
  size = 'md',
  color = 'bg-accent',
  textColor = 'text-white',
}: AvatarProps) {
  return (
    <span
      className={cn(
        'rounded-full flex items-center justify-center font-[600] flex-shrink-0',
        size === 'sm' ? 'w-[18px] h-[18px] text-[9px]' : 'w-5 h-5 text-[10px]',
        color,
        textColor,
      )}
      aria-hidden="true"
    >
      {initial}
    </span>
  )
}