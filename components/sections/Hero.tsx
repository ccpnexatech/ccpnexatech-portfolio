'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { COMPANY } from '@/lib/constants'

// ── Typing effect hook ────────────────────────────────────────────────────────
function useTyping(words: string[], speed = 80, pause = 2000) {
  const [text, setText]           = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [deleting, setDeleting]   = useState(false)
  const prefersReduced            = useReducedMotion()

  useEffect(() => {
    if (prefersReduced) { setText(words[0]); return }
    const current = words[wordIndex]
    const timeout = deleting
      ? setTimeout(() => {
          setText(prev => prev.slice(0, -1))
          if (text.length <= 1) { setDeleting(false); setWordIndex(i => (i + 1) % words.length) }
        }, speed / 2)
      : setTimeout(() => {
          setText(current.slice(0, text.length + 1))
          if (text.length === current.length) setTimeout(() => setDeleting(true), pause)
        }, speed)
    return () => clearTimeout(timeout)
  }, [text, deleting, wordIndex, words, speed, pause, prefersReduced])

  return text
}

// ── Floating badge ────────────────────────────────────────────────────────────
function FloatingBadge({
  children, delay = 0, className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const prefersReduced = useReducedMotion()
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.34, 1.56, 0.64, 1] }}
      className={className}
    >
      {/* Float animation via CSS instead of Framer — avoids non-composited issue */}
      <div style={{
        animation: prefersReduced ? 'none' : `heroFloat ${3 + delay}s ease-in-out infinite`,
      }}>
        {children}
      </div>
    </motion.div>
  )
}

