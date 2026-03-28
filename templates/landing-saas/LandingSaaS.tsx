'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface WaitlistEntry {
  email: string
  position: number
  timestamp: number
}

interface ToastState {
  id: number
  type: 'success' | 'error' | 'info'
  message: string
}

interface FormErrors {
  email?: string
  consent?: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_QUEUE_SIZE = 3_847
const RATE_LIMIT_WINDOW_MS = 60_000
const MAX_ATTEMPTS_PER_WINDOW = 3

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 0,
    priceAnnual: 0,
    desc: 'Para começar sem compromisso.',
    cta: 'Começar grátis',
    featured: false,
    features: [
      { text: 'Até 3 usuários', included: true },
      { text: '5 projetos ativos', included: true },
      { text: '1 GB de storage', included: true },
      { text: 'Suporte por e-mail', included: true },
      { text: 'Analytics avançado', included: false },
      { text: 'Integrações premium', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 97,
    priceAnnual: 77,
    desc: 'Para times que precisam escalar.',
    cta: 'Testar 14 dias grátis',
    featured: true,
    features: [
      { text: 'Usuários ilimitados', included: true },
      { text: 'Projetos ilimitados', included: true },
      { text: '50 GB de storage', included: true },
      { text: 'Suporte prioritário 24/7', included: true },
      { text: 'Analytics avançado', included: true },
      { text: 'Integrações premium', included: true },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    priceMonthly: null,
    priceAnnual: null,
    desc: 'Para grandes empresas com SLA.',
    cta: 'Falar com vendas',
    featured: false,
    features: [
      { text: 'Tudo do Pro', included: true },
      { text: 'SLA 99.99% garantido', included: true },
      { text: 'SSO / SAML', included: true },
      { text: 'Onboarding dedicado', included: true },
      { text: 'Contrato personalizado', included: true },
      { text: 'Segurança SOC 2 Type II', included: true },
    ],
  },
]

const FEATURES = [
  {
    icon: '⚡',
    title: 'Automação inteligente',
    desc: 'Elimine tarefas repetitivas com workflows que aprendem com o seu time.',
    stat: '60%',
    statLabel: 'menos tempo operacional',
  },
  {
    icon: '📊',
    title: 'Analytics em tempo real',
    desc: 'Dashboards atualizados ao segundo. Decisões baseadas em dados, não em achismos.',
    stat: '2s',
    statLabel: 'latência média de dados',
  },
  {
    icon: '🔒',
    title: 'Segurança enterprise',
    desc: 'Criptografia AES-256, 2FA, LGPD e GDPR. Auditado por terceiros semestralmente.',
    stat: 'SOC 2',
    statLabel: 'Type II certificado',
  },
  {
    icon: '🤝',
    title: 'Colaboração em equipe',
    desc: 'Workspaces, permissões granulares e histórico completo de todas as ações.',
    stat: '∞',
    statLabel: 'membros por workspace',
  },
  {
    icon: '🔗',
    title: '+200 integrações',
    desc: 'Slack, Notion, Trello, Google, HubSpot e muito mais. API pública documentada.',
    stat: '200+',
    statLabel: 'conectores disponíveis',
  },
  {
    icon: '📱',
    title: 'Mobile-first',
    desc: 'PWA para iOS e Android. Funciona offline. Notificações push nativas.',
    stat: '4.9★',
    statLabel: 'na App Store',
  },
]

const TESTIMONIALS = [
  {
    quote: 'O FlowDesk reduziu em 60% o tempo que minha equipe gastava em tarefas manuais. Resultado imediato, sem curva de aprendizado.',
    name: 'Ana Carvalho',
    role: 'CEO, Agência Impulso',
    avatar: 'AC',
    company: 'impulso',
    metric: '60% menos tarefas manuais',
  },
  {
    quote: 'Adotamos em 2 dias. A API é tão bem documentada que nosso time de eng integrou com o sistema legado em uma tarde.',
    name: 'Pedro Melo',
    role: 'CTO, FinTech Valore',
    avatar: 'PM',
    company: 'valore',
    metric: '2 dias para adoção total',
  },
  {
    quote: 'Suporte excepcional. Qualquer dúvida, alguém responde em minutos — e realmente resolve. Não é bot.',
    name: 'Carla Souza',
    role: 'Head of Ops, Logtech',
    avatar: 'CS',
    company: 'logtech',
    metric: '<5min tempo de resposta',
  },
]

const FAQ_ITEMS = [
  {
    q: 'Preciso de cartão de crédito para o plano Starter?',
    a: 'Não. O plano Starter é gratuito para sempre, sem cartão de crédito, sem trial que expira. Você só precisa de um e-mail válido.',
  },
  {
    q: 'Posso cancelar a qualquer momento?',
    a: 'Sim. Não há fidelidade. Cancele pelo painel em menos de 30 segundos. Seus dados ficam disponíveis por 30 dias após o cancelamento para exportação.',
  },
  {
    q: 'Os dados são armazenados no Brasil?',
    a: 'Sim. Toda infraestrutura está hospedada na AWS São Paulo (sa-east-1), em conformidade com a LGPD. Processamos dados pessoais apenas com as finalidades explicitadas na nossa Política de Privacidade.',
  },
  {
    q: 'O que acontece quando excedo os limites do plano Starter?',
    a: 'Você recebe um aviso por e-mail com 7 dias de antecedência. Nada é bloqueado sem aviso. Você decide se quer fazer upgrade ou ajustar o uso.',
  },
  {
    q: 'Existe suporte em português?',
    a: 'Sim. Toda a plataforma, documentação e suporte estão disponíveis em português do Brasil. Nada de Google Translate.',
  },
  {
    q: 'Como funciona a segurança dos dados?',
    a: 'Criptografia AES-256 em repouso, TLS 1.3 em trânsito, 2FA obrigatório para admins, logs de auditoria completos, backups diários com retenção de 30 dias. Auditoria SOC 2 Type II semestralmente.',
  },
]

const CHART_MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
const CHART_DATA   = [42, 61, 55, 78, 65, 82, 70, 90, 76, 95, 84, 102]

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1500, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

function useIntersection(ref: React.RefObject<Element>, threshold = 0.2) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return visible
}

function useRateLimit(windowMs: number, maxAttempts: number) {
  const attemptsRef = useRef<number[]>([])
  const check = useCallback((): { allowed: boolean; waitSeconds: number } => {
    const now = Date.now()
    attemptsRef.current = attemptsRef.current.filter(t => now - t < windowMs)
    if (attemptsRef.current.length >= maxAttempts) {
      const oldest = attemptsRef.current[0]
      const waitSeconds = Math.ceil((oldest + windowMs - now) / 1000)
      return { allowed: false, waitSeconds }
    }
    attemptsRef.current.push(now)
    return { allowed: true, waitSeconds: 0 }
  }, [windowMs, maxAttempts])
  return check
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Toast({ toasts, remove }: { toasts: ToastState[]; remove: (id: number) => void }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="false"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        pointerEvents: 'none',
      }}
    >
      {toasts.map(toast => (
        <div
          key={toast.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 16px',
            borderRadius: 10,
            background: toast.type === 'success' ? 'rgba(34,197,94,0.15)' : toast.type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(0,102,255,0.15)',
            border: `1px solid ${toast.type === 'success' ? 'rgba(34,197,94,0.35)' : toast.type === 'error' ? 'rgba(239,68,68,0.35)' : 'rgba(0,102,255,0.35)'}`,
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            maxWidth: 360,
            pointerEvents: 'all',
            animation: 'slideIn 200ms ease-out',
          }}
        >
          <span style={{ fontSize: 16 }}>
            {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}
          </span>
          <span style={{ fontSize: 13, color: '#E8EDF5', fontWeight: 500 }}>{toast.message}</span>
          <button
            onClick={() => remove(toast.id)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#6B7A9B', cursor: 'pointer', fontSize: 16, lineHeight: 1, pointerEvents: 'all' }}
            aria-label="Fechar notificação"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}

function KpiCounter({ value, label, suffix = '', start }: { value: number; label: string; suffix?: string; start: boolean }) {
  const count = useCountUp(value, 1400, start)
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontFamily: 'var(--font-syne, sans-serif)', fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 700, color: '#0066FF', lineHeight: 1, marginBottom: 4 }}>
        {count.toLocaleString('pt-BR')}{suffix}
      </p>
      <p style={{ fontSize: 12, color: '#6B7A9B', fontWeight: 500 }}>{label}</p>
    </div>
  )
}

