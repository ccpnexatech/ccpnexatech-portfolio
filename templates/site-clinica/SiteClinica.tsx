'use client'

import { useState } from 'react'

/* ── Paleta específica deste template ──────────────────────────────────────── */
const C = {
  primary:    '#0F6E56',
  primaryMid: '#138A6C',
  primaryLt:  '#E8F5F1',
  bg:         '#F7FAF9',
  white:      '#FFFFFF',
  text:       '#1A2A24',
  muted:      '#5A7A70',
  border:     '#D1E8DF',
} as const

/* ── Dados ─────────────────────────────────────────────────────────────────── */
const SPECIALTIES = [
  { icon: '🫀', name: 'Cardiologia',    desc: 'Prevenção, diagnóstico e tratamento de doenças cardiovasculares.' },
  { icon: '🧠', name: 'Neurologia',     desc: 'Cuidado especializado para saúde do sistema nervoso central.' },
  { icon: '🩺', name: 'Clínica Geral',  desc: 'Acompanhamento médico completo para toda a família.' },
  { icon: '🦷', name: 'Odontologia',    desc: 'Saúde bucal preventiva, restauradora e estética.' },
  { icon: '👁️', name: 'Oftalmologia',   desc: 'Saúde ocular e cirurgia refrativa a laser.' },
  { icon: '🧘', name: 'Psicologia',     desc: 'Saúde mental, terapia cognitivo-comportamental e psicoterapia.' },
]

const TEAM = [
  { name: 'Dra. Maria Costa',   specialty: 'Cardiologia',   crm: 'CRM-CE 12345', avatar: 'MC', exp: '15 anos' },
  { name: 'Dr. João Araújo',    specialty: 'Neurologia',    crm: 'CRM-CE 23456', avatar: 'JA', exp: '12 anos' },
  { name: 'Dra. Sofia Lemos',   specialty: 'Clínica Geral', crm: 'CRM-CE 34567', avatar: 'SL', exp: '8 anos'  },
  { name: 'Dr. Lucas Ferreira', specialty: 'Oftalmologia',  crm: 'CRM-CE 45678', avatar: 'LF', exp: '10 anos' },
]

const STEPS = [
  { n: '01', title: 'Escolha a especialidade', desc: 'Selecione o médico ou a área que você precisa.' },
  { n: '02', title: 'Escolha data e horário',  desc: 'Veja a agenda em tempo real e reserve seu slot.' },
  { n: '03', title: 'Confirme pelo WhatsApp',  desc: 'Receba a confirmação instantânea por mensagem.' },
  { n: '04', title: 'Apareça e cuide-se',      desc: 'Sua saúde em boas mãos, sem complicação.' },
]

