'use client'

import { useState } from 'react'

/* ── Dados ─────────────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: '⚡',
    title: 'Automação inteligente',
    desc: 'Automatize tarefas repetitivas e foque no que realmente importa para o seu negócio.',
  },
  {
    icon: '📊',
    title: 'Analytics em tempo real',
    desc: 'Dashboards claros e atualizados ao segundo para decisões baseadas em dados reais.',
  },
  {
    icon: '🔒',
    title: 'Segurança enterprise',
    desc: 'Criptografia de ponta a ponta, 2FA e conformidade com LGPD e GDPR incluídos.',
  },
  {
    icon: '🤝',
    title: 'Colaboração em equipe',
    desc: 'Workspaces compartilhados, permissões granulares e histórico completo de ações.',
  },
  {
    icon: '🔗',
    title: '+200 integrações',
    desc: 'Conecte com as ferramentas que você já usa: Slack, Notion, Trello, Google e mais.',
  },
  {
    icon: '📱',
    title: 'Mobile-first',
    desc: 'Acesse de qualquer dispositivo. PWA disponível para iOS e Android.',
  },
]

const PLANS = [
  {
    name:     'Starter',
    price:    'R$ 0',
    period:   '/ mês',
    desc:     'Para começar sem compromisso.',
    features: ['Até 3 usuários', '5 projetos ativos', '1 GB de storage', 'Suporte por e-mail'],
    cta:      'Começar grátis',
    featured: false,
  },
  {
    name:     'Pro',
    price:    'R$ 97',
    period:   '/ mês',
    desc:     'Para times que precisam crescer rápido.',
    features: ['Usuários ilimitados', 'Projetos ilimitados', '50 GB de storage', 'Suporte prioritário 24/7', 'Analytics avançado', 'Integrações premium'],
    cta:      'Testar 14 dias grátis',
    featured: true,
  },
  {
    name:     'Enterprise',
    price:    'Sob consulta',
    period:   '',
    desc:     'Para grandes empresas com necessidades específicas.',
    features: ['Tudo do Pro', 'SLA garantido', 'SSO / SAML', 'Onboarding dedicado', 'Contrato personalizado'],
    cta:      'Falar com vendas',
    featured: false,
  },
]

const TESTIMONIALS = [
  {
    quote: 'O FlowDesk reduziu em 60% o tempo que minha equipe gastava em tarefas manuais. Resultado imediato.',
    name:  'Ana Carvalho',
    role:  'CEO, Agência Impulso',
    avatar: 'AC',
  },
  {
    quote: 'Nunca pensei que uma ferramenta pudesse ser tão simples e ao mesmo tempo tão poderosa. Adotamos em 2 dias.',
    name:  'Pedro Melo',
    role:  'CTO, FinTech Valore',
    avatar: 'PM',
  },
  {
    quote: 'O suporte é excepcional. Qualquer dúvida, alguém responde em minutos — e realmente resolve.',
    name:  'Carla Souza',
    role:  'Head of Ops, Logtech',
    avatar: 'CS',
  },
]

/* ── Componente principal ──────────────────────────────────────────────────── */
export default function LandingSaaS() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
  }

  return (
    <div className="bg-[#060D1F] text-white font-inter min-h-screen">

      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <nav className="border-b border-[rgba(255,255,255,0.06)] sticky top-0 bg-[rgba(6,13,31,0.95)] backdrop-blur-md z-30">
        <div className="max-w-[1100px] mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-syne font-[700] text-[1rem] tracking-[0.04em]">
            Flow<span className="text-[#0066FF]">Desk</span>
          </span>
          <div className="hidden md:flex items-center gap-6 text-[13px] text-[#6B7A9B]">
            <a href="#features" className="hover:text-white transition-colors">Funcionalidades</a>
            <a href="#pricing"  className="hover:text-white transition-colors">Preços</a>
            <a href="#reviews"  className="hover:text-white transition-colors">Depoimentos</a>
          </div>
          <a
            href="#waitlist"
            className="bg-[#0066FF] text-white text-[13px] font-[500] px-5 py-2 rounded-[6px] hover:bg-[#0052CC] transition-colors"
          >
            Entrar na lista →
          </a>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-24 pb-20 px-6">
        {/* Glow de fundo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="w-[600px] h-[600px] rounded-full bg-[rgba(0,102,255,0.08)] blur-[120px]" />
        </div>

        <div className="relative max-w-[760px] mx-auto text-center">
          <span className="inline-flex items-center gap-2 bg-[rgba(0,102,255,0.12)] border border-[rgba(0,102,255,0.25)] text-[#3385FF] text-[12px] font-[500] px-3 py-1 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-pulse" />
            Acesso antecipado disponível
          </span>

          <h1 className="font-syne text-[clamp(2.2rem,5vw,3.5rem)] font-[700] leading-[1.1] tracking-[-0.02em] mb-6">
            Gerencie tudo em{' '}
            <span className="text-[#0066FF]">um único lugar.</span>
            <br />Sem complicação.
          </h1>

          <p className="text-[17px] text-[#6B7A9B] leading-relaxed mb-10 max-w-[560px] mx-auto">
            FlowDesk conecta seus projetos, equipe e métricas em uma plataforma
            que foi desenhada para crescer junto com o seu negócio.
          </p>

          {/* Waitlist form */}
          <form
            id="waitlist"
            onSubmit={handleWaitlist}
            className="flex flex-col sm:flex-row gap-3 max-w-[460px] mx-auto mb-6"
          >
            {!submitted ? (
              <>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.10)] text-white placeholder-[#6B7A9B] text-[14px] px-4 py-3 rounded-[6px] focus:outline-none focus:border-[#0066FF] transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[#0066FF] text-white text-[14px] font-[500] px-6 py-3 rounded-[6px] whitespace-nowrap hover:bg-[#0052CC] transition-colors"
                >
                  Entrar na lista
                </button>
              </>
            ) : (
              <div className="flex-1 bg-[rgba(0,102,255,0.10)] border border-[rgba(0,102,255,0.30)] rounded-[6px] px-4 py-3 text-[14px] text-[#3385FF] text-center font-[500]">
                ✓ Você está na lista! Avisaremos em breve.
              </div>
            )}
          </form>

          <p className="text-[12px] text-[#4B5570]">
            Sem cartão de crédito · Cancele quando quiser · Grátis para sempre no plano Starter
          </p>
        </div>

        {/* Mock de app */}
        <div className="relative max-w-[900px] mx-auto mt-16">
          <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-[16px] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
            {/* Barra de título */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-[rgba(255,255,255,0.06)]">
              <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <span className="w-3 h-3 rounded-full bg-[#28C840]" />
              <span className="ml-4 flex-1 bg-[rgba(255,255,255,0.05)] rounded h-5 max-w-[240px]" />
            </div>
            {/* Layout do app */}
            <div className="flex h-[320px]">
              {/* Sidebar */}
              <div className="w-[180px] border-r border-[rgba(255,255,255,0.06)] p-4 flex flex-col gap-2">
                <div className="h-6 w-full bg-[rgba(0,102,255,0.15)] rounded" />
                {[90, 75, 80, 65].map((w, i) => (
                  <div key={i} className="h-4 bg-[rgba(255,255,255,0.05)] rounded" style={{ width: `${w}%` }} />
                ))}
              </div>
              {/* Conteúdo */}
              <div className="flex-1 p-5 flex flex-col gap-4">
                {/* KPI cards */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Projetos', value: '24', color: '#0066FF' },
                    { label: 'Tarefas', value: '187', color: '#00C2E0' },
                    { label: 'Membros', value: '12', color: '#F0A500' },
                  ].map((kpi) => (
                    <div key={kpi.label} className="bg-[rgba(255,255,255,0.04)] rounded-[8px] p-3 border border-[rgba(255,255,255,0.06)]">
                      <p className="text-[10px] text-[#6B7A9B] mb-1">{kpi.label}</p>
                      <p className="text-[20px] font-[700]" style={{ color: kpi.color }}>{kpi.value}</p>
                    </div>
                  ))}
                </div>
                {/* Gráfico fake */}
                <div className="flex-1 bg-[rgba(255,255,255,0.03)] rounded-[8px] border border-[rgba(255,255,255,0.06)] flex items-end p-4 gap-2">
                  {[40, 65, 50, 80, 60, 75, 90, 55, 70, 85].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm"
                      style={{
                        height: `${h}%`,
                        background: i === 9 ? '#0066FF' : `rgba(0,102,255,${0.2 + i * 0.06})`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Glow embaixo do app */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-24 bg-[rgba(0,102,255,0.15)] blur-[40px] -z-10"
          />
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-[12px] font-[500] tracking-[0.14em] uppercase text-[#0066FF] mb-3">
              Funcionalidades
            </p>
            <h2 className="font-syne text-[clamp(1.6rem,3vw,2.5rem)] font-[700] mb-4">
              Tudo que você precisa,{' '}
              <span className="text-[#0066FF]">sem o que não precisa</span>
            </h2>
            <p className="text-[#6B7A9B] text-[16px] max-w-[500px] mx-auto">
              Funcionalidades pensadas para resolver o problema real,
              não para impressionar no papel.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-[16px] p-7 hover:border-[rgba(0,102,255,0.30)] transition-colors"
              >
                <span className="text-3xl mb-4 block" role="img" aria-label={f.title}>{f.icon}</span>
                <h3 className="font-syne text-[16px] font-[600] mb-2">{f.title}</h3>
                <p className="text-[14px] text-[#6B7A9B] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6 bg-[rgba(255,255,255,0.01)]">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-[12px] font-[500] tracking-[0.14em] uppercase text-[#0066FF] mb-3">
              Preços
            </p>
            <h2 className="font-syne text-[clamp(1.6rem,3vw,2.5rem)] font-[700] mb-4">
              Simples, transparente, sem surpresas
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-[16px] p-7 flex flex-col border relative ${
                  plan.featured
                    ? 'bg-[rgba(0,102,255,0.08)] border-[rgba(0,102,255,0.40)]'
                    : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.07)]'
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0066FF] text-white text-[11px] font-[500] px-4 py-[3px] rounded-full whitespace-nowrap">
                    Mais popular
                  </span>
                )}
                <p className="text-[13px] font-[500] text-[#6B7A9B] mb-2">{plan.name}</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-syne text-[2rem] font-[700]">{plan.price}</span>
                  {plan.period && <span className="text-[13px] text-[#6B7A9B]">{plan.period}</span>}
                </div>
                <p className="text-[13px] text-[#6B7A9B] mb-6">{plan.desc}</p>

                <ul className="flex flex-col gap-2.5 flex-1 mb-7">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-[13px] text-[#c8d0e0]">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <circle cx="8" cy="8" r="7" stroke="#0066FF" strokeWidth="1.2" />
                        <path d="M5 8l2 2 4-4" stroke="#0066FF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-[8px] text-[14px] font-[500] transition-colors ${
                    plan.featured
                      ? 'bg-[#0066FF] text-white hover:bg-[#0052CC]'
                      : 'border border-[rgba(255,255,255,0.12)] text-[#c8d0e0] hover:border-[rgba(255,255,255,0.25)]'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section id="reviews" className="py-24 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-[12px] font-[500] tracking-[0.14em] uppercase text-[#0066FF] mb-3">
              Depoimentos
            </p>
            <h2 className="font-syne text-[clamp(1.6rem,3vw,2.5rem)] font-[700]">
              Quem usa, recomenda
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-[16px] p-7"
              >
                <p 
                  className={`text-[15px] text-[#c8d0e0] leading-relaxed mb-6 before:content-['"'] after:content-['"']`}
                  >
                  {t.quote}
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[rgba(0,102,255,0.20)] flex items-center justify-center text-[13px] font-[600] text-[#3385FF]">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-[13px] font-[500]">{t.name}</p>
                    <p className="text-[12px] text-[#6B7A9B]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-[700px] mx-auto text-center">
          <h2 className="font-syne text-[clamp(1.8rem,3.5vw,2.8rem)] font-[700] mb-4">
            Pronto para simplificar sua operação?
          </h2>
          <p className="text-[#6B7A9B] text-[16px] mb-8">
            Junte-se a mais de 3.400 empresas que já usam o FlowDesk.
          </p>
          <a
            href="#waitlist"
            className="inline-flex items-center gap-2 bg-[#0066FF] text-white text-[15px] font-[500] px-8 py-4 rounded-[8px] hover:bg-[#0052CC] transition-colors shadow-[0_4px_20px_rgba(0,102,255,0.35)]"
          >
            Começar grátis →
          </a>
          <p className="text-[12px] text-[#4B5570] mt-4">
            Sem cartão de crédito · Setup em 2 minutos
          </p>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-[rgba(255,255,255,0.06)] py-8 px-6">
        <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-syne font-[700] text-[14px]">
            Flow<span className="text-[#0066FF]">Desk</span>
          </span>
          <p className="text-[12px] text-[#4B5570]">
            © 2025 FlowDesk. Template por{' '}
            <a href="/" className="text-[#0066FF] hover:underline">CCP NEXATECH</a>.
          </p>
        </div>
      </footer>
    </div>
  )
}