'use client'

import { useRef, useState, useCallback } from 'react'
import { motion, useInView, useReducedMotion, AnimatePresence } from 'framer-motion'
import { COMPANY, SERVICES } from '@/lib/constants'

interface FormData {
  name: string
  email: string
  company: string
  service: string
  level: string
  budget: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  service?: string
  message?: string
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

const BUDGET_OPTIONS = [
  'Até R$ 1.000',
  'R$ 1.000 – R$ 2.500',
  'R$ 2.500 – R$ 5.000',
  'Acima de R$ 5.000',
  'A definir / quero uma proposta',
]

const LEVEL_OPTIONS = ['Basic (7 dias)', 'Pro (14 dias)', 'Enterprise (30 dias)']

const RATE_LIMIT_WINDOW = 60_000
const MAX_ATTEMPTS = 3

export default function Contact() {
  const ref           = useRef<HTMLElement>(null)
  const inView        = useInView(ref, { once: true, margin: '-60px' })
  const prefersReduced = useReducedMotion()
  const attemptsRef   = useRef<number[]>([])

  const [form, setForm]           = useState<FormData>({ name:'', email:'', company:'', service:'', level:'', budget:'', message:'' })
  const [touched, setTouched]     = useState<Partial<Record<keyof FormData, boolean>>>({})
  const [status, setStatus]       = useState<FormStatus>('idle')
  const [errorMsg, setErrorMsg]   = useState('')

  // Sanitise
  const sanitise = (v: string) => v.replace(/[\x00-\x1F\x7F]/g, '').trimStart()

  // Validate
  const validate = (f: FormData): FormErrors => {
    const e: FormErrors = {}
    if (!f.name.trim() || f.name.trim().length < 2) e.name = 'Nome obrigatório (mínimo 2 caracteres)'
    if (!f.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) e.email = 'E-mail inválido'
    if (!f.service) e.service = 'Selecione o tipo de projeto'
    if (!f.message.trim() || f.message.trim().length < 20) e.message = 'Descreva o projeto (mínimo 20 caracteres)'
    return e
  }

  const errors  = validate(form)
  const formOk  = Object.keys(errors).length === 0
  const getErr  = (f: keyof FormData) => touched[f] ? errors[f as keyof FormErrors] : undefined

  const touchAll = () => setTouched({ name:true, email:true, service:true, message:true })

  // Rate limit (client signal)
  const checkRate = useCallback((): { ok: boolean; wait: number } => {
    const now = Date.now()
    attemptsRef.current = attemptsRef.current.filter(t => now - t < RATE_LIMIT_WINDOW)
    if (attemptsRef.current.length >= MAX_ATTEMPTS) {
      const wait = Math.ceil((attemptsRef.current[0] + RATE_LIMIT_WINDOW - now) / 1000)
      return { ok: false, wait }
    }
    attemptsRef.current.push(now)
    return { ok: true, wait: 0 }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    touchAll()
    if (!formOk) return

    const { ok, wait } = checkRate()
    if (!ok) { setStatus('error'); setErrorMsg(`Muitas tentativas. Aguarde ${wait}s.`); return }

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Erro ao enviar')
      }
      setStatus('success')
      setForm({ name:'', email:'', company:'', service:'', level:'', budget:'', message:'' })
      setTouched({})
    } catch (err: unknown) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Erro interno. Tente novamente.')
    }
  }

  const inputCls = (field: keyof FormData) =>
    `w-full bg-[rgba(255,255,255,0.05)] border rounded-nx-sm text-body text-[#E8EDF5] placeholder-text-muted/50 px-4 py-3 outline-none transition-all duration-150 focus:bg-[rgba(255,255,255,0.07)] ${
      getErr(field)
        ? 'border-red-500/60 focus:border-red-400'
        : 'border-[rgba(255,255,255,0.10)] focus:border-accent focus:shadow-[0_0_0_3px_rgba(0,102,255,0.12)]'
    }`

  return (
    <section
      id="contato"
      ref={ref}
      className="bg-surface section-padding relative overflow-hidden"
      aria-labelledby="contact-heading"
    >
      {/* Soft blue gradient top-right */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none opacity-[0.04]"
        style={{ background: 'radial-gradient(circle, rgba(0,102,255,1) 0%, transparent 70%)', filter: 'blur(80px)' }}
        aria-hidden="true"
      />

      <div className="relative container-nx">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="mb-12"
        >
          <p className="text-caption text-accent font-[600] tracking-[0.14em] uppercase mb-4 flex items-center gap-2">
            <span className="w-8 h-px bg-accent/40" aria-hidden="true" />
            Vamos conversar
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 id="contact-heading" className="font-syne text-h1 text-text-dark max-w-[460px] leading-[1.1]">
              Pronto para transformar{' '}
              <span className="text-accent">seu negócio?</span>
            </h2>
            <p className="text-body-sm text-text-muted max-w-[300px] leading-relaxed">
              Resposta em até <strong className="text-text-dark font-[500]">24 horas</strong> com orçamento detalhado.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 items-start">

          {/* ── Form ──────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          >
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                  className="bg-[rgba(34,197,94,0.06)] border border-[rgba(34,197,94,0.20)] rounded-nx-lg p-10 text-center"
                  role="status" aria-live="polite"
                >
                  <div className="w-16 h-16 rounded-full bg-[rgba(34,197,94,0.12)] border border-[rgba(34,197,94,0.25)] flex items-center justify-center mx-auto mb-5">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  </div>
                  <h3 className="font-syne text-h3 font-[600] text-text-dark mb-3">Mensagem enviada!</h3>
                  <p className="text-body text-text-muted mb-6 leading-relaxed">
                    Recebemos seu pedido de orçamento. Retornaremos em até <strong className="text-text-dark font-[500]">24 horas úteis</strong> com uma proposta detalhada.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="text-body-sm font-[500] text-accent hover:underline"
                  >
                    Enviar outra mensagem →
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  noValidate
                  aria-label="Formulário de contato e orçamento"
                  className="bg-navy rounded-nx-lg p-7 border border-[rgba(255,255,255,0.06)] flex flex-col gap-5"
                >
                  {/* Row 1: name + email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="ct-name" className="block text-caption font-[600] text-text-muted mb-2 tracking-[0.04em]">
                        Nome completo <span className="text-red-400" aria-label="obrigatório">*</span>
                      </label>
                      <input
                        id="ct-name" type="text" autoComplete="name"
                        value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: sanitise(e.target.value).slice(0, 100) }))}
                        onBlur={() => setTouched(p => ({ ...p, name: true }))}
                        placeholder="Seu nome"
                        maxLength={100} required aria-required="true"
                        aria-invalid={!!getErr('name')} aria-describedby={getErr('name') ? 'ct-name-err' : undefined}
                        className={inputCls('name')}
                      />
                      {getErr('name') && <p id="ct-name-err" role="alert" className="text-[11px] text-red-400 mt-1.5">{getErr('name')}</p>}
                    </div>
                    <div>
                      <label htmlFor="ct-email" className="block text-caption font-[600] text-text-muted mb-2 tracking-[0.04em]">
                        E-mail <span className="text-red-400" aria-label="obrigatório">*</span>
                      </label>
                      <input
                        id="ct-email" type="email" autoComplete="email"
                        value={form.email}
                        onChange={e => setForm(p => ({ ...p, email: sanitise(e.target.value).slice(0, 254) }))}
                        onBlur={() => setTouched(p => ({ ...p, email: true }))}
                        placeholder="voce@empresa.com"
                        maxLength={254} required aria-required="true"
                        aria-invalid={!!getErr('email')} aria-describedby={getErr('email') ? 'ct-email-err' : undefined}
                        className={inputCls('email')}
                      />
                      {getErr('email') && <p id="ct-email-err" role="alert" className="text-[11px] text-red-400 mt-1.5">{getErr('email')}</p>}
                    </div>
                  </div>

                  {/* Row 2: company + service */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="ct-company" className="block text-caption font-[600] text-text-muted mb-2 tracking-[0.04em]">
                        Empresa <span className="text-text-muted/40 font-[400]">(opcional)</span>
                      </label>
                      <input
                        id="ct-company" type="text" autoComplete="organization"
                        value={form.company}
                        onChange={e => setForm(p => ({ ...p, company: sanitise(e.target.value).slice(0, 100) }))}
                        placeholder="Nome da empresa"
                        className={inputCls('company')}
                      />
                    </div>
                    <div>
                      <label htmlFor="ct-service" className="block text-caption font-[600] text-text-muted mb-2 tracking-[0.04em]">
                        Tipo de projeto <span className="text-red-400" aria-label="obrigatório">*</span>
                      </label>
                      <select
                        id="ct-service"
                        value={form.service}
                        onChange={e => setForm(p => ({ ...p, service: e.target.value }))}
                        onBlur={() => setTouched(p => ({ ...p, service: true }))}
                        required aria-required="true"
                        aria-invalid={!!getErr('service')}
                        className={`${inputCls('service')} appearance-none cursor-pointer`}
                      >
                        <option value="">Selecione…</option>
                        {SERVICES.map(s => (
                          <option key={s.id} value={s.title}>{s.title}</option>
                        ))}
                      </select>
                      {getErr('service') && <p role="alert" className="text-[11px] text-red-400 mt-1.5">{getErr('service')}</p>}
                    </div>
                  </div>

                  {/* Row 3: level + budget */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="ct-level" className="block text-caption font-[600] text-text-muted mb-2 tracking-[0.04em]">
                        Nível desejado
                      </label>
                      <select
                        id="ct-level"
                        value={form.level}
                        onChange={e => setForm(p => ({ ...p, level: e.target.value }))}
                        className={`${inputCls('level')} appearance-none cursor-pointer`}
                      >
                        <option value="">Não sei ainda</option>
                        {LEVEL_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="ct-budget" className="block text-caption font-[600] text-text-muted mb-2 tracking-[0.04em]">
                        Faixa de investimento
                      </label>
                      <select
                        id="ct-budget"
                        value={form.budget}
                        onChange={e => setForm(p => ({ ...p, budget: e.target.value }))}
                        className={`${inputCls('budget')} appearance-none cursor-pointer`}
                      >
                        <option value="">Prefiro receber proposta</option>
                        {BUDGET_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="ct-message" className="block text-caption font-[600] text-text-muted mb-2 tracking-[0.04em]">
                      Descreva o projeto <span className="text-red-400" aria-label="obrigatório">*</span>
                    </label>
                    <textarea
                      id="ct-message" rows={4}
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: sanitise(e.target.value).slice(0, 1500) }))}
                      onBlur={() => setTouched(p => ({ ...p, message: true }))}
                      placeholder="Conte sobre o seu projeto, objetivo, prazo desejado e qualquer detalhe relevante…"
                      maxLength={1500} required aria-required="true"
                      aria-invalid={!!getErr('message')} aria-describedby="ct-message-hint"
                      className={`${inputCls('message')} resize-none leading-relaxed`}
                    />
                    <div className="flex justify-between mt-1.5">
                      {getErr('message')
                        ? <p role="alert" className="text-[11px] text-red-400">{getErr('message')}</p>
                        : <span id="ct-message-hint" className="text-[11px] text-text-muted/50">Mínimo 20 caracteres</span>
                      }
                      <span className="text-[11px] text-text-muted/50">{form.message.length}/1500</span>
                    </div>
                  </div>

                  {/* Error banner */}
                  {status === 'error' && errorMsg && (
                    <div role="alert" className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-nx-sm px-4 py-3">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      <p className="text-body-sm text-red-400">{errorMsg}</p>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    aria-busy={status === 'loading'}
                    className="relative group inline-flex items-center justify-center gap-2 overflow-hidden bg-accent text-white text-body font-[600] py-4 rounded-nx-sm shadow-nx-accent transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_6px_28px_rgba(0,102,255,0.5)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-wait disabled:hover:scale-100"
                  >
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12" aria-hidden="true" />
                    {status === 'loading' ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Enviando…
                      </>
                    ) : (
                      <>
                        Enviar mensagem
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Sidebar info ──────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col gap-5"
          >
            {/* Direct contact card */}
            <div className="bg-navy rounded-nx-lg p-6 border border-[rgba(255,255,255,0.06)]">
              <p className="text-caption text-accent font-[600] tracking-[0.10em] uppercase mb-3">Contato direto</p>
              <h3 className="font-syne text-h3 font-[600] text-[#E8EDF5] mb-4">Prefere ir direto ao ponto?</h3>
              <p className="text-body-sm text-text-muted mb-5 leading-relaxed">
                Envie um e-mail com a descrição do seu projeto e retornamos com proposta completa.
              </p>
              <a
                href={`mailto:${COMPANY.email}`}
                className="flex items-center gap-2 text-body-sm font-[500] text-accent hover:text-accent-mid transition-colors duration-150"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                {COMPANY.email}
              </a>
            </div>

            {/* Trust items */}
            <div className="bg-white border border-border rounded-nx-lg p-6">
              <p className="text-caption font-[700] text-text-dark mb-4 tracking-[0.06em] uppercase">Garantias incluídas</p>
              <ul className="flex flex-col gap-3" role="list">
                {[
                  { icon: '📄', text: 'Contrato formal com CNPJ' },
                  { icon: '💳', text: 'Pagamento parcelado (50/50)' },
                  { icon: '💻', text: 'Código entregue via GitHub' },
                  { icon: '🔒', text: 'LGPD e segurança garantidos' },
                  { icon: '🔁', text: '2 rodadas de revisão inclusas' },
                  { icon: '📊', text: 'Relatório de performance na entrega' },
                ].map(item => (
                  <li key={item.text} className="flex items-center gap-2.5 text-body-sm text-text-muted">
                    <span className="text-[14px] flex-shrink-0" aria-hidden="true">{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Response time */}
            <div className="bg-[rgba(0,102,255,0.06)] border border-[rgba(0,102,255,0.15)] rounded-nx-lg p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-nx-sm bg-accent-light flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <p className="text-body-sm font-[600] text-text-dark">Resposta garantida</p>
                <p className="text-caption text-text-muted">Em até 24 horas úteis após o envio</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}