function AccordionItem({ item, isOpen, toggle }: { item: typeof FAQ_ITEMS[0]; isOpen: boolean; toggle: () => void }) {
  const bodyRef = useRef<HTMLDivElement>(null)
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <button
        onClick={toggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          gap: 16,
        }}
        aria-expanded={isOpen}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: '#E8EDF5' }}>{item.q}</span>
        <span
          style={{
            flexShrink: 0,
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: isOpen ? 'rgba(0,102,255,0.20)' : 'rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 250ms ease, background 200ms ease',
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            color: isOpen ? '#3385FF' : '#6B7A9B',
            fontSize: 18,
            lineHeight: 1,
          }}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      <div
        ref={bodyRef}
        style={{
          overflow: 'hidden',
          maxHeight: isOpen ? bodyRef.current?.scrollHeight + 'px' : '0px',
          transition: 'max-height 300ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <p style={{ fontSize: 14, color: '#6B7A9B', lineHeight: 1.7, paddingBottom: 18 }}>
          {item.a}
        </p>
      </div>
    </div>
  )
}

function AnimatedBar({ value, max, index, visible }: { value: number; max: number; index: number; visible: boolean }) {
  const height = (value / max) * 100
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ width: '100%', height: 160, display: 'flex', alignItems: 'flex-end' }}>
        <div
          style={{
            width: '100%',
            borderRadius: '3px 3px 0 0',
            background: index === CHART_DATA.length - 1 ? '#0066FF' : `rgba(0,102,255,${0.25 + index * 0.055})`,
            height: visible ? `${height}%` : '0%',
            transition: `height 700ms cubic-bezier(0.4,0,0.2,1) ${index * 50}ms`,
            boxShadow: index === CHART_DATA.length - 1 ? '0 0 12px rgba(0,102,255,0.5)' : 'none',
          }}
          title={`${CHART_MONTHS[index]}: R$ ${value}k`}
          role="img"
          aria-label={`${CHART_MONTHS[index]}: R$ ${value}k`}
        />
      </div>
      <span style={{ fontSize: 9, color: '#4B5570', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {CHART_MONTHS[index]}
      </span>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LandingSaaS() {
  // State
  const [email, setEmail]             = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [consent, setConsent]         = useState(false)
  const [consentTouched, setConsentTouched] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [waitlistEntry, setWaitlistEntry] = useState<WaitlistEntry | null>(null)
  const [toasts, setToasts]           = useState<ToastState[]>([])
  const [toastCounter, setToastCounter] = useState(0)
  const [billingAnnual, setBillingAnnual] = useState(false)
  const [openFaq, setOpenFaq]         = useState<number | null>(null)
  const [activePricingId, setActivePricingId] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled]       = useState(false)

  // Refs for intersection
  const statsRef    = useRef<HTMLDivElement>(null)
  const chartRef    = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

  const statsVisible    = useIntersection(statsRef as React.RefObject<Element>)
  const chartVisible    = useIntersection(chartRef as React.RefObject<Element>)
  const featuresVisible = useIntersection(featuresRef as React.RefObject<Element>)

  // Rate limiter
  const checkRateLimit = useRateLimit(RATE_LIMIT_WINDOW_MS, MAX_ATTEMPTS_PER_WINDOW)

  // Scroll handler
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on ESC
  useEffect(() => {
    if (!mobileMenuOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileMenuOpen])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  // Toast helpers
  const addToast = useCallback((type: ToastState['type'], message: string) => {
    const id = toastCounter + 1
    setToastCounter(id)
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000)
  }, [toastCounter])

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // Validation
  const validateEmail = (val: string): string | undefined => {
    if (!val.trim()) return 'E-mail é obrigatório'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) return 'Digite um e-mail válido'
    if (val.length > 254) return 'E-mail muito longo'
    return undefined
  }

  const emailError   = emailTouched ? validateEmail(email) : undefined
  const consentError = consentTouched && !consent ? 'Você precisa concordar para continuar' : undefined
  const formIsValid  = !validateEmail(email) && consent

  // Sanitize email input
  const handleEmailChange = (raw: string) => {
    // Strip control chars and limit length
    const sanitized = raw.replace(/[\x00-\x1F\x7F]/g, '').slice(0, 254)
    setEmail(sanitized)
  }

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailTouched(true)
    setConsentTouched(true)

    if (!formIsValid) return

    // Rate limiting (client-side signal; real enforcement is server-side)
    const { allowed, waitSeconds } = checkRateLimit()
    if (!allowed) {
      addToast('error', `Muitas tentativas. Aguarde ${waitSeconds}s antes de tentar novamente.`)
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call with realistic delay
      await new Promise(res => setTimeout(res, 1200))

      // Simulate occasional server error (5% chance) for demo purposes
      if (Math.random() < 0.05) throw new Error('server_error')

      const position = INITIAL_QUEUE_SIZE + Math.floor(Math.random() * 12) + 1
      const entry: WaitlistEntry = {
        email: email.toLowerCase().trim(),
        position,
        timestamp: Date.now(),
      }
      setWaitlistEntry(entry)
      addToast('success', `Você está na posição #${position.toLocaleString('pt-BR')} 🎉`)
    } catch {
      addToast('error', 'Algo deu errado. Tente novamente em instantes.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Styles
  const inputBase: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#E8EDF5',
    fontSize: 14,
    padding: '12px 16px',
    borderRadius: 8,
    outline: 'none',
    transition: 'border-color 150ms ease',
  }

  return (
    <div style={{ background: '#060D1F', color: '#E8EDF5', fontFamily: 'var(--font-inter, sans-serif)', minHeight: '100vh' }}>

      {/* ── Global styles injected ────────────────────────────────────────── */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatBubble {
          0%   { transform: translateY(0px) scale(1); }
          50%  { transform: translateY(-12px) scale(1.02); }
          100% { transform: translateY(0px) scale(1); }
        }
        @keyframes typingCursor {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .fd-nav-link:hover { color: #E8EDF5 !important; }
        .fd-card:hover { border-color: rgba(0,102,255,0.30) !important; transform: translateY(-2px); }
        .fd-card { transition: border-color 200ms ease, transform 200ms ease, box-shadow 200ms ease; }
        .fd-card:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.3); }
        .fd-plan-cta:hover { opacity: 0.90; transform: scale(1.02); }
        .fd-plan-cta { transition: opacity 150ms ease, transform 150ms ease; }
        .fd-test-card:hover { border-color: rgba(0,102,255,0.25) !important; }
        .fd-test-card { transition: border-color 200ms ease; }
        :focus-visible { outline: 2px solid #0066FF !important; outline-offset: 3px !important; border-radius: 6px !important; }
        @media (max-width: 768px) {
          .fd-hide-mobile { display: none !important; }
          .fd-grid-1col { grid-template-columns: 1fr !important; }
          .fd-grid-2col-mobile { grid-template-columns: 1fr 1fr !important; }
        }
        @media (min-width: 769px) {
          .fd-show-mobile { display: none !important; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: rgba(0,102,255,0.3); }
      `}</style>

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      <Toast toasts={toasts} remove={removeToast} />

      {/* ── Navbar ────────────────────────────────────────────────────────── */}
      <header
        role="banner"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          background: scrolled ? 'rgba(6,13,31,0.95)' : 'rgba(6,13,31,0.80)',
          backdropFilter: 'blur(16px)',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.04)',
          transition: 'background 300ms ease, border-color 300ms ease',
        }}
      >
        <nav
          style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}
          aria-label="Navegação principal"
        >
          {/* Logo */}
          <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }} aria-label="FlowDesk — ir para o início">
            <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg, #0066FF, #00C2E0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }} aria-hidden="true">
              ⚡
            </div>
            <span style={{ fontFamily: 'var(--font-syne, sans-serif)', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.02em', color: '#E8EDF5' }}>
              Flow<span style={{ color: '#0066FF' }}>Desk</span>
            </span>
          </a>

          {/* Desktop links */}
          <ul className="fd-hide-mobile" style={{ display: 'flex', gap: 4, listStyle: 'none', alignItems: 'center' }}>
            {[['#features', 'Funcionalidades'], ['#pricing', 'Preços'], ['#reviews', 'Depoimentos'], ['#faq', 'FAQ']].map(([href, label]) => (
              <li key={href}>
                <a
                  href={href}
                  className="fd-nav-link"
                  style={{ color: '#6B7A9B', fontSize: 13, fontWeight: 500, textDecoration: 'none', padding: '8px 12px', borderRadius: 6, display: 'block', transition: 'color 150ms ease' }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA + mobile toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a
              href="#waitlist"
              className="fd-hide-mobile"
              style={{ background: '#0066FF', color: '#fff', fontSize: 13, fontWeight: 500, padding: '8px 20px', borderRadius: 7, textDecoration: 'none', transition: 'background 150ms ease' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#0052CC')}
              onMouseLeave={e => (e.currentTarget.style.background = '#0066FF')}
            >
              Entrar na lista →
            </a>
            <button
              className="fd-show-mobile"
              onClick={() => setMobileMenuOpen(v => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: '#E8EDF5' }}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {mobileMenuOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            style={{ background: 'rgba(6,13,31,0.98)', backdropFilter: 'blur(16px)', padding: '16px 24px 32px', borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
              {[['#features', 'Funcionalidades'], ['#pricing', 'Preços'], ['#reviews', 'Depoimentos'], ['#faq', 'FAQ']].map(([href, label]) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ display: 'block', color: '#E8EDF5', fontSize: 15, fontWeight: 500, textDecoration: 'none', padding: '12px 16px', borderRadius: 8 }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#waitlist"
              onClick={() => setMobileMenuOpen(false)}
              style={{ display: 'block', textAlign: 'center', background: '#0066FF', color: '#fff', fontSize: 14, fontWeight: 500, padding: '14px', borderRadius: 8, textDecoration: 'none' }}
            >
              Entrar na lista de espera →
            </a>
          </div>
        )}
      </header>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        id="hero"
        aria-labelledby="hero-headline"
        style={{ position: 'relative', overflow: 'hidden', paddingTop: 80, paddingBottom: 96, paddingLeft: 24, paddingRight: 24 }}
      >
        {/* Background glow */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 700,
            height: 700,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,102,255,0.10) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '20%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,194,224,0.05) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'floatBubble 8s ease-in-out infinite',
          }} />
        </div>

        <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto', textAlign: 'center', animation: 'fadeUp 600ms ease-out both' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,102,255,0.12)', border: '1px solid rgba(0,102,255,0.25)', borderRadius: 9999, padding: '5px 14px', marginBottom: 28 }}>
            <span
              style={{ width: 7, height: 7, borderRadius: '50%', background: '#0066FF', animation: 'pulse 2s ease-in-out infinite' }}
              aria-hidden="true"
            />
            <span style={{ fontSize: 12, fontWeight: 500, color: '#3385FF' }}>Acesso antecipado disponível</span>
          </div>

          {/* Headline */}
          <h1
            id="hero-headline"
            style={{
              fontFamily: 'var(--font-syne, sans-serif)',
              fontSize: 'clamp(2.2rem, 5.5vw, 3.8rem)',
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              marginBottom: 24,
              color: '#F0F4FF',
            }}
          >
            Gerencie tudo em{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #0066FF, #00C2E0, #0066FF)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradientShift 4s linear infinite',
              }}
            >
              um único lugar.
            </span>
            <br />Sem complicação.
          </h1>

          <p style={{ fontSize: 17, color: '#6B7A9B', lineHeight: 1.7, marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' }}>
            FlowDesk conecta seus projetos, equipe e métricas em uma plataforma
            desenhada para crescer junto com o seu negócio — sem curva de aprendizado.
          </p>

          {/* Waitlist form */}
          <div id="waitlist">
            {waitlistEntry ? (
              /* Success state */
              <div
                role="status"
                aria-live="polite"
                style={{
                  background: 'rgba(34,197,94,0.08)',
                  border: '1px solid rgba(34,197,94,0.30)',
                  borderRadius: 16,
                  padding: '28px 32px',
                  maxWidth: 480,
                  margin: '0 auto',
                  animation: 'fadeUp 400ms ease-out',
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 12 }} aria-hidden="true">🎉</div>
                <h2 style={{ fontFamily: 'var(--font-syne, sans-serif)', fontSize: 20, fontWeight: 700, color: '#E8EDF5', marginBottom: 8 }}>
                  Você está na lista!
                </h2>
                <p style={{ fontSize: 14, color: '#6B7A9B', marginBottom: 16, lineHeight: 1.6 }}>
                  Você ocupa a posição{' '}
                  <strong style={{ color: '#22c55e', fontSize: 16 }}>
                    #{waitlistEntry.position.toLocaleString('pt-BR')}
                  </strong>{' '}
                  na fila. Avisaremos em{' '}
                  <strong style={{ color: '#E8EDF5' }}>{waitlistEntry.email}</strong>{' '}
                  quando seu acesso for liberado.
                </p>
                <p style={{ fontSize: 11, color: '#4B5570' }}>
                  Você pode cancelar sua inscrição a qualquer momento pelo link no e-mail de confirmação.
                  Seus dados são tratados conforme nossa{' '}
                  <a href="#privacy" style={{ color: '#3385FF', textDecoration: 'underline' }}>Política de Privacidade</a>.
                </p>
              </div>
            ) : (
              /* Form */
              <form
                onSubmit={handleSubmit}
                noValidate
                aria-label="Formulário de lista de espera"
                style={{ maxWidth: 480, margin: '0 auto' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {/* Email field */}
                  <div>
                    <label htmlFor="waitlist-email" style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#6B7A9B', marginBottom: 6, textAlign: 'left' }}>
                      Seu melhor e-mail
                    </label>
                    <input
                      id="waitlist-email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="voce@empresa.com"
                      value={email}
                      onChange={e => handleEmailChange(e.target.value)}
                      onBlur={() => setEmailTouched(true)}
                      maxLength={254}
                      required
                      aria-required="true"
                      aria-invalid={!!emailError}
                      aria-describedby={emailError ? 'email-error' : undefined}
                      disabled={isSubmitting}
                      style={{
                        ...inputBase,
                        borderColor: emailError ? 'rgba(239,68,68,0.60)' : emailTouched && !emailError ? 'rgba(34,197,94,0.40)' : 'rgba(255,255,255,0.12)',
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#0066FF' }}
                    />
                    {emailError && (
                      <p id="email-error" role="alert" style={{ fontSize: 12, color: '#ef4444', marginTop: 5, textAlign: 'left' }}>
                        {emailError}
                      </p>
                    )}
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                    style={{
                      background: formIsValid ? '#0066FF' : 'rgba(0,102,255,0.40)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      padding: '13px 24px',
                      cursor: isSubmitting ? 'wait' : formIsValid ? 'pointer' : 'not-allowed',
                      transition: 'background 150ms ease, transform 100ms ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          style={{
                            width: 16, height: 16,
                            border: '2px solid rgba(255,255,255,0.30)',
                            borderTopColor: '#fff',
                            borderRadius: '50%',
                            animation: 'spin 600ms linear infinite',
                            display: 'inline-block',
                          }}
                          aria-hidden="true"
                        />
                        Reservando sua vaga...
                      </>
                    ) : 'Entrar na lista de espera →'}
                  </button>

                  {/* Consent (LGPD) */}
                  <div>
                    <label
                      style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', textAlign: 'left' }}
                    >
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={e => { setConsent(e.target.checked); setConsentTouched(true) }}
                        aria-required="true"
                        aria-invalid={!!consentError}
                        aria-describedby={consentError ? 'consent-error' : 'consent-desc'}
                        style={{ marginTop: 2, flexShrink: 0, accentColor: '#0066FF', width: 14, height: 14 }}
                      />
                      <span id="consent-desc" style={{ fontSize: 11, color: '#4B5570', lineHeight: 1.5 }}>
                        Concordo que a FlowDesk armazene meu e-mail para enviar comunicações sobre acesso antecipado, conforme a{' '}
                        <a href="#privacy" style={{ color: '#3385FF', textDecoration: 'underline' }}>Política de Privacidade</a>.
                        Posso cancelar a qualquer momento.
                      </span>
                    </label>
                    {consentError && (
                      <p id="consent-error" role="alert" style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>
                        {consentError}
                      </p>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: 12, color: '#4B5570', marginTop: 12 }}>
                  Sem cartão de crédito · Grátis para sempre no Starter · Dados armazenados no Brasil
                </p>
              </form>
            )}
          </div>
        </div>

        {/* App mockup */}
        <div style={{ position: 'relative', maxWidth: 960, margin: '72px auto 0', paddingLeft: 24, paddingRight: 24 }} aria-hidden="true">
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
            }}
          >
            {/* Title bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#FF5F57' }} />
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#FEBC2E' }} />
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#28C840' }} />
              <div style={{ flex: 1, height: 20, background: 'rgba(255,255,255,0.05)', borderRadius: 4, maxWidth: 260, margin: '0 auto' }} />
            </div>

            {/* App body */}
            <div style={{ display: 'flex', height: 340 }}>
              {/* Sidebar */}
              <div style={{ width: 200, borderRight: '1px solid rgba(255,255,255,0.06)', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }} className="fd-hide-mobile">
                <div style={{ height: 28, background: 'rgba(0,102,255,0.15)', borderRadius: 6 }} />
                {[90, 75, 82, 68, 78].map((w, i) => (
                  <div key={i} style={{ height: 18, background: 'rgba(255,255,255,0.05)', borderRadius: 4, width: `${w}%` }} />
                ))}
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,102,255,0.20)' }} />
                  <div>
                    <div style={{ height: 8, width: 60, background: 'rgba(255,255,255,0.15)', borderRadius: 3, marginBottom: 4 }} />
                    <div style={{ height: 6, width: 80, background: 'rgba(255,255,255,0.07)', borderRadius: 3 }} />
                  </div>
                </div>
              </div>

              {/* Main content */}
              <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden' }}>
                {/* KPI row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                  {[
                    { label: 'Projetos', value: '24', color: '#0066FF' },
                    { label: 'Tarefas',  value: '187', color: '#00C2E0' },
                    { label: 'Membros', value: '12', color: '#F0A500' },
                  ].map(k => (
                    <div key={k.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 14px' }}>
                      <p style={{ fontSize: 10, color: '#6B7A9B', marginBottom: 4 }}>{k.label}</p>
                      <p style={{ fontFamily: 'var(--font-syne, sans-serif)', fontSize: 24, fontWeight: 700, color: k.color, lineHeight: 1 }}>{k.value}</p>
                    </div>
                  ))}
                </div>

                {/* Chart area */}
                <div
                  ref={chartRef}
                  style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '16px 12px', display: 'flex', alignItems: 'flex-end', gap: 4 }}
                >
                  {CHART_DATA.map((v, i) => (
                    <AnimatedBar key={i} value={v} max={Math.max(...CHART_DATA)} index={i} visible={chartVisible} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Glow under mockup */}
          <div
            style={{
              position: 'absolute',
              bottom: -20,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '70%',
              height: 60,
              background: 'rgba(0,102,255,0.18)',
              filter: 'blur(40px)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
          />
        </div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────────────────────────── */}
      <section
        ref={statsRef}
        aria-label="Números do FlowDesk"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '40px 24px', background: 'rgba(255,255,255,0.01)' }}
      >
        <div
          style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32 }}
          className="fd-grid-2col-mobile"
        >
          <KpiCounter value={3400}  label="Empresas usuárias"  suffix="+"  start={statsVisible} />
          <KpiCounter value={99}    label="Uptime garantido"   suffix=".9%" start={statsVisible} />
          <KpiCounter value={200}   label="Integrações"        suffix="+"  start={statsVisible} />
          <KpiCounter value={4}     label="Min para setup"                 start={statsVisible} />
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section
        id="features"
        aria-labelledby="features-heading"
        ref={featuresRef}
        style={{ padding: '96px 24px' }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#0066FF', marginBottom: 12 }}>
              Funcionalidades
            </p>
            <h2
              id="features-heading"
              style={{ fontFamily: 'var(--font-syne, sans-serif)', fontSize: 'clamp(1.6rem,3vw,2.6rem)', fontWeight: 700, marginBottom: 16, color: '#F0F4FF' }}
            >
              Tudo que você precisa,{' '}
              <span style={{ color: '#0066FF' }}>sem o que não precisa</span>
            </h2>
            <p style={{ fontSize: 16, color: '#6B7A9B', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
              Funcionalidades pensadas para resolver o problema real — não para impressionar no papel.
            </p>
          </div>

          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}
            className="fd-grid-1col"
          >
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="fd-card"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 16,
                  padding: 28,
                  animation: featuresVisible ? `fadeUp 500ms ease-out ${i * 80}ms both` : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontSize: 32 }} role="img" aria-label={f.title}>{f.icon}</span>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: 'var(--font-syne, sans-serif)', fontSize: 18, fontWeight: 700, color: '#0066FF', lineHeight: 1 }}>{f.stat}</p>
                    <p style={{ fontSize: 10, color: '#4B5570', marginTop: 2 }}>{f.statLabel}</p>
                  </div>
                </div>
                <h3 style={{ fontFamily: 'var(--font-syne, sans-serif)', fontSize: 16, fontWeight: 600, marginBottom: 8, color: '#E8EDF5' }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: '#6B7A9B', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────── */}
      <section
        id="pricing"
        aria-labelledby="pricing-heading"
        style={{ padding: '96px 24px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#0066FF', marginBottom: 12 }}>
              Preços
            </p>
            <h2
              id="pricing-heading"
              style={{ fontFamily: 'var(--font-syne, sans-serif)', fontSize: 'clamp(1.6rem,3vw,2.6rem)', fontWeight: 700, marginBottom: 24, color: '#F0F4FF' }}
            >
              Simples, transparente, sem surpresas
            </h2>

            {/* Billing toggle */}
            <div
              style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 9999, padding: '6px 8px' }}
              role="group"
              aria-label="Ciclo de cobrança"
            >
              <button
                onClick={() => setBillingAnnual(false)}
                aria-pressed={!billingAnnual}
                style={{
                  background: !billingAnnual ? '#E8EDF5' : 'transparent',
                  color: !billingAnnual ? '#060D1F' : '#6B7A9B',
                  border: 'none',
                  borderRadius: 9999,
                  padding: '6px 16px',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background 200ms ease, color 200ms ease',
                }}
              >
                Mensal
              </button>
              <button
                onClick={() => setBillingAnnual(true)}
                aria-pressed={billingAnnual}
                style={{
                  background: billingAnnual ? '#0066FF' : 'transparent',
                  color: billingAnnual ? '#fff' : '#6B7A9B',
                  border: 'none',
                  borderRadius: 9999,
                  padding: '6px 16px',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background 200ms ease, color 200ms ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                Anual
                <span
                  style={{
                    background: 'rgba(34,197,94,0.20)',
                    color: '#4ade80',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: 4,
                    letterSpacing: '0.04em',
                  }}
                  aria-label="Economize 20%"
                >
                  -20%
                </span>
              </button>
            </div>
          </div>

          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, alignItems: 'start' }}
            className="fd-grid-1col"
            role="list"
            aria-label="Planos disponíveis"
          >
            {PLANS.map(plan => {
              const price = billingAnnual ? plan.priceAnnual : plan.priceMonthly
              const isActive = activePricingId === plan.id
              return (
                <div
                  key={plan.id}
                  role="listitem"
                  style={{
                    background: plan.featured ? 'rgba(0,102,255,0.07)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${plan.featured ? 'rgba(0,102,255,0.45)' : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: 18,
                    padding: 28,
                    position: 'relative',
                    transition: 'transform 200ms ease, box-shadow 200ms ease',
                    transform: plan.featured ? 'scale(1.02)' : 'scale(1)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = plan.featured ? 'scale(1.04)' : 'scale(1.02)'
                    e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.3)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = plan.featured ? 'scale(1.02)' : 'scale(1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {plan.featured && (
                    <span
                      style={{
                        position: 'absolute',
                        top: -12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#0066FF',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '3px 14px',
                        borderRadius: 9999,
                        whiteSpace: 'nowrap',
                        letterSpacing: '0.04em',
                      }}
                      aria-label="Plano mais popular"
                    >
                      ⚡ Mais popular
                    </span>
                  )}

                  {/* Plan header */}
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#6B7A9B', marginBottom: 6 }}>{plan.name}</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                    {price === null ? (
                      <span style={{ fontFamily: 'var(--font-syne, sans-serif)', fontSize: 24, fontWeight: 700, color: '#F0A500' }}>Sob consulta</span>
                    ) : price === 0 ? (
                      <span style={{ fontFamily: 'var(--font-syne, sans-serif)', fontSize: '2rem', fontWeight: 700 }}>Grátis</span>
                    ) : (
                      <>
                        <span style={{ fontFamily: 'var(--font-syne, sans-serif)', fontSize: '2rem', fontWeight: 700 }}>
                          R$&nbsp;{price}
                        </span>
                        <span style={{ fontSize: 13, color: '#6B7A9B' }}>/mês</span>
                      </>
                    )}
                  </div>
                  {billingAnnual && price !== null && price !== 0 && (
                    <p style={{ fontSize: 11, color: '#4ade80', marginBottom: 8 }}>
                      Cobrado anualmente — você economiza R$ {(plan.priceMonthly! - price) * 12}/ano
                    </p>
                  )}
                  <p style={{ fontSize: 13, color: '#6B7A9B', marginBottom: 20, lineHeight: 1.5 }}>{plan.desc}</p>

                  {/* Features list */}
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                    {plan.features.map(f => (
                      <li
                        key={f.text}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: f.included ? '#c8d0e0' : '#3A4460' }}
                        aria-label={`${f.text}: ${f.included ? 'incluído' : 'não incluído'}`}
                      >
                        {f.included ? (
                          <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(0,102,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                              <path d="M2 6l3 3 5-5" stroke="#0066FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                        ) : (
                          <span style={{ width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14, color: '#3A4460' }} aria-hidden="true">—</span>
                        )}
                        {f.text}
                      </li>
                    ))}
                  </ul>

                  <button
                    className="fd-plan-cta"
                    onClick={() => {
                      setActivePricingId(plan.id)
                      addToast('info', `Plano ${plan.name} selecionado! Cadastre-se na lista de espera acima.`)
                    }}
                    aria-pressed={isActive}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: 9,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: plan.featured
                        ? '#0066FF'
                        : plan.id === 'enterprise'
                          ? 'transparent'
                          : 'rgba(255,255,255,0.06)',
                      color: plan.featured
                        ? '#fff'
                        : plan.id === 'enterprise'
                          ? '#F0A500'
                          : '#c8d0e0',
                      border: plan.id === 'enterprise' ? '1px solid rgba(240,165,0,0.35)' : 'none',
                      boxShadow: plan.featured ? '0 4px 20px rgba(0,102,255,0.35)' : 'none',
                    } as React.CSSProperties}
                  >
                    {isActive ? `✓ ${plan.cta}` : plan.cta}
                  </button>
                </div>
              )
            })}
          </div>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#4B5570', marginTop: 24 }}>
            Todos os planos incluem suporte em português. Dados armazenados no Brasil (AWS sa-east-1).{' '}
            <a href="#privacy" style={{ color: '#3385FF', textDecoration: 'underline' }}>Política de Privacidade</a>
            {' '}e{' '}
            <a href="#terms" style={{ color: '#3385FF', textDecoration: 'underline' }}>Termos de Uso</a>.
          </p>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <section
        id="reviews"
        aria-labelledby="reviews-heading"
        style={{ padding: '96px 24px' }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#0066FF', marginBottom: 12 }}>
              Depoimentos
            </p>
            <h2
              id="reviews-heading"
              style={{ fontFamily: 'var(--font-syne, sans-serif)', fontSize: 'clamp(1.6rem,3vw,2.6rem)', fontWeight: 700, color: '#F0F4FF' }}
            >
              Quem usa, recomenda
            </h2>
          </div>

          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}
            className="fd-grid-1col"
          >
            {TESTIMONIALS.map(t => (
              <figure
                key={t.name}
                className="fd-test-card"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 16,
                  padding: 28,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 20,
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'rgba(0,102,255,0.10)',
                    border: '1px solid rgba(0,102,255,0.20)',
                    borderRadius: 6,
                    padding: '4px 10px',
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#3385FF',
                    width: 'fit-content',
                  }}
                >
                  <span aria-hidden="true">📈</span>
                  {t.metric}
                </div>

                <blockquote style={{ fontSize: 14, color: '#c8d0e0', lineHeight: 1.75, margin: 0, fontStyle: 'italic' }}>
                  "{t.quote}"
                </blockquote>

                <figcaption style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto' }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'rgba(0,102,255,0.18)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#3385FF',
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#E8EDF5' }}>{t.name}</p>
                    <p style={{ fontSize: 11, color: '#6B7A9B' }}>{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section
        id="faq"
        aria-labelledby="faq-heading"
        style={{ padding: '96px 24px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#0066FF', marginBottom: 12 }}>
              FAQ
            </p>
            <h2
              id="faq-heading"
              style={{ fontFamily: 'var(--font-syne, sans-serif)', fontSize: 'clamp(1.6rem,3vw,2.6rem)', fontWeight: 700, color: '#F0F4FF' }}
            >
              Perguntas frequentes
            </h2>
          </div>

          <div role="list">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} role="listitem">
                <AccordionItem
                  item={item}
                  isOpen={openFaq === i}
                  toggle={() => setOpenFaq(openFaq === i ? null : i)}
                />
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', marginTop: 40, fontSize: 14, color: '#6B7A9B' }}>
            Não encontrou o que procurava?{' '}
            <a href="mailto:suporte@flowdesk.com.br" style={{ color: '#3385FF', textDecoration: 'underline' }}>
              Fale com a gente
            </a>
            {' '}— respondemos em até 4h úteis.
          </p>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="cta-heading"
        style={{ padding: '96px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
      >
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 500,
            height: 500,
            background: 'radial-gradient(circle, rgba(0,102,255,0.10) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }} />
        </div>

        <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto' }}>
          <h2
            id="cta-heading"
            style={{ fontFamily: 'var(--font-syne, sans-serif)', fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 700, marginBottom: 16, color: '#F0F4FF', lineHeight: 1.1 }}
          >
            Pronto para simplificar<br />sua operação?
          </h2>
          <p style={{ fontSize: 16, color: '#6B7A9B', marginBottom: 36, lineHeight: 1.7 }}>
            Junte-se a mais de 3.400 empresas que já usam o FlowDesk.
            Setup em 4 minutos, sem cartão de crédito.
          </p>
          <a
            href="#waitlist"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#0066FF',
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              padding: '14px 32px',
              borderRadius: 9,
              textDecoration: 'none',
              boxShadow: '0 4px 24px rgba(0,102,255,0.40)',
              transition: 'background 150ms ease, transform 150ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#0052CC'; e.currentTarget.style.transform = 'scale(1.03)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#0066FF'; e.currentTarget.style.transform = 'scale(1)' }}
          >
            Começar agora — é grátis →
          </a>
          <p style={{ fontSize: 12, color: '#4B5570', marginTop: 14 }}>
            Plano Starter gratuito para sempre · Dados no Brasil · LGPD compliance
          </p>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer
        role="contentinfo"
        id="privacy"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '40px 24px' }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 32, marginBottom: 32 }}
          >
            {/* Brand */}
            <div style={{ maxWidth: 280 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(135deg, #0066FF, #00C2E0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }} aria-hidden="true">⚡</div>
                <span style={{ fontFamily: 'var(--font-syne, sans-serif)', fontWeight: 700, fontSize: '0.9rem' }}>
                  Flow<span style={{ color: '#0066FF' }}>Desk</span>
                </span>
              </div>
              <p style={{ fontSize: 12, color: '#4B5570', lineHeight: 1.7 }}>
                Plataforma de gestão para times modernos. Infraestrutura no Brasil,
                conformidade LGPD, suporte em português.
              </p>
            </div>

            {/* Links */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40 }}>
              {[
                { title: 'Produto', links: ['Funcionalidades', 'Preços', 'Changelog', 'Roadmap'] },
                { title: 'Empresa',  links: ['Sobre', 'Blog', 'Imprensa', 'Carreiras'] },
                { title: 'Legal',    links: ['Privacidade', 'Termos de Uso', 'Cookies', 'LGPD'] },
              ].map(col => (
                <nav key={col.title} aria-label={col.title}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: '#E8EDF5', letterSpacing: '0.10em', textTransform: 'uppercase', marginBottom: 12 }}>
                    {col.title}
                  </p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {col.links.map(l => (
                      <li key={l}>
                        <a
                          href="#"
                          style={{ fontSize: 13, color: '#4B5570', textDecoration: 'none', transition: 'color 150ms ease' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#E8EDF5')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#4B5570')}
                        >
                          {l}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          </div>

          <div
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
          >
            <p style={{ fontSize: 11, color: '#4B5570' }}>
              © {new Date().getFullYear()} FlowDesk. Todos os direitos reservados. Template por{' '}
              <a href="/" style={{ color: '#3385FF', textDecoration: 'underline' }}>CCP NEXATECH</a>.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 11,
                  color: '#22c55e',
                  background: 'rgba(34,197,94,0.10)',
                  border: '1px solid rgba(34,197,94,0.20)',
                  borderRadius: 4,
                  padding: '3px 8px',
                }}
                aria-label="Todos os sistemas operacionais"
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'pulse 3s ease-in-out infinite' }} aria-hidden="true" />
                Todos os sistemas operacionais
              </span>
            </div>
          </div>

          {/* LGPD disclosure */}
          <p style={{ fontSize: 11, color: '#3A4460', marginTop: 16, lineHeight: 1.6, borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 16 }}>
            <strong style={{ color: '#4B5570' }}>Proteção de dados:</strong>{' '}
            Coletamos apenas dados estritamente necessários para a prestação do serviço. Não vendemos nem compartilhamos seus dados com terceiros para fins comerciais.
            Dados armazenados na AWS São Paulo (sa-east-1), criptografados em repouso (AES-256) e em trânsito (TLS 1.3).
            Conforme a Lei nº 13.709/2018 (LGPD), você pode solicitar acesso, correção ou exclusão dos seus dados pelo e-mail{' '}
            <a href="mailto:privacidade@flowdesk.com.br" style={{ color: '#3385FF' }}>privacidade@flowdesk.com.br</a>.
          </p>
        </div>
      </footer>

      {/* ── Spin animation injected ─────────────────────────────────────── */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}