/* ── Componente ────────────────────────────────────────────────────────────── */
export default function SiteClinica() {
  const [activeSpecialty, setActiveSpecialty] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', phone: '', specialty: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleForm = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: 'var(--font-inter, sans-serif)' }} className="min-h-screen">

      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <nav style={{ background: C.white, borderBottom: `1px solid ${C.border}` }} className="sticky top-0 z-30">
        <div className="max-w-[1100px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: C.primaryLt }}>
              <span style={{ color: C.primary, fontSize: 16 }}>+</span>
            </div>
            <span className="font-syne font-[700] text-[1rem]" style={{ color: C.primary }}>
              Clínica Serena
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[13px]" style={{ color: C.muted }}>
            <a href="#especialidades" className="hover:opacity-80 transition-opacity">Especialidades</a>
            <a href="#equipe"         className="hover:opacity-80 transition-opacity">Equipe</a>
            <a href="#agendamento"    className="hover:opacity-80 transition-opacity">Agendamento</a>
            <a href="#contato"        className="hover:opacity-80 transition-opacity">Contato</a>
          </div>
          <a
            href="#agendamento"
            className="text-white text-[13px] font-[500] px-5 py-2 rounded-[6px] transition-colors"
            style={{ background: C.primary }}
          >
            Agendar consulta
          </a>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{ background: `linear-gradient(135deg, ${C.primary} 0%, #0A5242 100%)` }} className="text-white py-24 px-6">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-[rgba(255,255,255,0.15)] text-white text-[12px] font-[500] px-3 py-1 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              Fortaleza, CE · Atendimento presencial e online
            </span>
            <h1 className="font-syne text-[clamp(2rem,4vw,3rem)] font-[700] leading-[1.1] mb-5">
              Cuidamos da sua saúde com carinho e precisão.
            </h1>
            <p className="text-[17px] text-[rgba(255,255,255,0.80)] leading-relaxed mb-8">
              Equipe multidisciplinar com mais de 10 especialidades,
              infraestrutura moderna e agendamento online em minutos.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#agendamento"
                className="inline-flex items-center gap-2 bg-white text-[14px] font-[500] px-6 py-3 rounded-[8px] hover:bg-[rgba(255,255,255,0.90)] transition-colors"
                style={{ color: C.primary }}
              >
                Agendar agora →
              </a>
              <a
                href="tel:+558599999999"
                className="inline-flex items-center gap-2 border border-[rgba(255,255,255,0.30)] text-white text-[14px] font-[500] px-6 py-3 rounded-[8px] hover:bg-[rgba(255,255,255,0.08)] transition-colors"
              >
                📞 (85) 9999-9999
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '8.000+', label: 'Pacientes atendidos' },
              { value: '15 anos', label: 'De experiência' },
              { value: '10+', label: 'Especialidades' },
              { value: '98%', label: 'Satisfação dos pacientes' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-[16px] p-6"
                style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <p className="font-syne text-[2rem] font-[700] mb-1">{stat.value}</p>
                <p className="text-[13px] text-[rgba(255,255,255,0.70)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Especialidades ───────────────────────────────────────────────── */}
      <section id="especialidades" className="py-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-12">
            <p className="text-[12px] font-[500] tracking-[0.14em] uppercase mb-3" style={{ color: C.primary }}>
              Especialidades
            </p>
            <h2 className="font-syne text-[clamp(1.6rem,3vw,2.4rem)] font-[700] mb-3" style={{ color: C.text }}>
              Cuidado completo para você e sua família
            </h2>
            <p className="text-[15px] max-w-[500px] mx-auto" style={{ color: C.muted }}>
              Mais de 10 especialidades médicas em um só lugar,
              com profissionais altamente qualificados.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SPECIALTIES.map((s) => (
              <button
                key={s.name}
                onClick={() => setActiveSpecialty(activeSpecialty === s.name ? null : s.name)}
                className="text-left rounded-[16px] p-7 border transition-all"
                style={{
                  background:   activeSpecialty === s.name ? C.primaryLt : C.white,
                  borderColor:  activeSpecialty === s.name ? C.primary : C.border,
                }}
              >
                <span className="text-3xl block mb-4" role="img" aria-label={s.name}>{s.icon}</span>
                <h3 className="font-syne text-[16px] font-[600] mb-2" style={{ color: C.text }}>{s.name}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: C.muted }}>{s.desc}</p>
                <span
                  className="inline-block mt-4 text-[12px] font-[500]"
                  style={{ color: C.primary }}
                >
                  Agendar →
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Como funciona ────────────────────────────────────────────────── */}
      <section style={{ background: C.primaryLt }} className="py-20 px-6">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-syne text-[clamp(1.6rem,3vw,2.4rem)] font-[700]" style={{ color: C.text }}>
              Agendar é simples assim
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={step.n} className="relative">
                {i < STEPS.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="hidden lg:block absolute top-5 left-[calc(100%-0px)] w-full h-px"
                    style={{ background: `${C.primary}30` }}
                  />
                )}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-[700] mb-4"
                  style={{ background: C.primary, color: '#fff' }}
                >
                  {step.n}
                </div>
                <h3 className="font-syne text-[15px] font-[600] mb-1.5" style={{ color: C.text }}>{step.title}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: C.muted }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Equipe ───────────────────────────────────────────────────────── */}
      <section id="equipe" className="py-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-12">
            <p className="text-[12px] font-[500] tracking-[0.14em] uppercase mb-3" style={{ color: C.primary }}>
              Nossa equipe
            </p>
            <h2 className="font-syne text-[clamp(1.6rem,3vw,2.4rem)] font-[700]" style={{ color: C.text }}>
              Médicos que se importam com você
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM.map((doc) => (
              <div
                key={doc.name}
                className="rounded-[16px] p-6 text-center border"
                style={{ background: C.white, borderColor: C.border }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-[18px] font-[700] mx-auto mb-4"
                  style={{ background: C.primaryLt, color: C.primary }}
                >
                  {doc.avatar}
                </div>
                <h3 className="font-syne text-[15px] font-[600] mb-1" style={{ color: C.text }}>{doc.name}</h3>
                <p className="text-[13px] font-[500] mb-1" style={{ color: C.primary }}>{doc.specialty}</p>
                <p className="text-[11px] mb-2" style={{ color: C.muted }}>{doc.crm}</p>
                <span
                  className="inline-block text-[11px] font-[500] px-2 py-[2px] rounded-full"
                  style={{ background: C.primaryLt, color: C.primary }}
                >
                  {doc.exp} de exp.
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Agendamento ──────────────────────────────────────────────────── */}
      <section id="agendamento" style={{ background: C.primaryLt }} className="py-20 px-6">
        <div className="max-w-[600px] mx-auto">
          <div className="text-center mb-10">
            <p className="text-[12px] font-[500] tracking-[0.14em] uppercase mb-3" style={{ color: C.primary }}>
              Agendamento online
            </p>
            <h2 className="font-syne text-[clamp(1.6rem,3vw,2.4rem)] font-[700]" style={{ color: C.text }}>
              Agende sua consulta agora
            </h2>
          </div>

          <div
            className="rounded-[20px] p-8 border"
            style={{ background: C.white, borderColor: C.border }}
          >
            {sent ? (
              <div className="text-center py-8">
                <span className="text-5xl block mb-4">✅</span>
                <h3 className="font-syne text-[20px] font-[700] mb-2" style={{ color: C.text }}>
                  Solicitação recebida!
                </h3>
                <p className="text-[14px]" style={{ color: C.muted }}>
                  Entraremos em contato pelo WhatsApp em até 2 horas úteis para confirmar seu horário.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForm} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-[500] mb-1.5" style={{ color: C.muted }}>
                      Nome completo
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Seu nome"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-[14px] px-4 py-3 rounded-[8px] border focus:outline-none transition-colors"
                      style={{ borderColor: C.border, color: C.text }}
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-[500] mb-1.5" style={{ color: C.muted }}>
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(85) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full text-[14px] px-4 py-3 rounded-[8px] border focus:outline-none transition-colors"
                      style={{ borderColor: C.border, color: C.text }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-[500] mb-1.5" style={{ color: C.muted }}>
                    Especialidade
                  </label>
                  <select
                    required
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full text-[14px] px-4 py-3 rounded-[8px] border focus:outline-none transition-colors appearance-none"
                    style={{ borderColor: C.border, color: formData.specialty ? C.text : C.muted, background: C.white }}
                  >
                    <option value="" disabled>Selecione...</option>
                    {SPECIALTIES.map((s) => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-[500] mb-1.5" style={{ color: C.muted }}>
                    Descreva brevemente o motivo (opcional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Conte um pouco sobre o que você precisa..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full text-[14px] px-4 py-3 rounded-[8px] border focus:outline-none transition-colors resize-none"
                    style={{ borderColor: C.border, color: C.text }}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full text-white text-[14px] font-[500] py-3.5 rounded-[8px] transition-colors"
                  style={{ background: C.primary }}
                >
                  Solicitar agendamento
                </button>
                <p className="text-center text-[11px]" style={{ color: C.muted }}>
                  Confirmação em até 2 horas úteis · Atendimento seg–sex 8h–18h
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer
        className="py-10 px-6"
        style={{ background: C.primary, color: 'rgba(255,255,255,0.70)' }}
      >
        <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-syne font-[700] text-white text-[15px] mb-1">Clínica Serena</p>
            <p className="text-[12px]">Rua das Flores, 123 · Meireles · Fortaleza, CE</p>
          </div>
          <p className="text-[12px]">
            Template por{' '}
            <a href="/" className="text-white hover:underline">CCP NEXATECH</a>
          </p>
        </div>
      </footer>
    </div>
  )
}