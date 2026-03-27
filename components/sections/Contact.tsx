'use client'

import { motion } from 'framer-motion'
import { COMPANY, SERVICES } from '@/lib/constants'

/* ── Animações ─────────────────────────────────────────────────────────────── */
const headerAnim = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
}

const cardsAnim = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
}

const cardAnim = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
}

/* ── Helper: gera mailto com assunto e corpo pré-preenchidos ───────────────── */
function mailtoLink(subject: string) {
  const body = `Olá, gostaria de solicitar um orçamento para: ${subject}\n\nNome:\nEmpresa:\nDescrição do projeto:\n`
  return `mailto:${COMPANY.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

/* ── Componente principal ──────────────────────────────────────────────────── */
export default function Contact() {
  return (
    <section id="contato" className="bg-surface section-padding">
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
            Vamos conversar
          </p>
          <h2 className="text-h1 font-syne text-text-dark mb-3">
            Pronto para transformar{' '}
            <span className="text-accent">seu negócio?</span>
          </h2>
          <p className="text-body-lg text-text-muted max-w-[480px] leading-relaxed">
            Escolha o tipo de projeto e envie um e-mail direto — respondemos
            em até{' '}
            <strong className="text-text-dark font-[500]">24 horas</strong>{' '}
            com um orçamento detalhado.
          </p>
        </motion.div>

        {/* Cards de serviço — clique abre cliente de e-mail pré-preenchido */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
          variants={cardsAnim}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {SERVICES.map((service) => (
            <motion.a
              key={service.id}
              variants={cardAnim}
              href={mailtoLink(`${service.title} — Solicitação de orçamento`)}
              className="group bg-white border border-border rounded-nx-lg p-6 flex flex-col gap-3 transition-all duration-nx-default hover:-translate-y-0.5 hover:shadow-nx-md hover:border-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={`Solicitar orçamento para ${service.title}`}
            >
              <div className="w-10 h-10 bg-accent-light rounded-[10px] flex items-center justify-center flex-shrink-0">
                <ServiceIcon id={service.id} />
              </div>
              <div>
                <h3 className="font-syne text-h4 font-[600] text-text-dark mb-1 tracking-[0.02em]">
                  {service.title}
                </h3>
                <p className="text-caption text-text-muted leading-relaxed">
                  {service.description}
                </p>
              </div>
              <span className="mt-auto text-caption font-[500] text-accent flex items-center gap-1 group-hover:gap-2 transition-all duration-nx-fast">
                Solicitar orçamento
                <span aria-hidden="true">→</span>
              </span>
            </motion.a>
          ))}
        </motion.div>

        {/* CTA principal */}
        <motion.div
          className="bg-navy rounded-nx-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8"
          variants={headerAnim}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {/* Texto */}
          <div>
            <p className="text-caption text-accent font-[500] tracking-[0.1em] uppercase mb-2">
              Contato direto
            </p>
            <h3 className="font-syne text-h2 font-[600] text-[#E8EDF5] mb-2">
              Prefere ir direto ao ponto?
            </h3>
            <p className="text-body-sm text-text-muted max-w-sm leading-relaxed">
              Envie um e-mail com a descrição do seu projeto e retornamos com
              proposta completa em até 24 horas.
            </p>

            {/* Dados de contato */}
            <div className="flex flex-wrap gap-5 mt-6">
              <InfoItem icon={<IconMail />} label="E-mail">
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="text-accent hover:text-accent-mid transition-colors duration-nx-fast"
                >
                  {COMPANY.email}
                </a>
              </InfoItem>
              <InfoItem icon={<IconPin />} label="Localização">
                <span className="text-[#c8d0e0]">
                  {COMPANY.city}, {COMPANY.state}
                </span>
              </InfoItem>
              <InfoItem icon={<IconId />} label="CNPJ">
                <span className="font-mono text-caption text-text-muted">
                  {COMPANY.cnpj}
                </span>
              </InfoItem>
            </div>
          </div>

          {/* Botão + diferenciais */}
          <div className="flex flex-col items-center md:items-end gap-3 flex-shrink-0">
            <a
              href={mailtoLink('Solicitação de orçamento — CCP NEXATECH')}
              className="inline-flex items-center gap-2 bg-accent text-white text-cta font-[500] px-8 py-4 rounded-nx-sm shadow-nx-accent transition-all duration-nx-fast hover:scale-[1.02] hover:shadow-[0_6px_28px_rgba(0,102,255,0.45)] active:scale-[0.98] whitespace-nowrap"
            >
              Enviar e-mail agora
              <span aria-hidden="true">→</span>
            </a>
            <p className="text-caption text-text-muted">
              Resposta garantida em até 24h
            </p>

            <div className="flex flex-col gap-1.5 mt-1">
              {[
                'Contrato formal com CNPJ',
                'Pagamento em 2x',
                'Código entregue via GitHub',
              ].map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-1.5 text-caption text-text-muted"
                >
                  <span
                    className="w-1 h-1 rounded-full bg-accent flex-shrink-0"
                    aria-hidden="true"
                  />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

/* ── Sub-componentes ───────────────────────────────────────────────────────── */

function InfoItem({
  icon,
  label,
  children,
}: {
  icon:     React.ReactNode
  label:    string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-7 h-7 bg-[rgba(0,102,255,0.15)] rounded-[6px] flex items-center justify-center flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-[11px] text-text-muted uppercase tracking-[0.08em] font-[500] mb-0.5">
          {label}
        </p>
        <div className="text-body-sm">{children}</div>
      </div>
    </div>
  )
}

/* ── Ícones de serviço ─────────────────────────────────────────────────────── */
function ServiceIcon({ id }: { id: string }) {
  const p = {
    width: '18', height: '18', viewBox: '0 0 24 24', fill: 'none',
    stroke: '#0066FF', strokeWidth: '1.8',
    strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  if (id === 'landing-page')  return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
  if (id === 'institutional') return <svg {...p}><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
  if (id === 'web-app')       return <svg {...p}><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
  return <svg {...p}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
}

/* ── Ícones de info ────────────────────────────────────────────────────────── */
function IconMail() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="#0066FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  )
}
function IconPin() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="#0066FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  )
}
function IconId() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="#0066FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 3v4M8 3v4M2 11h20"/>
    </svg>
  )
}