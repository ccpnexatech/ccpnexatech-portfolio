'use client'

import { useState, useEffect, useRef, useCallback, useId } from 'react'

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  primary:     '#0A5C46',   // Verde-floresta profundo
  primaryMid:  '#0D7A5F',
  primaryLt:   '#E6F4EF',
  primaryGlow: 'rgba(10,92,70,0.12)',
  accent:      '#C8A96E',   // Dourado mineral
  accentLt:    '#FAF3E6',
  bg:          '#F7F9F7',   // Branco-mineral levemente esverdeado
  bgCard:      '#FFFFFF',
  text:        '#1A2420',
  textMid:     '#3D5048',
  textMuted:   '#6B8078',
  border:      '#D6E4DF',
  borderLight: '#EDF4F1',
  error:       '#C0392B',
  errorLt:     '#FEF0EE',
  success:     '#0A5C46',
  successLt:   '#E6F4EF',
  warning:     '#B7791F',
  warningLt:   '#FEFCE8',
} as const

// ─── Types ────────────────────────────────────────────────────────────────────
type BookingStep = 'specialty' | 'doctor' | 'datetime' | 'form' | 'confirm' | 'done'

interface Specialty {
  id: string
  icon: string
  name: string
  desc: string
  tag: string
}

interface Doctor {
  id: string
  name: string
  title: string
  specialty: string
  crm: string
  exp: string
  avatar: string
  bio: string
  availableDays: number[]  // 0=Sun…6=Sat
  rating: number
  reviews: number
}

interface TimeSlot {
  time: string
  available: boolean
}

interface BookingForm {
  name: string
  birthdate: string
  cpf: string
  phone: string
  email: string
  healthPlan: string
  notes: string
  firstVisit: boolean
  consent: boolean
  lgpdConsent: boolean
}

interface FormErrors {
  name?: string
  birthdate?: string
  cpf?: string
  phone?: string
  email?: string
  consent?: string
  lgpdConsent?: string
}

interface Booking {
  protocol: string
  doctor: Doctor
  specialty: Specialty
  date: Date
  time: string
  patient: Pick<BookingForm, 'name' | 'email' | 'phone'>
  createdAt: Date
}

interface ToastState {
  id: number
  type: 'success' | 'error' | 'info'
  message: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const SPECIALTIES: Specialty[] = [
  { id: 'cardio',    icon: '🫀', name: 'Cardiologia',     desc: 'Prevenção e tratamento de doenças cardiovasculares com tecnologia de ponta.',      tag: 'Alta demanda' },
  { id: 'neuro',     icon: '🧠', name: 'Neurologia',      desc: 'Diagnóstico e tratamento do sistema nervoso central e periférico.',                tag: '' },
  { id: 'clinica',   icon: '🩺', name: 'Clínica Geral',   desc: 'Acompanhamento integral da saúde para toda a família, todas as idades.',           tag: 'Disponível hoje' },
  { id: 'orto',      icon: '🦴', name: 'Ortopedia',       desc: 'Coluna, articulações e aparelho locomotor — tratamento clínico e cirúrgico.',      tag: '' },
  { id: 'oftalmo',   icon: '👁️', name: 'Oftalmologia',    desc: 'Saúde ocular completa: exames, cirurgia refrativa e tratamento de glaucoma.',      tag: '' },
  { id: 'psico',     icon: '🧘', name: 'Psicologia',      desc: 'Saúde mental com terapia cognitivo-comportamental e psicoterapia breve.',           tag: 'Online disponível' },
  { id: 'dermato',   icon: '✨', name: 'Dermatologia',    desc: 'Pele, cabelo e unhas — diagnóstico, tratamento e procedimentos estéticos clínicos.', tag: '' },
  { id: 'gastro',    icon: '🔬', name: 'Gastroenterologia',desc: 'Aparelho digestivo completo, endoscopia e colonoscopia no local.',                tag: '' },
]

const DOCTORS: Doctor[] = [
  {
    id: 'd1', name: 'Dra. Maria Costa',   title: 'Cardiologista',          specialty: 'cardio',
    crm: 'CRM-CE 12.345', exp: '18 anos', avatar: 'MC',
    bio: 'Pós-graduada em Cardiointervencionismo pela USP. Especialista em insuficiência cardíaca e arritmias.',
    availableDays: [1,2,3,4,5], rating: 4.9, reviews: 312,
  },
  {
    id: 'd2', name: 'Dr. João Araújo',    title: 'Neurologista',           specialty: 'neuro',
    crm: 'CRM-CE 23.456', exp: '14 anos', avatar: 'JA',
    bio: 'Fellow em Neurologia Vascular pelo Hospital das Clínicas. Especialista em cefaleia e epilepsia.',
    availableDays: [1,3,5],     rating: 4.8, reviews: 198,
  },
  {
    id: 'd3', name: 'Dra. Sofia Lemos',   title: 'Clínica Geral',          specialty: 'clinica',
    crm: 'CRM-CE 34.567', exp: '9 anos',  avatar: 'SL',
    bio: 'Residência em Medicina de Família e Comunidade. Atendimento humanizado e medicina preventiva.',
    availableDays: [1,2,3,4,5], rating: 5.0, reviews: 427,
  },
  {
    id: 'd4', name: 'Dr. Lucas Ferreira', title: 'Oftalmologista',         specialty: 'oftalmo',
    crm: 'CRM-CE 45.678', exp: '11 anos', avatar: 'LF',
    bio: 'Especialista em retina e vítreo, cirurgia refrativa LASIK/PRK e catarata.',
    availableDays: [2,4],       rating: 4.9, reviews: 156,
  },
  {
    id: 'd5', name: 'Dra. Ana Rodrigues', title: 'Dermatologista',         specialty: 'dermato',
    crm: 'CRM-CE 56.789', exp: '12 anos', avatar: 'AR',
    bio: 'Membro da Sociedade Brasileira de Dermatologia. Especialista em dermatoscopia e oncologia cutânea.',
    availableDays: [1,2,3],     rating: 4.9, reviews: 284,
  },
  {
    id: 'd6', name: 'Dr. Pedro Almeida',  title: 'Ortopedista e Traumatologista', specialty: 'orto',
    crm: 'CRM-CE 67.890', exp: '16 anos', avatar: 'PA',
    bio: 'Especialista em cirurgia do joelho e ombro. Médico da seleção cearense de atletismo.',
    availableDays: [1,3,4,5],   rating: 4.8, reviews: 203,
  },
]

const TIME_SLOTS_MORNING: TimeSlot[] = [
  { time: '08:00', available: true  },
  { time: '08:30', available: false },
  { time: '09:00', available: true  },
  { time: '09:30', available: true  },
  { time: '10:00', available: false },
  { time: '10:30', available: true  },
  { time: '11:00', available: true  },
  { time: '11:30', available: false },
]
const TIME_SLOTS_AFTERNOON: TimeSlot[] = [
  { time: '13:30', available: true  },
  { time: '14:00', available: true  },
  { time: '14:30', available: false },
  { time: '15:00', available: true  },
  { time: '15:30', available: true  },
  { time: '16:00', available: false },
  { time: '16:30', available: true  },
  { time: '17:00', available: true  },
]

const HEALTH_PLANS = [
  'Particular (sem plano)',
  'Unimed Ceará',
  'Hapvida',
  'NotreDame Intermédica',
  'Bradesco Saúde',
  'Amil',
  'SulAmérica Saúde',
  'Outro plano',
]

const TESTIMONIALS = [
  { quote: 'Atendimento impecável. A Dra. Maria Costa é extremamente atenciosa e explicou tudo com clareza. Saí da consulta com total tranquilidade.', name: 'Fernanda Lima', specialty: 'Cardiologia', stars: 5 },
  { quote: 'Agendei online em menos de 2 minutos. O sistema é intuitivo e a confirmação pelo WhatsApp foi imediata. A clínica é muito bem organizada.', name: 'Roberto Menezes', specialty: 'Ortopedia', stars: 5 },
  { quote: 'Primeira consulta presencial e já me senti acolhida. Dr. João é muito competente. A estrutura da clínica é moderna e confortável.', name: 'Cláudia Santos', specialty: 'Neurologia', stars: 5 },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateProtocol(): string {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
  return `SER-${ts}-${rand}`
}

function formatCPF(val: string): string {
  const digits = val.replace(/\D/g, '').slice(0, 11)
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

function formatPhone(val: string): string {
  const digits = val.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 10)
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim()
  return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim()
}

function validateCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '')
  if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) return false
  let sum = 0
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i)
  let rem = (sum * 10) % 11
  if (rem === 10 || rem === 11) rem = 0
  if (rem !== parseInt(digits[9])) return false
  sum = 0
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i)
  rem = (sum * 10) % 11
  if (rem === 10 || rem === 11) rem = 0
  return rem === parseInt(digits[10])
}