export default function Hero() {
  const prefersReduced = useReducedMotion()
  const typedWord = useTyping(['negócios.', 'resultados.', 'crescimento.', 'conversões.'], 75, 2200)

  // ── Stats data ────────────────────────────────────────────────────────────
  const stats = [
    { value: `${COMPANY.yearsExperience}+`, label: 'anos de experiência' },
    { value: '100%',                         label: 'foco em resultado'  },
    { value: '3',                            label: 'níveis de projeto'  },
  ]

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-64px)] flex items-center overflow-hidden bg-navy"
      aria-labelledby="hero-headline"
    >
      {/* ── Background layers — pure CSS, zero JS ─────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(ellipse 60% 60% at 20% 40%, rgba(0,102,255,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 90% 80%, rgba(0,194,224,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(15,31,61,0.7) 100%)
          `,
        }}
      />

      {/* Dot-grid background — CSS only, no canvas */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(rgba(0,102,255,0.18) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          opacity: 0.35,
        }}
      />

      {/* ── Main content ──────────────────────────────────────────────── */}
      <div className="relative container-nx py-nx-16 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 items-center">

        {/* Left — text */}
        <div className="flex flex-col items-start">

          {/* Pre-headline badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-center gap-2.5 mb-8"
          >
            <div className="flex items-center gap-2 bg-[rgba(0,102,255,0.12)] border border-[rgba(0,102,255,0.25)] rounded-nx-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" aria-hidden="true" />
              <span className="text-[11px] font-[600] text-accent tracking-[0.12em] uppercase">
                CCP NEXATECH · CNPJ {COMPANY.cnpj}
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            id="hero-headline"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
            className="font-syne text-[clamp(2.4rem,5.5vw,4.5rem)] font-[700] leading-[1.06] tracking-[-0.02em] mb-6"
          >
            <span className="text-[#E8EDF5]">Tecnologia que</span>
            <br />
            <span className="text-[#E8EDF5]">transforma</span>
            <br />
            <span className="block h-[1.06em] relative">
              <span
                className="absolute left-0 top-0"
                style={{
                  background: 'linear-gradient(90deg, #0066FF, #00C2E0, #0066FF)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: prefersReduced ? 'none' : 'gradientShift 4s linear infinite',
                }}
                aria-label={typedWord}
              >
                {typedWord}
                <span
                  className="inline-block w-[3px] h-[0.8em] bg-accent ml-1 align-middle"
                  style={{ animation: prefersReduced ? 'none' : 'cursorBlink 1s step-end infinite' }}
                  aria-hidden="true"
                />
              </span>
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="text-body-lg text-text-muted max-w-[520px] leading-relaxed mb-10"
          >
            Sites, landing pages e sistemas web de alto impacto para empresários que
            querem crescer com tecnologia real —{' '}
            <strong className="text-[#c8d0e0] font-[500]">rápida, segura e estratégica.</strong>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-wrap gap-3 mb-12"
          >
            <a
              href="#contato"
              className="group relative inline-flex items-center gap-2 overflow-hidden bg-accent text-white text-[14px] font-[600] px-7 py-3.5 rounded-nx-sm shadow-nx-accent transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_6px_28px_rgba(0,102,255,0.55)] active:scale-[0.97]"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12" aria-hidden="true" />
              Solicitar orçamento
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>

            <a
              href="#portfolio"
              className="group inline-flex items-center gap-2 border border-[rgba(255,255,255,0.14)] text-[#c8d0e0] text-[14px] font-[500] px-7 py-3.5 rounded-nx-sm transition-all duration-200 hover:border-[rgba(255,255,255,0.28)] hover:text-[#E8EDF5] hover:bg-[rgba(255,255,255,0.04)] active:scale-[0.97]"
            >
              Ver portfólio
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-y-0.5">
                <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center gap-6"
          >
            {stats.map((s, i) => (
              <div key={s.label} className="flex items-center gap-3">
                {i > 0 && <div className="w-px h-8 bg-[rgba(255,255,255,0.08)]" aria-hidden="true" />}
                <div>
                  <p className="font-syne text-[1.4rem] font-[700] text-[#E8EDF5] leading-none mb-0.5">{s.value}</p>
                  <p className="text-[11px] text-text-muted uppercase tracking-[0.08em]">{s.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — visual / floating badges */}
        <div className="hidden lg:flex items-center justify-center relative h-[420px]">
          {/* Central logo mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative"
          >
            {/* Rotating rings — CSS transform only (composited) */}
            <div
              className="absolute inset-[-40px] rounded-full border border-[rgba(0,102,255,0.08)]"
              style={{ animation: prefersReduced ? 'none' : 'spinSlow 60s linear infinite' }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-[-20px] rounded-full border border-[rgba(0,194,224,0.06)]"
              style={{ animation: prefersReduced ? 'none' : 'spinSlow 40s linear infinite reverse' }}
              aria-hidden="true"
            />
            <svg
              width="200" height="200" viewBox="0 0 160 160"
              fill="none" xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <polygon points="80,8 148,44 148,116 80,152 12,116 12,44" stroke="#0066FF" strokeWidth="1.5" fill="rgba(0,102,255,0.08)" />
              <polygon points="80,28 128,54 128,106 80,132 32,106 32,54" stroke="#0066FF" strokeWidth="1" fill="rgba(0,102,255,0.14)" />
              <polygon points="80,52 104,80 80,108 56,80" fill="#0066FF" />
              <circle cx="80" cy="80" r="4" fill="white" />
              <circle cx="80" cy="80" r="36" stroke="#0066FF" strokeWidth="0.5" strokeDasharray="3 3" fill="none" opacity="0.4" />
            </svg>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(0,102,255,0.2) 0%, transparent 70%)', filter: 'blur(20px)' }}
              aria-hidden="true"
            />
          </motion.div>

          {/* Floating tech badges */}
          <FloatingBadge delay={0.5} className="absolute top-4 right-8">
            <div className="flex items-center gap-2 bg-[rgba(15,31,61,0.9)] border border-[rgba(0,102,255,0.20)] rounded-nx-md px-3 py-2 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-accent" aria-hidden="true" />
              <span className="text-[11px] font-[600] text-[#E8EDF5]">Next.js 14</span>
            </div>
          </FloatingBadge>

          <FloatingBadge delay={0.7} className="absolute top-1/3 right-2">
            <div className="flex items-center gap-2 bg-[rgba(15,31,61,0.9)] border border-[rgba(0,194,224,0.20)] rounded-nx-md px-3 py-2 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-cyan" aria-hidden="true" />
              <span className="text-[11px] font-[600] text-[#E8EDF5]">TailwindCSS</span>
            </div>
          </FloatingBadge>

          <FloatingBadge delay={0.9} className="absolute bottom-1/4 right-10">
            <div className="flex items-center gap-2 bg-[rgba(15,31,61,0.9)] border border-[rgba(240,165,0,0.20)] rounded-nx-md px-3 py-2 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-gold" aria-hidden="true" />
              <span className="text-[11px] font-[600] text-[#E8EDF5]">Framer Motion</span>
            </div>
          </FloatingBadge>

          <FloatingBadge delay={0.6} className="absolute top-8 left-4">
            <div className="flex items-center gap-2 bg-[rgba(15,31,61,0.9)] border border-[rgba(255,255,255,0.08)] rounded-nx-md px-3 py-2 backdrop-blur-sm">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M13 3L8 13 3 8" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[11px] font-[600] text-[#E8EDF5]">TypeScript strict</span>
            </div>
          </FloatingBadge>

          <FloatingBadge delay={1.1} className="absolute bottom-12 left-2">
            <div className="flex items-center gap-2 bg-[rgba(15,31,61,0.9)] border border-[rgba(255,255,255,0.08)] rounded-nx-md px-3 py-2 backdrop-blur-sm">
              <span className="text-[11px]" aria-hidden="true">▲</span>
              <span className="text-[11px] font-[600] text-[#E8EDF5]">Vercel deploy</span>
            </div>
          </FloatingBadge>

          {/* Lighthouse score badge */}
          <FloatingBadge delay={1.3} className="absolute bottom-4 right-4">
            <div className="flex items-center gap-2.5 bg-[rgba(15,31,61,0.9)] border border-[rgba(34,197,94,0.25)] rounded-nx-md px-3 py-2 backdrop-blur-sm">
              <div className="w-5 h-5 rounded-full bg-[rgba(34,197,94,0.15)] flex items-center justify-center" aria-hidden="true">
                <span className="text-[9px] font-[700] text-[#22c55e]">✓</span>
              </div>
              <div>
                <p className="text-[9px] text-text-muted leading-none mb-0.5">Lighthouse</p>
                <p className="text-[11px] font-[700] text-[#22c55e] leading-none">90+ score</p>
              </div>
            </div>
          </FloatingBadge>
        </div>
      </div>

      {/* ── Scroll indicator ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="text-[10px] text-text-muted uppercase tracking-[0.14em]">scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-text-muted/40 to-transparent relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full bg-accent"
            style={{
              height: '40%',
              animation: prefersReduced ? 'none' : 'scrollDot 1.5s ease-in-out infinite',
            }}
          />
        </div>
      </motion.div>

      {/* ── Global keyframes ──────────────────────────────────────────────── */}
      <style>{`
        @keyframes gradientShift {
          0%   { background-position: 0% 50% }
          50%  { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1 }
          50%       { opacity: 0 }
        }
        @keyframes spinSlow {
          to { transform: rotate(360deg) }
        }
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px) }
          50%       { transform: translateY(-6px) }
        }
        @keyframes scrollDot {
          0%   { transform: translateY(-100%) }
          100% { transform: translateY(300%) }
        }
      `}</style>
    </section>
  )
}