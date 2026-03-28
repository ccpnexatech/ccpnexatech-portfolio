'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

const MVV = [
  {
    icon: '🎯',
    title: 'Missão',
    text: 'Transformar negócios através de soluções digitais de alto impacto — entregando sites, landing pages e sistemas que geram resultado real para nossos clientes.',
    tag: 'Por que existimos',
    accentClass: 'border-t-accent',
    tagClass: 'bg-[rgba(0,102,255,0.10)] text-accent',
    glowColor: 'rgba(0,102,255,0.08)',
    hoverBorder: 'hover:border-[rgba(0,102,255,0.15)]',
    hoverShadow: 'hover:shadow-[0_16px_48px_rgba(0,102,255,0.08)]',
  },
  {
    icon: '🔭',
    title: 'Visão',
    text: 'Ser a referência em desenvolvimento web para PMEs no Nordeste, reconhecida pela qualidade técnica, pelo compromisso com prazos e pelo retorno que geramos.',
    tag: 'Para onde vamos',
    accentClass: 'border-t-cyan',
    tagClass: 'bg-[rgba(0,194,224,0.10)] text-cyan',
    glowColor: 'rgba(0,194,224,0.08)',
    hoverBorder: 'hover:border-[rgba(0,194,224,0.15)]',
    hoverShadow: 'hover:shadow-[0_16px_48px_rgba(0,194,224,0.08)]',
  },
  {
    icon: '⚡',
    title: 'Valores',
    text: 'Clareza acima de decoração. Performance como estética. Entrega com responsabilidade. Código limpo, seguro e escalável. Parceria genuína com o cliente.',
    tag: 'Como atuamos',
    accentClass: 'border-t-gold',
    tagClass: 'bg-[rgba(240,165,0,0.10)] text-gold',
    glowColor: 'rgba(240,165,0,0.06)',
    hoverBorder: 'hover:border-[rgba(240,165,0,0.15)]',
    hoverShadow: 'hover:shadow-[0_16px_48px_rgba(240,165,0,0.06)]',
  },
] as const

const cardVariant = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  show: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.4, 0, 0.2, 1] },
  }),
}

export default function Mission() {
  const ref            = useRef<HTMLElement>(null)
  const inView         = useInView(ref, { once: true, margin: '-60px' })
  const prefersReduced = useReducedMotion()

  return (
    <section
      id="missao"
      ref={ref}
      className="bg-navy section-padding relative overflow-hidden"
      aria-labelledby="mission-heading"
    >
      {/* Background texture */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(rgba(0,102,255,1) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      </div>

      <div className="relative container-nx">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-14"
        >
          <p className="text-caption text-accent font-[600] tracking-[0.14em] uppercase mb-4 flex items-center justify-center gap-2">
            <span className="w-6 h-px bg-accent/40" aria-hidden="true" />
            Nossa essência
            <span className="w-6 h-px bg-accent/40" aria-hidden="true" />
          </p>
          <h2
            id="mission-heading"
            className="font-syne text-h1 text-[#E8EDF5]"
          >
            Missão, Visão e Valores
          </h2>
        </motion.div>

        {/* Cards — whileHover removido; CSS hover em vez de JS (non-composited fix) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {MVV.map((item, i) => (
            <motion.div
              key={item.title}
              custom={i}
              variants={prefersReduced ? {} : cardVariant}
              initial="hidden"
              animate={inView ? 'show' : 'hidden'}
              className={cn(
                'relative bg-[#0A1828] rounded-nx-lg p-7',
                'border border-[rgba(255,255,255,0.07)] border-t-4',
                item.accentClass,
                'group cursor-default',
                'transition-all duration-300',
                '-translate-y-0 hover:-translate-y-1',
                item.hoverBorder,
                item.hoverShadow,
              )}
            >
              {/* Icon */}
              <div className="w-11 h-11 rounded-[10px] flex items-center justify-center text-xl mb-5 bg-[rgba(255,255,255,0.04)] transition-transform duration-300 group-hover:scale-110" aria-hidden="true">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="font-syne text-h3 font-[600] text-[#E8EDF5] mb-3 tracking-[0.02em]">{item.title}</h3>

              {/* Text */}
              <p className="text-body-sm text-text-muted leading-relaxed mb-5">{item.text}</p>

              {/* Tag */}
              <span className={cn('inline-block text-caption font-[600] px-3 py-1 rounded-nx-sm tracking-[0.04em]', item.tagClass)}>
                {item.tag}
              </span>

              {/* Subtle corner accent */}
              <div
                className="absolute top-0 right-0 w-16 h-16 opacity-10 pointer-events-none rounded-tr-nx-lg overflow-hidden"
                aria-hidden="true"
              >
                <div className="absolute top-0 right-0 w-full h-full" style={{ background: `linear-gradient(135deg, transparent 50%, ${item.glowColor.replace('0.0', '0.3')})` }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}