function getWeekDays(baseDate: Date, count = 14): Date[] {
  const days: Date[] = []
  const d = new Date(baseDate)
  d.setHours(0, 0, 0, 0)
  while (days.length < count) {
    if (d.getDay() !== 0 && d.getDay() !== 6) days.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return days
}

function formatDatePT(d: Date): string {
  return d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useIntersection(ref: React.RefObject<Element>, threshold = 0.15) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return visible
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ display: 'flex', gap: 2 }} aria-label={`${rating} de 5 estrelas`}>
        {[1,2,3,4,5].map(s => (
          <svg key={s} width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path
              d="M6 1l1.3 2.9H10L7.8 5.7l.9 3L6 7.3 3.3 8.7l.9-3L2 3.9h2.7z"
              fill={s <= Math.round(rating) ? C.accent : C.border}
            />
          </svg>
        ))}
      </div>
      <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 500 }}>{rating} ({count} avaliações)</span>
    </div>
  )
}

function Toast({ toasts, remove }: { toasts: ToastState[]; remove: (id: number) => void }) {
  return (
    <div role="status" aria-live="polite" aria-atomic="false"
      style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none' }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 10,
          background: t.type === 'success' ? 'rgba(10,92,70,0.95)' : t.type === 'error' ? 'rgba(192,57,43,0.95)' : 'rgba(10,92,70,0.85)',
          border: `1px solid ${t.type === 'success' ? 'rgba(255,255,255,0.15)' : t.type === 'error' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.15)'}`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)', maxWidth: 360, pointerEvents: 'all',
          animation: 'scToast 220ms ease-out',
        }}>
          <span style={{ fontSize: 15 }}>{t.type === 'success' ? '✓' : t.type === 'error' ? '!' : 'ℹ'}</span>
          <span style={{ fontSize: 13, color: '#fff', fontWeight: 500, flex: 1 }}>{t.message}</span>
          <button onClick={() => remove(t.id)}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 18, lineHeight: 1, flexShrink: 0 }}
            aria-label="Fechar">×</button>
        </div>
      ))}
    </div>
  )
}

