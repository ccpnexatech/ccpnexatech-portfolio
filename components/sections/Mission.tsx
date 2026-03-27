import { cn } from '@/lib/utils'

const MVV_ITEMS = [
  {
    icon: '🎯',
    title: 'Missão',
    text: 'Transformar negócios através de soluções digitais de alto impacto — entregando sites, landing pages e sistemas que geram resultado real para nossos clientes.',
    tag: 'Por que existimos',
    accentColor: 'border-t-accent',
    iconBg: 'bg-[rgba(0,102,255,0.15)]',
    tagColor: 'bg-[rgba(0,102,255,0.15)] text-accent-mid',
  },
  {
    icon: '🔭',
    title: 'Visão',
    text: 'Ser a referência em desenvolvimento web para PMEs no Nordeste, reconhecida pela qualidade técnica, pelo compromisso com prazos e pelo retorno que geramos.',
    tag: 'Para onde vamos',
    accentColor: 'border-t-cyan',
    iconBg: 'bg-[rgba(0,194,224,0.15)]',
    tagColor: 'bg-[rgba(0,194,224,0.12)] text-cyan',
  },
  {
    icon: '⚡',
    title: 'Valores',
    text: 'Clareza acima de decoração. Performance como estética. Entrega com responsabilidade. Código limpo, seguro e escalável. Parceria genuína com o cliente.',
    tag: 'Como atuamos',
    accentColor: 'border-t-gold',
    iconBg: 'bg-[rgba(240,165,0,0.15)]',
    tagColor: 'bg-[rgba(240,165,0,0.12)] text-gold',
  },
] as const

export default function Mission() {
  return (
    <section id="missao" className="bg-navy section-padding">
      <div className="container-nx">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-caption text-accent font-[500] tracking-[0.12em] uppercase mb-3">
            Nossa essência
          </p>
          <h2 className="text-h1 font-syne text-[#E8EDF5]">
            Missão, Visão e Valores
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {MVV_ITEMS.map((item) => (
            <MVVCard key={item.title} {...item} />
          ))}
        </div>

      </div>
    </section>
  )
}

/* ── MVVCard ──────────────────────────────────────────────────────────────── */

interface MVVCardProps {
  icon: string
  title: string
  text: string
  tag: string
  accentColor: string
  iconBg: string
  tagColor: string
}

function MVVCard({ icon, title, text, tag, accentColor, iconBg, tagColor }: MVVCardProps) {
  return (
    <div
      className={cn(
        'bg-[#0A1828] rounded-nx-lg p-7 border border-[rgba(255,255,255,0.08)] border-t-4',
        accentColor,
      )}
    >
      {/* Ícone */}
      <div
        className={cn(
          'w-11 h-11 rounded-[10px] flex items-center justify-center text-xl mb-[18px]',
          iconBg,
        )}
        aria-hidden="true"
      >
        {icon}
      </div>

      {/* Título */}
      <h3 className="font-syne text-h3 font-[600] text-[#E8EDF5] mb-2.5 tracking-[0.04em]">
        {title}
      </h3>

      {/* Texto */}
      <p className="text-body-sm text-text-muted leading-relaxed">{text}</p>

      {/* Tag */}
      <span
        className={cn(
          'inline-block mt-4 text-caption font-[500] px-2.5 py-1 rounded-nx-sm',
          tagColor,
        )}
      >
        {tag}
      </span>
    </div>
  )
}