function ProgressStepper({ current }: { current: BookingStep }) {
  const steps: { id: BookingStep; label: string }[] = [
    { id: 'specialty', label: 'Especialidade' },
    { id: 'doctor',    label: 'Médico' },
    { id: 'datetime',  label: 'Data e hora' },
    { id: 'form',      label: 'Dados' },
    { id: 'confirm',   label: 'Confirmar' },
  ]
  const order: BookingStep[] = ['specialty','doctor','datetime','form','confirm','done']
  const currentIdx = order.indexOf(current)

  return (
    <nav aria-label="Etapas do agendamento" style={{ marginBottom: 32 }}>
      <ol style={{ display: 'flex', alignItems: 'center', listStyle: 'none', gap: 0, overflow: 'hidden' }}>
        {steps.map((step, i) => {
          const stepIdx = order.indexOf(step.id)
          const done    = stepIdx < currentIdx
          const active  = stepIdx === currentIdx
          return (
            <li key={step.id} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700,
                  background: done ? C.primary : active ? C.accent : C.borderLight,
                  color: done ? '#fff' : active ? '#fff' : C.textMuted,
                  border: `2px solid ${done ? C.primary : active ? C.accent : C.border}`,
                  transition: 'all 300ms ease',
                }}>
                  {done ? '✓' : i + 1}
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: '0.04em',
                  color: done ? C.primary : active ? C.accent : C.textMuted,
                  whiteSpace: 'nowrap',
                  display: 'none',  // hidden on mobile, shown via CSS
                  transition: 'color 300ms ease',
                }}
                  className="sc-step-label"
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  flex: 1, height: 2,
                  background: `linear-gradient(to right, ${done ? C.primary : C.border}, ${stepIdx < currentIdx - 1 ? C.primary : C.border})`,
                  margin: '0 6px', marginBottom: 18, transition: 'background 300ms ease',
                }} aria-hidden="true" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SiteClinica() {
  // Booking state machine
  const [step, setStep]                   = useState<BookingStep>('specialty')
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null)
  const [selectedDoctor, setSelectedDoctor]       = useState<Doctor | null>(null)
  const [selectedDate, setSelectedDate]           = useState<Date | null>(null)
  const [selectedTime, setSelectedTime]           = useState<string | null>(null)
  const [completedBooking, setCompletedBooking]   = useState<Booking | null>(null)

  // UI state
  const [toasts, setToasts]               = useState<ToastState[]>([])
  const [toastCtr, setToastCtr]           = useState(0)
  const [scrolled, setScrolled]           = useState(false)
  const [activeAccordion, setActiveAccordion]     = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen]       = useState(false)

  // Form state
  const emptyForm: BookingForm = {
    name: '', birthdate: '', cpf: '', phone: '', email: '',
    healthPlan: '', notes: '', firstVisit: true, consent: false, lgpdConsent: false,
  }
  const [form, setForm]         = useState<BookingForm>(emptyForm)
  const [touched, setTouched]   = useState<Partial<Record<keyof BookingForm, boolean>>>({})
  const [submitting, setSubmitting] = useState(false)

  // Refs for scroll-trigger
  const statsRef    = useRef<HTMLDivElement>(null)
  const teamRef     = useRef<HTMLDivElement>(null)
  const bookingRef  = useRef<HTMLDivElement>(null)
  const statsVis    = useIntersection(statsRef as React.RefObject<Element>)
  const teamVis     = useIntersection(teamRef  as React.RefObject<Element>)

  // Available days for selected doctor
  const today     = new Date()
  const weekDays  = getWeekDays(today, 21)
  const availDays = selectedDoctor
    ? weekDays.filter(d => selectedDoctor.availableDays.includes(d.getDay()))
    : []

  // Slots for selected date (randomise a bit per day to look real)
  const morningSlots: TimeSlot[] = selectedDate
    ? TIME_SLOTS_MORNING.map((s, i) => ({
        ...s,
        available: s.available && ((selectedDate.getDate() + i) % 3 !== 0),
      }))
    : TIME_SLOTS_MORNING
  const afternoonSlots: TimeSlot[] = selectedDate
    ? TIME_SLOTS_AFTERNOON.map((s, i) => ({
        ...s,
        available: s.available && ((selectedDate.getDate() + i + 1) % 4 !== 0),
      }))
    : TIME_SLOTS_AFTERNOON

  // Toast
  const addToast = useCallback((type: ToastState['type'], msg: string) => {
    const id = toastCtr + 1
    setToastCtr(id)
    setToasts(p => [...p, { id, type, message: msg }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 5000)
  }, [toastCtr])
  const removeToast = useCallback((id: number) => setToasts(p => p.filter(t => t.id !== id)), [])

  // Scroll
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  // Form validation
  const validateForm = (f: BookingForm): FormErrors => {
    const e: FormErrors = {}
    if (!f.name.trim() || f.name.trim().length < 3) e.name = 'Nome completo obrigatório (mínimo 3 caracteres)'
    if (!f.birthdate) e.birthdate = 'Data de nascimento obrigatória'
    else {
      const bd = new Date(f.birthdate)
      const now = new Date()
      const age = now.getFullYear() - bd.getFullYear()
      if (age < 0 || age > 130) e.birthdate = 'Data de nascimento inválida'
    }
    const cpfDigits = f.cpf.replace(/\D/g, '')
    if (!cpfDigits) e.cpf = 'CPF obrigatório'
    else if (!validateCPF(cpfDigits)) e.cpf = 'CPF inválido — verifique os dígitos'
    const phoneDigits = f.phone.replace(/\D/g, '')
    if (!phoneDigits) e.phone = 'Telefone obrigatório'
    else if (phoneDigits.length < 10) e.phone = 'Telefone inválido'
    if (!f.email.trim()) e.email = 'E-mail obrigatório'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) e.email = 'E-mail inválido'
    if (!f.consent)     e.consent     = 'Você precisa confirmar os dados para continuar'
    if (!f.lgpdConsent) e.lgpdConsent = 'Consentimento para tratamento de dados de saúde é obrigatório (LGPD Art. 11)'
    return e
  }

  const errors   = validateForm(form)
  const formOk   = Object.keys(errors).length === 0
  const getErr = (field: keyof FormErrors) => touched[field as keyof BookingForm] ? errors[field] : undefined

  const touchField = (field: keyof BookingForm) =>
    setTouched(p => ({ ...p, [field]: true }))

  const updateForm = (field: keyof BookingForm, value: string | boolean) =>
    setForm(p => ({ ...p, [field]: value }))

  // Step navigation
  const goTo = (s: BookingStep) => {
    setStep(s)
    // Scroll booking section into view
    setTimeout(() => bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  const selectSpecialty = (sp: Specialty) => {
    setSelectedSpecialty(sp)
    setSelectedDoctor(null)
    setSelectedDate(null)
    setSelectedTime(null)
    goTo('doctor')
  }

  const selectDoctor = (d: Doctor) => {
    setSelectedDoctor(d)
    setSelectedDate(null)
    setSelectedTime(null)
    goTo('datetime')
  }

  const selectDateTime = () => {
    if (!selectedDate || !selectedTime) {
      addToast('error', 'Selecione uma data e horário para continuar.')
      return
    }
    goTo('form')
  }

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ name: true, birthdate: true, cpf: true, phone: true, email: true, consent: true, lgpdConsent: true })
    if (!formOk) {
      addToast('error', 'Corrija os campos destacados antes de continuar.')
      return
    }
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1400))
    const booking: Booking = {
      protocol:  generateProtocol(),
      doctor:    selectedDoctor!,
      specialty: selectedSpecialty!,
      date:      selectedDate!,
      time:      selectedTime!,
      patient:   { name: form.name, email: form.email, phone: form.phone },
      createdAt: new Date(),
    }
    setCompletedBooking(booking)
    setSubmitting(false)
    goTo('done')
    addToast('success', `Consulta confirmada! Protocolo ${booking.protocol}`)
  }

  const resetBooking = () => {
    setStep('specialty')
    setSelectedSpecialty(null)
    setSelectedDoctor(null)
    setSelectedDate(null)
    setSelectedTime(null)
    setForm(emptyForm)
    setTouched({})
    setCompletedBooking(null)
    bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Filtered doctors
  const filteredDoctors = selectedSpecialty
    ? DOCTORS.filter(d => d.specialty === selectedSpecialty.id)
    : DOCTORS

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: 'var(--font-inter, sans-serif)', minHeight: '100vh' }}>

      {/* ── Global CSS ──────────────────────────────────────────────────── */}
      <style>{`
        @keyframes scFadeUp   { from { opacity:0; transform:translateY(22px) } to { opacity:1; transform:translateY(0) } }
        @keyframes scToast    { from { opacity:0; transform:translateX(20px) } to { opacity:1; transform:translateX(0) } }
        @keyframes scPulse    { 0%,100% { opacity:1 } 50% { opacity:.45 } }
        @keyframes scSpin     { to { transform: rotate(360deg) } }
        @keyframes scCountUp  { from { opacity:0; transform:scale(.9) } to { opacity:1; transform:scale(1) } }
        * { box-sizing:border-box; margin:0; padding:0 }
        html { scroll-behavior:smooth }
        ::selection { background:rgba(10,92,70,0.18) }
        .sc-step-label { display:none }
        @media(min-width:640px) { .sc-step-label { display:block !important } }
        .sc-card-hover { transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease }
        .sc-card-hover:hover { transform:translateY(-3px); box-shadow:0 12px 36px rgba(10,92,70,0.12) }
        .sc-spec-btn:hover:not(:disabled) { background:${C.primaryLt} !important; border-color:${C.primaryMid} !important }
        .sc-spec-btn.active { background:${C.primaryLt} !important; border-color:${C.primary} !important }
        .sc-time-btn:hover:not(:disabled):not([data-unavail]) { background:${C.primaryLt} !important; border-color:${C.primaryMid} !important }
        .sc-day-btn:hover:not(:disabled) { background:${C.primaryLt} !important; border-color:${C.primaryMid} !important }
        .sc-input:focus { outline:none; border-color:${C.primary} !important; box-shadow:0 0 0 3px ${C.primaryGlow} }
        .sc-input.error { border-color:${C.error} !important }
        .sc-nav-link { color:${C.textMid}; text-decoration:none; font-size:14px; font-weight:500; padding:8px 12px; border-radius:7px; transition:color 150ms ease, background 150ms ease }
        .sc-nav-link:hover { color:${C.primary}; background:${C.primaryLt} }
        :focus-visible { outline:2px solid ${C.primary} !important; outline-offset:3px !important; border-radius:6px !important }
        @media(max-width:768px) { .sc-hide-mobile { display:none !important } }
        @media(min-width:769px) { .sc-show-mobile { display:none !important } }
      `}</style>

      <Toast toasts={toasts} remove={removeToast} />

      {/* ── Topbar ────────────────────────────────────────────────────────── */}
      <div style={{ background: C.primary, padding: '8px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
          🏥 Segunda a Sexta, 7h–20h · Sábados 8h–13h ·{' '}
          <a href="tel:+558532109999" style={{ color: '#fff', fontWeight: 700, textDecoration: 'none' }}>
            (85) 3210-9999
          </a>
          {' '}· Rua das Flores, 1450 — Meireles, Fortaleza
        </p>
      </div>

      {/* ── Navbar ────────────────────────────────────────────────────────── */}
      <header role="banner" style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: scrolled ? 'rgba(247,249,247,0.97)' : C.bg,
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${scrolled ? C.border : 'transparent'}`,
        transition: 'border-color 300ms ease, background 300ms ease',
      }}>
        <nav style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}
          aria-label="Navegação principal">

          <a href="#inicio" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }} aria-label="Clínica Serena — início">
            <div style={{ width: 36, height: 36, borderRadius: 10, background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#fff', flexShrink: 0 }} aria-hidden="true">+</div>
            <div>
              <p style={{ fontFamily: 'var(--font-syne, sans-serif)', fontWeight: 700, fontSize: '1.05rem', color: C.primary, lineHeight: 1.1 }}>Clínica Serena</p>
              <p style={{ fontSize: 10, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Medicina de excelência</p>
            </div>
          </a>

          <ul className="sc-hide-mobile" style={{ display: 'flex', gap: 2, listStyle: 'none', alignItems: 'center' }}>
            {[['#especialidades','Especialidades'],['#equipe','Equipe'],['#agendamento','Agendamento'],['#depoimentos','Depoimentos']].map(([h,l]) => (
              <li key={h}><a href={h} className="sc-nav-link">{l}</a></li>
            ))}
          </ul>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <a href="tel:+558532109999" className="sc-hide-mobile"
              style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.primary, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              <span aria-hidden="true">📞</span> (85) 3210-9999
            </a>
            <a href="#agendamento"
              style={{ background: C.primary, color: '#fff', fontSize: 13, fontWeight: 600, padding: '9px 20px', borderRadius: 8, textDecoration: 'none', whiteSpace: 'nowrap', transition: 'background 150ms ease' }}
              onMouseEnter={e => (e.currentTarget.style.background = C.primaryMid)}
              onMouseLeave={e => (e.currentTarget.style.background = C.primary)}>
              Agendar consulta
            </a>
            <button className="sc-show-mobile"
              onClick={() => setMobileMenuOpen(v => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: C.text }}
              aria-expanded={mobileMenuOpen} aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}>
              {mobileMenuOpen
                ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
                : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
              }
            </button>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div role="dialog" aria-modal="true" aria-label="Menu"
            style={{ background: C.bgCard, borderTop: `1px solid ${C.border}`, padding: '16px 24px 28px' }}>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
              {[['#especialidades','Especialidades'],['#equipe','Equipe'],['#agendamento','Agendamento'],['#depoimentos','Depoimentos']].map(([h,l]) => (
                <li key={h}>
                  <a href={h} onClick={() => setMobileMenuOpen(false)}
                    style={{ display: 'block', color: C.text, fontSize: 15, fontWeight: 500, textDecoration: 'none', padding: '12px 16px', borderRadius: 8 }}>
                    {l}
                  </a>
                </li>
              ))}
            </ul>
            <a href="tel:+558532109999"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: '12px', textDecoration: 'none', color: C.primary, fontWeight: 600, fontSize: 14, marginBottom: 10 }}>
              📞 (85) 3210-9999
            </a>
            <a href="#agendamento" onClick={() => setMobileMenuOpen(false)}
              style={{ display: 'block', textAlign: 'center', background: C.primary, color: '#fff', fontSize: 14, fontWeight: 600, padding: '14px', borderRadius: 8, textDecoration: 'none' }}>
              Agendar consulta →
            </a>
          </div>
        )}
      </header>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section id="inicio" aria-labelledby="hero-h1"
        style={{ background: `linear-gradient(135deg, ${C.primary} 0%, #0A3D2E 100%)`, padding: '80px 24px 96px', overflow: 'hidden', position: 'relative' }}>

        {/* Decorative circles */}
        <div aria-hidden="true">
          {[
            { w:500,h:500, top:'50%', right:'-10%', op:.06 },
            { w:300,h:300, top:'10%', right:'15%',  op:.04 },
          ].map((c,i) => (
            <div key={i} style={{
              position:'absolute', width:c.w, height:c.h, top:c.top, right:c.right,
              borderRadius:'50%', border:`1px solid rgba(255,255,255,${c.op})`,
              transform:'translateY(-50%)', pointerEvents:'none',
            }}/>
          ))}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:60, background:`linear-gradient(to top, ${C.bg}, transparent)`, pointerEvents:'none'}} />
        </div>

        <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }}
          className="sc-hero-grid">
          <div style={{ animation: 'scFadeUp 600ms ease-out both' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.12)', borderRadius:9999, padding:'5px 14px', marginBottom:24 }}>
              <span style={{ width:7, height:7, borderRadius:'50%', background:'#7DDBB8', animation:'scPulse 2s ease-in-out infinite' }} aria-hidden="true"/>
              <span style={{ fontSize:12, color:'rgba(255,255,255,0.85)', fontWeight:500 }}>Fortaleza · Atendimento presencial e online</span>
            </div>

            <h1 id="hero-h1"
              style={{ fontFamily:'var(--font-syne, sans-serif)', fontSize:'clamp(2rem,4.5vw,3.2rem)', fontWeight:700, lineHeight:1.1, color:'#fff', marginBottom:20, letterSpacing:'-0.01em' }}>
              Cuidamos da sua saúde com{' '}
              <span style={{ color:'#A8DEC9' }}>precisão e humanidade.</span>
            </h1>

            <p style={{ fontSize:17, color:'rgba(255,255,255,0.72)', lineHeight:1.75, marginBottom:36, maxWidth:480 }}>
              Equipe multidisciplinar, infraestrutura de alto padrão e agendamento online em minutos —
              sem filas, sem burocracia.
            </p>

            <div style={{ display:'flex', flexWrap:'wrap', gap:12 }}>
              <a href="#agendamento"
                style={{ background:'#fff', color:C.primary, fontSize:14, fontWeight:700, padding:'13px 28px', borderRadius:9, textDecoration:'none', transition:'transform 150ms ease, box-shadow 150ms ease', display:'inline-flex', alignItems:'center', gap:8 }}
                onMouseEnter={e => { e.currentTarget.style.transform='scale(1.02)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.2)' }}
                onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='none' }}>
                📅 Agendar agora
              </a>
              <a href="tel:+558532109999"
                style={{ border:'1.5px solid rgba(255,255,255,0.35)', color:'#fff', fontSize:14, fontWeight:600, padding:'13px 24px', borderRadius:9, textDecoration:'none', transition:'background 150ms ease' }}
                onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.background='transparent')}>
                📞 Ligar agora
              </a>
            </div>

            {/* Trust badges */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:16, marginTop:32 }}>
              {[
                { icon:'🏆', label:'15 anos de excelência' },
                { icon:'👨‍⚕️', label:'25 especialistas' },
                { icon:'⭐', label:'98% de satisfação' },
              ].map(b => (
                <div key={b.label} style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ fontSize:14 }} aria-hidden="true">{b.icon}</span>
                  <span style={{ fontSize:12, color:'rgba(255,255,255,0.65)', fontWeight:500 }}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats cards */}
          <div ref={statsRef} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, animation: statsVis ? 'scFadeUp 600ms 200ms ease-out both' : 'none' }}>
            {[
              { value:'10+',   label:'Especialidades médicas',       icon:'🩺', color:'rgba(167,222,194,0.15)' },
              { value:'8.000+',label:'Pacientes atendidos',          icon:'👥', color:'rgba(167,222,194,0.10)' },
              { value:'15',    label:'Anos de experiência clínica',  icon:'🏆', color:'rgba(200,169,110,0.15)' },
              { value:'98%',   label:'Índice de satisfação (NPS)',   icon:'⭐', color:'rgba(167,222,194,0.10)' },
            ].map((s, i) => (
              <div key={s.label}
                style={{
                  background: s.color,
                  border:'1px solid rgba(255,255,255,0.12)',
                  borderRadius:16, padding:'20px 20px',
                  animation: statsVis ? `scCountUp 500ms ${i*100}ms ease-out both` : 'none',
                }}>
                <span style={{ fontSize:28, display:'block', marginBottom:8 }} role="img" aria-label={s.label}>{s.icon}</span>
                <p style={{ fontFamily:'var(--font-syne, sans-serif)', fontSize:'clamp(1.4rem,2.5vw,2rem)', fontWeight:700, color:'#fff', lineHeight:1, marginBottom:4 }}>{s.value}</p>
                <p style={{ fontSize:12, color:'rgba(255,255,255,0.60)', lineHeight:1.4 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <style>{`@media(max-width:768px){ .sc-hero-grid { grid-template-columns:1fr !important } }`}</style>
      </section>

      {/* ── Especialidades ────────────────────────────────────────────────── */}
      <section id="especialidades" aria-labelledby="spec-h2"
        style={{ padding:'80px 24px', background:C.bgCard, borderBottom:`1px solid ${C.borderLight}` }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:C.primary, marginBottom:12 }}>Especialidades</p>
            <h2 id="spec-h2"
              style={{ fontFamily:'var(--font-syne, sans-serif)', fontSize:'clamp(1.6rem,3vw,2.4rem)', fontWeight:700, color:C.text, marginBottom:14 }}>
              Cuidado integral para toda a família
            </h2>
            <p style={{ fontSize:15, color:C.textMuted, maxWidth:520, margin:'0 auto', lineHeight:1.7 }}>
              Mais de 10 especialidades em um único lugar, com médicos altamente qualificados
              e tecnologia diagnóstica de ponta.
            </p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}
            className="sc-spec-grid">
            <style>{`
              @media(max-width:1024px){ .sc-spec-grid { grid-template-columns:repeat(3,1fr) !important } }
              @media(max-width:640px) { .sc-spec-grid { grid-template-columns:repeat(2,1fr) !important } }
            `}</style>
            {SPECIALTIES.map(sp => (
              <button key={sp.id}
                className="sc-spec-btn sc-card-hover"
                onClick={() => { setStep('specialty'); selectSpecialty(sp); setTimeout(()=>bookingRef.current?.scrollIntoView({behavior:'smooth',block:'start'}),60) }}
                style={{
                  background: selectedSpecialty?.id === sp.id ? C.primaryLt : C.bg,
                  border:`1.5px solid ${selectedSpecialty?.id===sp.id ? C.primary : C.border}`,
                  borderRadius:14, padding:'22px 18px', textAlign:'left', cursor:'pointer',
                  transition:'all 200ms ease',
                }}>
                <span style={{ fontSize:30, display:'block', marginBottom:12 }} role="img" aria-label={sp.name}>{sp.icon}</span>
                <h3 style={{ fontFamily:'var(--font-syne, sans-serif)', fontSize:15, fontWeight:700, color:C.text, marginBottom:6 }}>{sp.name}</h3>
                <p style={{ fontSize:12, color:C.textMuted, lineHeight:1.6, marginBottom:10 }}>{sp.desc}</p>
                {sp.tag && (
                  <span style={{
                    fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:4,
                    background: sp.tag.includes('hoje') ? 'rgba(10,92,70,0.12)' : 'rgba(200,169,110,0.15)',
                    color: sp.tag.includes('hoje') ? C.primary : C.warning,
                    letterSpacing:'0.04em', textTransform:'uppercase',
                  }}>{sp.tag}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Equipe ────────────────────────────────────────────────────────── */}
      <section id="equipe" aria-labelledby="team-h2"
        style={{ padding:'80px 24px', background:C.bg }}>
        <div ref={teamRef} style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:C.primary, marginBottom:12 }}>Nossa equipe</p>
            <h2 id="team-h2"
              style={{ fontFamily:'var(--font-syne, sans-serif)', fontSize:'clamp(1.6rem,3vw,2.4rem)', fontWeight:700, color:C.text, marginBottom:14 }}>
              Médicos que se importam com você
            </h2>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}
            className="sc-team-grid">
            <style>{`
              @media(max-width:900px){ .sc-team-grid { grid-template-columns:repeat(2,1fr) !important } }
              @media(max-width:580px){ .sc-team-grid { grid-template-columns:1fr !important } }
            `}</style>
            {DOCTORS.map((doc, i) => (
              <div key={doc.id}
                className="sc-card-hover"
                style={{
                  background:C.bgCard, border:`1px solid ${C.borderLight}`, borderRadius:16, padding:24,
                  animation: teamVis ? `scFadeUp 500ms ${i*80}ms ease-out both` : 'none',
                }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:14 }}>
                  <div style={{
                    width:52, height:52, borderRadius:'50%', flexShrink:0,
                    background: C.primaryLt, border:`2px solid ${C.primary}20`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontFamily:'var(--font-syne, sans-serif)', fontSize:16, fontWeight:700, color:C.primary,
                  }} aria-hidden="true">{doc.avatar}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <h3 style={{ fontFamily:'var(--font-syne, sans-serif)', fontSize:15, fontWeight:700, color:C.text, marginBottom:2 }}>{doc.name}</h3>
                    <p style={{ fontSize:12, color:C.primary, fontWeight:600, marginBottom:3 }}>{doc.title}</p>
                    <p style={{ fontSize:11, color:C.textMuted, fontFamily:'var(--font-mono, monospace)' }}>{doc.crm}</p>
                  </div>
                </div>

                <StarRating rating={doc.rating} count={doc.reviews} />

                <p style={{ fontSize:13, color:C.textMuted, lineHeight:1.65, margin:'12px 0' }}>{doc.bio}</p>

                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:12, borderTop:`1px solid ${C.borderLight}` }}>
                  <span style={{ fontSize:11, color:C.textMuted }}>
                    <strong style={{ color:C.textMid }}>{doc.exp}</strong> de experiência
                  </span>
                  <button
                    onClick={() => { setSelectedSpecialty(SPECIALTIES.find(s=>s.id===doc.specialty) || null); selectDoctor(doc) }}
                    style={{
                      background:C.primary, color:'#fff', border:'none', borderRadius:7,
                      padding:'7px 14px', fontSize:12, fontWeight:600, cursor:'pointer',
                      transition:'background 150ms ease',
                    }}
                    onMouseEnter={e=>(e.currentTarget.style.background=C.primaryMid)}
                    onMouseLeave={e=>(e.currentTarget.style.background=C.primary)}>
                    Agendar →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Agendamento ───────────────────────────────────────────────────── */}
      <section id="agendamento" aria-labelledby="book-h2"
        ref={bookingRef}
        style={{ padding:'80px 24px', background:C.primaryLt, borderTop:`1px solid ${C.border}` }}>
        <div style={{ maxWidth:860, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:C.primary, marginBottom:12 }}>Agendamento online</p>
            <h2 id="book-h2"
              style={{ fontFamily:'var(--font-syne, sans-serif)', fontSize:'clamp(1.6rem,3vw,2.4rem)', fontWeight:700, color:C.text, marginBottom:10 }}>
              Agende sua consulta agora
            </h2>
            <p style={{ fontSize:14, color:C.textMuted }}>Confirmação imediata · Sem filas · 100% online</p>
          </div>

          {/* Card container */}
          <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:20, padding:'36px 40px', boxShadow:'0 8px 40px rgba(10,92,70,0.08)' }}>

            {/* ── DONE ── */}
            {step === 'done' && completedBooking && (
              <div style={{ textAlign:'center', padding:'16px 0', animation:'scFadeUp 400ms ease-out' }}>
                <div style={{ width:72, height:72, borderRadius:'50%', background:C.primaryLt, border:`2px solid ${C.primary}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, margin:'0 auto 20px' }} aria-hidden="true">✓</div>
                <h3 style={{ fontFamily:'var(--font-syne, sans-serif)', fontSize:22, fontWeight:700, color:C.text, marginBottom:8 }}>
                  Consulta confirmada!
                </h3>
                <p style={{ fontSize:14, color:C.textMuted, marginBottom:28, lineHeight:1.6 }}>
                  Uma confirmação foi enviada para{' '}
                  <strong style={{ color:C.text }}>{completedBooking.patient.email}</strong>.<br/>
                  Guarde o protocolo abaixo para referência.
                </p>

                {/* Protocol card */}
                <div style={{ background:C.bg, border:`1.5px solid ${C.border}`, borderRadius:14, padding:'20px 24px', marginBottom:28, textAlign:'left' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12, marginBottom:16, paddingBottom:16, borderBottom:`1px solid ${C.borderLight}` }}>
                    <div>
                      <p style={{ fontSize:11, color:C.textMuted, marginBottom:3, letterSpacing:'0.08em', textTransform:'uppercase' }}>Número do protocolo</p>
                      <p style={{ fontFamily:'var(--font-mono, monospace)', fontSize:18, fontWeight:700, color:C.primary, letterSpacing:'0.06em' }}>{completedBooking.protocol}</p>
                    </div>
                    <span style={{ background:C.primaryLt, color:C.primary, fontSize:11, fontWeight:700, padding:'5px 12px', borderRadius:6, letterSpacing:'0.06em', textTransform:'uppercase' }}>
                      Confirmado
                    </span>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px 24px' }}>
                    {[
                      { label:'Paciente',      value: completedBooking.patient.name },
                      { label:'Especialidade', value: completedBooking.specialty.name },
                      { label:'Médico',        value: completedBooking.doctor.name },
                      { label:'Data',          value: formatDatePT(completedBooking.date) },
                      { label:'Horário',       value: completedBooking.time },
                      { label:'Local',         value: 'Clínica Serena — Meireles' },
                    ].map(r => (
                      <div key={r.label}>
                        <p style={{ fontSize:10, color:C.textMuted, letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:2 }}>{r.label}</p>
                        <p style={{ fontSize:13, fontWeight:600, color:C.text }}>{r.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background:C.warningLt, border:`1px solid rgba(183,121,31,0.25)`, borderRadius:10, padding:'14px 18px', textAlign:'left', marginBottom:28 }}>
                  <p style={{ fontSize:13, color:C.warning, fontWeight:600, marginBottom:4 }}>📋 Prepare-se para a consulta</p>
                  <ul style={{ fontSize:12, color:C.textMid, lineHeight:1.8, paddingLeft:16 }}>
                    <li>Chegue 15 minutos antes do horário marcado</li>
                    <li>Traga documento com foto e carteirinha do plano de saúde</li>
                    <li>Leve exames e laudos anteriores relacionados ao motivo da consulta</li>
                    <li>Em caso de cancelamento, entre em contato com pelo menos 24h de antecedência</li>
                  </ul>
                </div>

                <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
                  <button onClick={resetBooking}
                    style={{ background:C.primary, color:'#fff', border:'none', borderRadius:9, padding:'12px 24px', fontSize:14, fontWeight:600, cursor:'pointer' }}>
                    Agendar outra consulta
                  </button>
                  <a href={`tel:+558532109999`}
                    style={{ border:`1.5px solid ${C.border}`, color:C.text, borderRadius:9, padding:'12px 24px', fontSize:14, fontWeight:600, textDecoration:'none' }}>
                    📞 Ligar para a clínica
                  </a>
                </div>
              </div>
            )}

            {/* ── STEPS 1–5 ── */}
            {step !== 'done' && (
              <>
                <ProgressStepper current={step} />

                {/* STEP 1: Especialidade */}
                {step === 'specialty' && (
                  <div>
                    <h3 style={{ fontFamily:'var(--font-syne, sans-serif)', fontSize:18, fontWeight:700, color:C.text, marginBottom:6 }}>Qual especialidade você precisa?</h3>
                    <p style={{ fontSize:13, color:C.textMuted, marginBottom:24 }}>Selecione a área médica para ver os profissionais disponíveis.</p>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }} className="sc-sbook-grid">
                      <style>{`@media(max-width:640px){ .sc-sbook-grid{ grid-template-columns:repeat(2,1fr) !important } }`}</style>
                      {SPECIALTIES.map(sp => (
                        <button key={sp.id}
                          className={`sc-spec-btn${selectedSpecialty?.id===sp.id?' active':''}`}
                          onClick={() => selectSpecialty(sp)}
                          style={{
                            background: selectedSpecialty?.id===sp.id ? C.primaryLt : C.bg,
                            border:`1.5px solid ${selectedSpecialty?.id===sp.id ? C.primary : C.border}`,
                            borderRadius:12, padding:'16px 12px', textAlign:'center', cursor:'pointer',
                            transition:'all 180ms ease',
                          }}>
                          <span style={{ fontSize:24, display:'block', marginBottom:6 }} aria-label="">{sp.icon}</span>
                          <span style={{ fontSize:12, fontWeight:600, color: selectedSpecialty?.id===sp.id ? C.primary : C.text }}>{sp.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: Médico */}
                {step === 'doctor' && (
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
                      <button onClick={() => setStep('specialty')} style={{ background:'none', border:'none', cursor:'pointer', color:C.textMuted, fontSize:13, display:'flex', alignItems:'center', gap:4, padding:'4px 0' }}>
                        ← Voltar
                      </button>
                      <span style={{ color:C.border }}>|</span>
                      <p style={{ fontSize:14, color:C.textMid }}><strong style={{color:C.primary}}>{selectedSpecialty?.name}</strong></p>
                    </div>
                    <h3 style={{ fontFamily:'var(--font-syne, sans-serif)', fontSize:18, fontWeight:700, color:C.text, marginBottom:20 }}>
                      Escolha o especialista
                    </h3>
                    {filteredDoctors.length === 0 ? (
                      <div style={{ textAlign:'center', padding:'32px 0', color:C.textMuted }}>
                        <p style={{ fontSize:14 }}>Nenhum médico disponível para esta especialidade no momento.</p>
                        <button onClick={() => setStep('specialty')}
                          style={{ marginTop:12, background:C.primary, color:'#fff', border:'none', borderRadius:7, padding:'9px 18px', fontSize:13, cursor:'pointer' }}>
                          Escolher outra especialidade
                        </button>
                      </div>
                    ) : (
                      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                        {filteredDoctors.map(doc => (
                          <button key={doc.id}
                            onClick={() => selectDoctor(doc)}
                            style={{
                              display:'flex', alignItems:'center', gap:16, padding:'18px 20px',
                              background: selectedDoctor?.id===doc.id ? C.primaryLt : C.bg,
                              border:`1.5px solid ${selectedDoctor?.id===doc.id ? C.primary : C.border}`,
                              borderRadius:14, cursor:'pointer', textAlign:'left',
                              transition:'all 180ms ease',
                            }}
                            onMouseEnter={e => { if(selectedDoctor?.id!==doc.id) { e.currentTarget.style.background=C.primaryLt+'80'; e.currentTarget.style.borderColor=C.primaryMid+'60' } }}
                            onMouseLeave={e => { if(selectedDoctor?.id!==doc.id) { e.currentTarget.style.background=C.bg; e.currentTarget.style.borderColor=C.border } }}>
                            <div style={{
                              width:48, height:48, borderRadius:'50%', flexShrink:0,
                              background:C.primaryLt, display:'flex', alignItems:'center', justifyContent:'center',
                              fontFamily:'var(--font-syne, sans-serif)', fontSize:15, fontWeight:700, color:C.primary,
                            }} aria-hidden="true">{doc.avatar}</div>
                            <div style={{ flex:1, minWidth:0 }}>
                              <p style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:2 }}>{doc.name}</p>
                              <p style={{ fontSize:12, color:C.primary, fontWeight:500, marginBottom:4 }}>{doc.title}</p>
                              <StarRating rating={doc.rating} count={doc.reviews} />
                            </div>
                            <div style={{ textAlign:'right', flexShrink:0 }}>
                              <p style={{ fontSize:11, color:C.textMuted }}>{doc.exp} de exp.</p>
                              <p style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{doc.crm}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 3: Data e hora */}
                {step === 'datetime' && selectedDoctor && (
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
                      <button onClick={() => setStep('doctor')} style={{ background:'none', border:'none', cursor:'pointer', color:C.textMuted, fontSize:13, display:'flex', alignItems:'center', gap:4 }}>
                        ← Voltar
                      </button>
                      <span style={{ color:C.border }}>|</span>
                      <p style={{ fontSize:14, color:C.textMid }}><strong style={{color:C.primary}}>{selectedDoctor.name}</strong></p>
                    </div>
                    <h3 style={{ fontFamily:'var(--font-syne, sans-serif)', fontSize:18, fontWeight:700, color:C.text, marginBottom:6 }}>Escolha data e horário</h3>
                    <p style={{ fontSize:13, color:C.textMuted, marginBottom:24 }}>
                      Exibindo os próximos dias disponíveis na agenda de {selectedDoctor.name.split(' ')[0]}.
                    </p>

                    {/* Date picker */}
                    <p style={{ fontSize:12, fontWeight:600, color:C.text, letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:10 }}>Data</p>
                    <div style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:12, marginBottom:24 }}>
                      {availDays.slice(0,12).map(d => {
                        const isSelected = selectedDate?.toDateString() === d.toDateString()
                        const isPast     = d < today
                        return (
                          <button key={d.toISOString()}
                            className="sc-day-btn"
                            onClick={() => { if(!isPast) { setSelectedDate(d); setSelectedTime(null) } }}
                            disabled={isPast}
                            aria-pressed={isSelected}
                            aria-label={formatDatePT(d)}
                            style={{
                              flexShrink:0, padding:'10px 14px', borderRadius:10, border:`1.5px solid ${isSelected?C.primary:C.border}`,
                              background: isSelected ? C.primary : isPast ? C.bg : C.bgCard,
                              color: isSelected ? '#fff' : isPast ? C.border : C.text,
                              cursor: isPast ? 'not-allowed' : 'pointer',
                              textAlign:'center', transition:'all 160ms ease',
                              opacity: isPast ? 0.4 : 1,
                            }}>
                            <p style={{ fontSize:10, fontWeight:600, marginBottom:2, opacity:.8 }}>
                              {d.toLocaleDateString('pt-BR',{weekday:'short'}).replace('.','').toUpperCase()}
                            </p>
                            <p style={{ fontSize:16, fontWeight:700, lineHeight:1 }}>{d.getDate()}</p>
                            <p style={{ fontSize:10, opacity:.7, marginTop:1 }}>
                              {d.toLocaleDateString('pt-BR',{month:'short'}).replace('.','').toUpperCase()}
                            </p>
                          </button>
                        )
                      })}
                    </div>

                    {/* Time slots */}
                    {selectedDate && (
                      <div style={{ animation:'scFadeUp 300ms ease-out' }}>
                        {[
                          { label:'Manhã', slots: morningSlots },
                          { label:'Tarde', slots: afternoonSlots },
                        ].map(group => (
                          <div key={group.label} style={{ marginBottom:20 }}>
                            <p style={{ fontSize:12, fontWeight:600, color:C.text, letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:10 }}>{group.label}</p>
                            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                              {group.slots.map(slot => {
                                const isSel  = selectedTime === slot.time
                                return (
                                  <button key={slot.time}
                                    className="sc-time-btn"
                                    onClick={() => slot.available && setSelectedTime(slot.time)}
                                    disabled={!slot.available}
                                    data-unavail={!slot.available || undefined}
                                    aria-pressed={isSel}
                                    aria-label={`${slot.time} — ${slot.available ? 'disponível' : 'indisponível'}`}
                                    style={{
                                      padding:'8px 16px', borderRadius:8, fontSize:13, fontWeight:600,
                                      border:`1.5px solid ${isSel?C.primary:slot.available?C.border:C.borderLight}`,
                                      background: isSel ? C.primary : slot.available ? C.bgCard : C.bg,
                                      color: isSel ? '#fff' : slot.available ? C.text : C.border,
                                      cursor: slot.available ? 'pointer' : 'not-allowed',
                                      transition:'all 150ms ease',
                                      textDecoration: !slot.available ? 'line-through' : 'none',
                                    }}>
                                    {slot.time}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        ))}

                        {/* Legend */}
                        <div style={{ display:'flex', gap:16, marginTop:8 }}>
                          {[
                            { color:C.bgCard, border:C.border, label:'Disponível' },
                            { color:C.primary, border:C.primary, label:'Selecionado' },
                            { color:C.bg,     border:C.borderLight, label:'Ocupado' },
                          ].map(l => (
                            <div key={l.label} style={{ display:'flex', alignItems:'center', gap:5 }}>
                              <div style={{ width:14, height:14, borderRadius:4, background:l.color, border:`1.5px solid ${l.border}` }} aria-hidden="true" />
                              <span style={{ fontSize:11, color:C.textMuted }}>{l.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div style={{ marginTop:28, display:'flex', justifyContent:'flex-end' }}>
                      <button onClick={selectDateTime}
                        disabled={!selectedDate || !selectedTime}
                        style={{
                          background: selectedDate && selectedTime ? C.primary : C.border,
                          color: selectedDate && selectedTime ? '#fff' : C.textMuted,
                          border:'none', borderRadius:9, padding:'12px 28px', fontSize:14, fontWeight:600,
                          cursor: selectedDate && selectedTime ? 'pointer' : 'not-allowed',
                          transition:'background 150ms ease',
                        }}>
                        Continuar →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: Formulário */}
                {step === 'form' && (
                  <form onSubmit={handleSubmitForm} noValidate aria-label="Formulário de agendamento">
                    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
                      <button type="button" onClick={() => setStep('datetime')}
                        style={{ background:'none', border:'none', cursor:'pointer', color:C.textMuted, fontSize:13 }}>← Voltar</button>
                      <span style={{ color:C.border }}>|</span>
                      <p style={{ fontSize:13, color:C.textMuted }}>
                        {selectedDoctor?.name} · {selectedDate && formatDatePT(selectedDate)} · <strong style={{color:C.primary}}>{selectedTime}</strong>
                      </p>
                    </div>

                    <h3 style={{ fontFamily:'var(--font-syne, sans-serif)', fontSize:18, fontWeight:700, color:C.text, marginBottom:6 }}>Seus dados</h3>
                    <p style={{ fontSize:13, color:C.textMuted, marginBottom:28 }}>
                      Preencha com atenção. As informações serão usadas exclusivamente para o agendamento.
                    </p>

                    {/* Fields */}
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }} className="sc-form-grid">
                      <style>{`@media(max-width:640px){ .sc-form-grid{ grid-template-columns:1fr !important } }`}</style>

                      {/* Name */}
                      <div style={{ gridColumn:'1 / -1' }}>
                        <label htmlFor="sc-name" style={{ display:'block', fontSize:12, fontWeight:600, color:C.textMid, marginBottom:6 }}>
                          Nome completo <span style={{color:C.error}}>*</span>
                        </label>
                        <input id="sc-name" type="text" autoComplete="name"
                          value={form.name} onChange={e=>{updateForm('name',e.target.value)}} onBlur={()=>touchField('name')}
                          maxLength={100} required aria-required="true" aria-invalid={!!getErr('name')} aria-describedby={getErr('name')?'sc-name-err':undefined}
                          className={`sc-input${getErr('name')?' error':''}`}
                          style={{ width:'100%', background:C.bg, border:`1.5px solid ${getErr('name')?C.error:C.border}`, borderRadius:9, padding:'11px 14px', fontSize:14, color:C.text, outline:'none', transition:'border-color 150ms ease, box-shadow 150ms ease' }}
                          placeholder="Como consta no documento oficial"
                        />
                        {getErr('name') && <p id="sc-name-err" role="alert" style={{fontSize:12,color:C.error,marginTop:4}}>{getErr('name')}</p>}
                      </div>

                      {/* Birthdate */}
                      <div>
                        <label htmlFor="sc-bdate" style={{ display:'block', fontSize:12, fontWeight:600, color:C.textMid, marginBottom:6 }}>
                          Data de nascimento <span style={{color:C.error}}>*</span>
                        </label>
                        <input id="sc-bdate" type="date" autoComplete="bday"
                          value={form.birthdate} onChange={e=>updateForm('birthdate',e.target.value)} onBlur={()=>touchField('birthdate')}
                          max={new Date().toISOString().split('T')[0]} required aria-required="true"
                          aria-invalid={!!getErr('birthdate')} aria-describedby={getErr('birthdate')?'sc-bdate-err':undefined}
                          className={`sc-input${getErr('birthdate')?' error':''}`}
                          style={{ width:'100%', background:C.bg, border:`1.5px solid ${getErr('birthdate')?C.error:C.border}`, borderRadius:9, padding:'11px 14px', fontSize:14, color:C.text, outline:'none', transition:'border-color 150ms ease' }}
                        />
                        {getErr('birthdate') && <p id="sc-bdate-err" role="alert" style={{fontSize:12,color:C.error,marginTop:4}}>{getErr('birthdate')}</p>}
                      </div>

                      {/* CPF */}
                      <div>
                        <label htmlFor="sc-cpf" style={{ display:'block', fontSize:12, fontWeight:600, color:C.textMid, marginBottom:6 }}>
                          CPF <span style={{color:C.error}}>*</span>
                        </label>
                        <input id="sc-cpf" type="text" autoComplete="off" inputMode="numeric"
                          value={form.cpf}
                          onChange={e=>updateForm('cpf', formatCPF(e.target.value))}
                          onBlur={()=>touchField('cpf')}
                          maxLength={14} required aria-required="true"
                          aria-invalid={!!getErr('cpf')} aria-describedby={getErr('cpf')?'sc-cpf-err':undefined}
                          className={`sc-input${getErr('cpf')?' error':''}`}
                          style={{ width:'100%', background:C.bg, border:`1.5px solid ${getErr('cpf')?C.error:C.border}`, borderRadius:9, padding:'11px 14px', fontSize:14, color:C.text, outline:'none', fontFamily:'var(--font-mono, monospace)', transition:'border-color 150ms ease' }}
                          placeholder="000.000.000-00"
                        />
                        {getErr('cpf') && <p id="sc-cpf-err" role="alert" style={{fontSize:12,color:C.error,marginTop:4}}>{getErr('cpf')}</p>}
                      </div>

                      {/* Phone */}
                      <div>
                        <label htmlFor="sc-phone" style={{ display:'block', fontSize:12, fontWeight:600, color:C.textMid, marginBottom:6 }}>
                          WhatsApp / Celular <span style={{color:C.error}}>*</span>
                        </label>
                        <input id="sc-phone" type="tel" autoComplete="tel" inputMode="numeric"
                          value={form.phone}
                          onChange={e=>updateForm('phone', formatPhone(e.target.value))}
                          onBlur={()=>touchField('phone')}
                          maxLength={15} required aria-required="true"
                          aria-invalid={!!getErr('phone')} aria-describedby={getErr('phone')?'sc-phone-err':undefined}
                          className={`sc-input${getErr('phone')?' error':''}`}
                          style={{ width:'100%', background:C.bg, border:`1.5px solid ${getErr('phone')?C.error:C.border}`, borderRadius:9, padding:'11px 14px', fontSize:14, color:C.text, outline:'none', fontFamily:'var(--font-mono, monospace)', transition:'border-color 150ms ease' }}
                          placeholder="(85) 99999-9999"
                        />
                        {getErr('phone') && <p id="sc-phone-err" role="alert" style={{fontSize:12,color:C.error,marginTop:4}}>{getErr('phone')}</p>}
                      </div>

                      {/* Email */}
                      <div style={{ gridColumn:'1 / -1' }}>
                        <label htmlFor="sc-email" style={{ display:'block', fontSize:12, fontWeight:600, color:C.textMid, marginBottom:6 }}>
                          E-mail <span style={{color:C.error}}>*</span>
                        </label>
                        <input id="sc-email" type="email" autoComplete="email"
                          value={form.email} onChange={e=>updateForm('email',e.target.value.replace(/[\x00-\x1F\x7F]/g,'').slice(0,254))}
                          onBlur={()=>touchField('email')}
                          maxLength={254} required aria-required="true"
                          aria-invalid={!!getErr('email')} aria-describedby={getErr('email')?'sc-email-err':undefined}
                          className={`sc-input${getErr('email')?' error':''}`}
                          style={{ width:'100%', background:C.bg, border:`1.5px solid ${getErr('email')?C.error:C.border}`, borderRadius:9, padding:'11px 14px', fontSize:14, color:C.text, outline:'none', transition:'border-color 150ms ease' }}
                          placeholder="voce@email.com"
                        />
                        {getErr('email') && <p id="sc-email-err" role="alert" style={{fontSize:12,color:C.error,marginTop:4}}>{getErr('email')}</p>}
                      </div>

                      {/* Health Plan */}
                      <div>
                        <label htmlFor="sc-plan" style={{ display:'block', fontSize:12, fontWeight:600, color:C.textMid, marginBottom:6 }}>
                          Plano de saúde
                        </label>
                        <select id="sc-plan"
                          value={form.healthPlan} onChange={e=>updateForm('healthPlan',e.target.value)}
                          className="sc-input"
                          style={{ width:'100%', background:C.bg, border:`1.5px solid ${C.border}`, borderRadius:9, padding:'11px 14px', fontSize:14, color: form.healthPlan ? C.text : C.textMuted, outline:'none', appearance:'none', cursor:'pointer' }}>
                          <option value="">Selecione…</option>
                          {HEALTH_PLANS.map(p=><option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>

                      {/* First visit */}
                      <div style={{ display:'flex', alignItems:'center' }}>
                        <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', userSelect:'none' }}>
                          <div
                            onClick={() => updateForm('firstVisit', !form.firstVisit)}
                            role="checkbox" aria-checked={form.firstVisit} tabIndex={0}
                            onKeyDown={e=>{ if(e.key===' '||e.key==='Enter') updateForm('firstVisit',!form.firstVisit) }}
                            style={{
                              width:20, height:20, borderRadius:5, flexShrink:0,
                              background: form.firstVisit ? C.primary : C.bgCard,
                              border:`1.5px solid ${form.firstVisit ? C.primary : C.border}`,
                              display:'flex', alignItems:'center', justifyContent:'center',
                              transition:'all 150ms ease', cursor:'pointer',
                            }}>
                            {form.firstVisit && <span style={{color:'#fff',fontSize:13,fontWeight:700}}>✓</span>}
                          </div>
                          <span style={{ fontSize:13, color:C.textMid }}>Primeira consulta nesta clínica</span>
                        </label>
                      </div>

                      {/* Notes */}
                      <div style={{ gridColumn:'1 / -1' }}>
                        <label htmlFor="sc-notes" style={{ display:'block', fontSize:12, fontWeight:600, color:C.textMid, marginBottom:6 }}>
                          Motivo da consulta / observações <span style={{fontSize:11,color:C.textMuted,fontWeight:400}}>(opcional)</span>
                        </label>
                        <textarea id="sc-notes" rows={3}
                          value={form.notes} onChange={e=>updateForm('notes',e.target.value.slice(0,500))}
                          maxLength={500} aria-describedby="sc-notes-hint"
                          className="sc-input"
                          style={{ width:'100%', background:C.bg, border:`1.5px solid ${C.border}`, borderRadius:9, padding:'11px 14px', fontSize:14, color:C.text, outline:'none', resize:'vertical', lineHeight:1.6, fontFamily:'inherit' }}
                          placeholder="Descreva brevemente o motivo da consulta, sintomas ou exames que trouxerá…"
                        />
                        <p id="sc-notes-hint" style={{fontSize:11,color:C.textMuted,marginTop:3}}>
                          {form.notes.length}/500 caracteres — estas informações ajudam o médico a se preparar para a consulta
                        </p>
                      </div>
                    </div>

                    {/* LGPD - Dados de saúde (categoria especial) */}
                    <div style={{ marginTop:24, padding:'18px 20px', background:'rgba(10,92,70,0.04)', border:`1px solid ${C.primaryLt}`, borderRadius:12 }}>
                      <p style={{ fontSize:12, fontWeight:700, color:C.primary, marginBottom:12, display:'flex', alignItems:'center', gap:6 }}>
                        <span aria-hidden="true">🔒</span> Privacidade e proteção de dados (LGPD)
                      </p>

                      {/* Consent 1 */}
                      <label style={{ display:'flex', alignItems:'flex-start', gap:10, cursor:'pointer', marginBottom:12 }}>
                        <div onClick={()=>{updateForm('consent',!form.consent);touchField('consent')}}
                          role="checkbox" aria-checked={form.consent}
                          aria-required="true" aria-invalid={!!getErr('consent')}
                          tabIndex={0} onKeyDown={e=>{if(e.key===' '||e.key==='Enter'){updateForm('consent',!form.consent);touchField('consent')}}}
                          style={{ width:18, height:18, borderRadius:4, flexShrink:0, marginTop:1,
                            background:form.consent?C.primary:C.bgCard, border:`1.5px solid ${getErr('consent')?C.error:form.consent?C.primary:C.border}`,
                            display:'flex', alignItems:'center', justifyContent:'center', transition:'all 150ms ease', cursor:'pointer' }}>
                          {form.consent&&<span style={{color:'#fff',fontSize:11,fontWeight:700}}>✓</span>}
                        </div>
                        <span style={{fontSize:12,color:C.textMid,lineHeight:1.6}}>
                          Confirmo que os dados informados são verídicos e autorizo a Clínica Serena a utilizá-los para o agendamento e atendimento médico solicitado. <span style={{color:C.error}}>*</span>
                        </span>
                      </label>
                      {getErr('consent') && <p role="alert" style={{fontSize:12,color:C.error,marginBottom:10,marginLeft:28}}>{getErr('consent')}</p>}

                      {/* LGPD Consent 2 - dados de saúde (Art. 11) */}
                      <label style={{ display:'flex', alignItems:'flex-start', gap:10, cursor:'pointer' }}>
                        <div onClick={()=>{updateForm('lgpdConsent',!form.lgpdConsent);touchField('lgpdConsent')}}
                          role="checkbox" aria-checked={form.lgpdConsent}
                          aria-required="true" aria-invalid={!!getErr('lgpdConsent')}
                          aria-describedby="sc-lgpd-desc"
                          tabIndex={0} onKeyDown={e=>{if(e.key===' '||e.key==='Enter'){updateForm('lgpdConsent',!form.lgpdConsent);touchField('lgpdConsent')}}}
                          style={{ width:18, height:18, borderRadius:4, flexShrink:0, marginTop:1,
                            background:form.lgpdConsent?C.primary:C.bgCard, border:`1.5px solid ${getErr('lgpdConsent')?C.error:form.lgpdConsent?C.primary:C.border}`,
                            display:'flex', alignItems:'center', justifyContent:'center', transition:'all 150ms ease', cursor:'pointer' }}>
                          {form.lgpdConsent&&<span style={{color:'#fff',fontSize:11,fontWeight:700}}>✓</span>}
                        </div>
                        <span id="sc-lgpd-desc" style={{fontSize:12,color:C.textMid,lineHeight:1.6}}>
                          <strong style={{color:C.text}}>Consentimento para dados de saúde (LGPD Art. 11, I):</strong>{' '}
                          Autorizo o tratamento dos meus dados pessoais de saúde pela Clínica Serena exclusivamente para fins de agendamento e prestação de cuidados médicos.
                          Sei que posso revogar este consentimento a qualquer momento pelo e-mail{' '}
                          <a href="mailto:privacidade@clinicaserena.com.br" style={{color:C.primary}}>privacidade@clinicaserena.com.br</a>. <span style={{color:C.error}}>*</span>
                        </span>
                      </label>
                      {getErr('lgpdConsent') && <p role="alert" style={{fontSize:12,color:C.error,marginTop:8,marginLeft:28}}>{getErr('lgpdConsent')}</p>}

                      <p style={{fontSize:11,color:C.textMuted,marginTop:12,lineHeight:1.6}}>
                        Seus dados são armazenados com criptografia AES-256, acessados apenas pela equipe médica autorizada e nunca compartilhados com terceiros para fins comerciais.
                        Consulte nossa <a href="#privacidade" style={{color:C.primary}}>Política de Privacidade</a>.
                      </p>
                    </div>

                    {/* Submit */}
                    <div style={{ marginTop:28, display:'flex', justifyContent:'flex-end' }}>
                      <button type="submit" disabled={submitting}
                        aria-busy={submitting}
                        style={{
                          background: C.primary, color:'#fff', border:'none', borderRadius:9,
                          padding:'13px 32px', fontSize:14, fontWeight:700,
                          cursor: submitting ? 'wait' : 'pointer',
                          display:'flex', alignItems:'center', gap:8,
                          transition:'background 150ms ease',
                          opacity: submitting ? 0.85 : 1,
                        }}
                        onMouseEnter={e=>{ if(!submitting) e.currentTarget.style.background=C.primaryMid }}
                        onMouseLeave={e=>e.currentTarget.style.background=C.primary}>
                        {submitting ? (
                          <>
                            <span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'scSpin 600ms linear infinite', display:'inline-block' }} aria-hidden="true"/>
                            Confirmando agendamento…
                          </>
                        ) : 'Confirmar agendamento →'}
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 5: Confirm summary */}
                {step === 'confirm' && (
                  <div>
                    <button onClick={() => setStep('form')}
                      style={{ background:'none', border:'none', cursor:'pointer', color:C.textMuted, fontSize:13, marginBottom:20 }}>
                      ← Voltar e editar
                    </button>
                    <h3 style={{ fontFamily:'var(--font-syne, sans-serif)', fontSize:18, fontWeight:700, color:C.text, marginBottom:20 }}>
                      Confirme o agendamento
                    </h3>
                    {/* Summary handled inline in form submit */}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Depoimentos ───────────────────────────────────────────────────── */}
      <section id="depoimentos" aria-labelledby="dep-h2"
        style={{ padding:'80px 24px', background:C.bgCard }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:C.primary, marginBottom:12 }}>Depoimentos</p>
            <h2 id="dep-h2"
              style={{ fontFamily:'var(--font-syne, sans-serif)', fontSize:'clamp(1.6rem,3vw,2.4rem)', fontWeight:700, color:C.text }}>
              O que nossos pacientes dizem
            </h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }} className="sc-test-grid">
            <style>{`@media(max-width:768px){ .sc-test-grid{ grid-template-columns:1fr !important } }`}</style>
            {TESTIMONIALS.map(t => (
              <figure key={t.name}
                className="sc-card-hover"
                style={{ background:C.bg, border:`1px solid ${C.borderLight}`, borderRadius:16, padding:28, margin:0 }}>
                <div style={{ display:'flex', gap:2, marginBottom:14 }} aria-label={`${t.stars} de 5 estrelas`}>
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} width="16" height="16" viewBox="0 0 12 12" aria-hidden="true">
                      <path d="M6 1l1.3 2.9H10L7.8 5.7l.9 3L6 7.3 3.3 8.7l.9-3L2 3.9h2.7z"
                        fill={s <= t.stars ? C.accent : C.border}/>
                    </svg>
                  ))}
                </div>
                <blockquote style={{ fontSize:14, color:C.textMid, lineHeight:1.75, margin:'0 0 20px', fontStyle:'italic' }}>
                  "{t.quote}"
                </blockquote>
                <figcaption>
                  <p style={{ fontSize:13, fontWeight:700, color:C.text }}>{t.name}</p>
                  <p style={{ fontSize:11, color:C.primary, fontWeight:500, marginTop:2 }}>{t.specialty}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer role="contentinfo" id="privacidade"
        style={{ background:C.primary, padding:'56px 24px 32px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:40, marginBottom:40 }} className="sc-footer-grid">
            <style>{`@media(max-width:900px){ .sc-footer-grid{ grid-template-columns:1fr 1fr !important } } @media(max-width:580px){ .sc-footer-grid{ grid-template-columns:1fr !important } }`}</style>

            <div>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, color:'#fff' }} aria-hidden="true">+</div>
                <p style={{ fontFamily:'var(--font-syne, sans-serif)', fontWeight:700, fontSize:'1rem', color:'#fff' }}>Clínica Serena</p>
              </div>
              <p style={{ fontSize:13, color:'rgba(255,255,255,0.65)', lineHeight:1.75, marginBottom:16 }}>
                Medicina de excelência com atendimento humanizado.<br/>
                Cuidamos de você e da sua família com dedicação.
              </p>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {[
                  { icon:'📍', text:'Rua das Flores, 1450 — Meireles, Fortaleza, CE' },
                  { icon:'📞', text:'(85) 3210-9999' },
                  { icon:'✉️', text:'contato@clinicaserena.com.br' },
                  { icon:'🕐', text:'Seg–Sex 7h–20h · Sáb 8h–13h' },
                ].map(i => (
                  <p key={i.text} style={{ fontSize:12, color:'rgba(255,255,255,0.60)', display:'flex', gap:8, alignItems:'flex-start' }}>
                    <span aria-hidden="true">{i.icon}</span>{i.text}
                  </p>
                ))}
              </div>
            </div>

            {[
              { title:'Especialidades', links:['Cardiologia','Neurologia','Ortopedia','Oftalmologia','Dermatologia','Clínica Geral'] },
              { title:'Institucional',  links:['Sobre nós','Nossa equipe','Estrutura','Blog de saúde','Trabalhe conosco'] },
              { title:'Legal',          links:['Política de Privacidade','Termos de Uso','Cookies','LGPD — Seus direitos','CFM — Código de Ética'] },
            ].map(col => (
              <nav key={col.title} aria-label={col.title}>
                <p style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.85)', letterSpacing:'0.10em', textTransform:'uppercase', marginBottom:14 }}>{col.title}</p>
                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:8 }}>
                  {col.links.map(l => (
                    <li key={l}>
                      <a href="#" style={{ fontSize:13, color:'rgba(255,255,255,0.55)', textDecoration:'none', transition:'color 150ms ease' }}
                        onMouseEnter={e=>(e.currentTarget.style.color='rgba(255,255,255,0.90)')}
                        onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.55)')}>
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div style={{ borderTop:'1px solid rgba(255,255,255,0.12)', paddingTop:24, display:'flex', flexWrap:'wrap', justifyContent:'space-between', alignItems:'flex-start', gap:16 }}>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.45)' }}>
              © {new Date().getFullYear()} Clínica Serena Ltda. · CRM-CE registrado · Template por{' '}
              <a href="/" style={{ color:'rgba(255,255,255,0.65)', textDecoration:'underline' }}>CCP NEXATECH</a>
            </p>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              {['CFM','ANS','ANVISA'].map(b => (
                <span key={b} style={{ fontSize:10, color:'rgba(255,255,255,0.50)', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:4, padding:'3px 8px', letterSpacing:'0.08em' }}>{b}</span>
              ))}
            </div>
          </div>

          {/* LGPD disclosure */}
          <div style={{ marginTop:20, padding:'16px 20px', background:'rgba(0,0,0,0.15)', borderRadius:10 }}>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.45)', lineHeight:1.7 }}>
              <strong style={{color:'rgba(255,255,255,0.60)'}}>Proteção de dados de saúde (LGPD Art. 11):</strong>{' '}
              Os dados coletados neste site são tratados como dados sensíveis de saúde, na modalidade de consentimento explícito do titular (Art. 11, I).
              Utilizados exclusivamente para agendamento e prestação de serviços médicos. Armazenados com criptografia AES-256 em servidores no Brasil.
              Não compartilhados com terceiros para fins comerciais. Você pode exercer seus direitos (acesso, correção, exclusão, portabilidade) pelo e-mail{' '}
              <a href="mailto:privacidade@clinicaserena.com.br" style={{color:'rgba(255,255,255,0.65)',textDecoration:'underline'}}>
                privacidade@clinicaserena.com.br
              </a>
              {' '}conforme LGPD Art. 18. Encarregado de Dados (DPO): Dr. Paulo Mendes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}