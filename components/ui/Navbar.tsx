'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { COMPANY } from '@/lib/constants'

interface NavLink {
  label: string
  href: string
}

interface NavbarProps {
  links: readonly NavLink[]
}

export default function Navbar({ links }: NavbarProps) {
  const [scrolled, setScrolled]     = useState(false)
  const [open, setOpen]             = useState(false)
  const [activeLink, setActiveLink] = useState<string>('')
  const prefersReduced              = useReducedMotion()

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active section tracking via IntersectionObserver
  useEffect(() => {
    const sections = links.map(l => l.href.replace('#', ''))
    const observers: IntersectionObserver[] = []

    sections.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveLink(`#${id}`) },
        { rootMargin: '-40% 0px -50% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [links])

  // Close mobile menu on ESC
  useEffect(() => {
    if (!open) return
    const fn = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [open])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 bg-navy transition-all duration-300',
        scrolled && 'shadow-[0_1px_0_rgba(0,102,255,0.15),0_4px_24px_rgba(0,0,0,0.3)] backdrop-blur-md bg-navy/95'
      )}
    >
      {/* Accent line at bottom when scrolled */}
      <div
        className={cn(
          'absolute bottom-0 left-0 h-px transition-all duration-500',
          scrolled
            ? 'w-full bg-gradient-to-r from-transparent via-accent/40 to-transparent'
            : 'w-0'
        )}
        aria-hidden="true"
      />

      <nav
        className="container-nx flex items-center justify-between h-16"
        aria-label="Navegação principal"
      >
        {/* ── Logo ──────────────────────────────────────────────────── */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-nx-sm"
          aria-label={`${COMPANY.name} — página inicial`}
        >
          {/* Hexagonal mark */}
          <div className="relative w-8 h-8 flex-shrink-0">
            <svg
              width="32" height="32" viewBox="0 0 160 160"
              fill="none" xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="transition-transform duration-500 group-hover:rotate-[30deg]"
            >
              <polygon
                points="80,8 148,44 148,116 80,152 12,116 12,44"
                stroke="#0066FF" strokeWidth="6"
                fill="rgba(0,102,255,0.08)"
                className="transition-all duration-300 group-hover:fill-[rgba(0,102,255,0.15)]"
              />
              <polygon
                points="80,28 128,54 128,106 80,132 32,106 32,54"
                stroke="#0066FF" strokeWidth="4"
                fill="rgba(0,102,255,0.14)"
              />
              <polygon points="80,52 104,80 80,108 56,80" fill="#0066FF" />
              <circle cx="80" cy="80" r="10" fill="white" />
            </svg>
            {/* Glow on hover */}
            <div
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(0,102,255,0.3) 0%, transparent 70%)' }}
              aria-hidden="true"
            />
          </div>

          {/* Wordmark */}
          <span className="font-syne font-[700] text-[1rem] tracking-[0.04em] text-[#E8EDF5]">
            CCP{' '}
            <span className="text-accent">NEXA</span>
            TECH
          </span>
        </Link>

        {/* ── Desktop links ─────────────────────────────────────────── */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {links.map(link => {
            const isActive = activeLink === link.href
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'relative text-[13px] font-[500] px-3 py-2 rounded-nx-sm flex items-center gap-1.5',
                    'transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                    isActive ? 'text-[#E8EDF5]' : 'text-text-muted hover:text-[#E8EDF5]'
                  )}
                >
                  {link.label}
                  {/* Animated underline */}
                  <span
                    className={cn(
                      'absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-accent transition-all duration-300 rounded-full',
                      isActive ? 'w-4/5 opacity-100' : 'w-0 opacity-0 group-hover:w-4/5 group-hover:opacity-100'
                    )}
                    aria-hidden="true"
                  />
                </Link>
              </li>
            )
          })}
        </ul>

        {/* ── Desktop CTA ───────────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-3">
          {/* CNPJ badge */}
          <span className="font-mono text-[10px] text-text-muted/60 tracking-[0.06em] hidden lg:block select-none">
            CNPJ {COMPANY.cnpj}
          </span>

          <Link
            href="#contato"
            className={cn(
              'relative inline-flex items-center gap-2 overflow-hidden',
              'bg-accent text-white text-[13px] font-[600] px-5 py-[9px] rounded-nx-sm',
              'transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]',
              'shadow-[0_2px_12px_rgba(0,102,255,0.35)] hover:shadow-[0_4px_20px_rgba(0,102,255,0.55)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-navy'
            )}
          >
            {/* Shimmer effect */}
            <span
              className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
              aria-hidden="true"
            />
            <span>Solicitar orçamento</span>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        {/* ── Hamburger ─────────────────────────────────────────────── */}
        <button
          type="button"
          className={cn(
            'md:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px] rounded-nx-sm',
            'text-[#E8EDF5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
            'transition-colors duration-150'
          )}
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        >
          <span className={cn('w-5 h-px bg-current transition-all duration-300 origin-center', open && 'translate-y-[6px] rotate-45')} />
          <span className={cn('w-5 h-px bg-current transition-all duration-300', open && 'opacity-0 scale-x-0')} />
          <span className={cn('w-5 h-px bg-current transition-all duration-300 origin-center', open && '-translate-y-[6px] -rotate-45')} />
        </button>
      </nav>

      {/* ── Mobile menu ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden fixed inset-0 top-16 bg-navy/98 backdrop-blur-md border-t border-[rgba(0,102,255,0.15)]"
          >
            {/* Subtle grid bg */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(rgba(0,102,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,102,255,1) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
              aria-hidden="true"
            />

            <nav className="relative container-nx py-8 flex flex-col gap-1">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.05, ease: [0.4, 0, 0.2, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center justify-between text-[15px] font-[500] px-4 py-3.5 rounded-nx-md',
                      'transition-all duration-150 group',
                      activeLink === link.href
                        ? 'bg-[rgba(0,102,255,0.12)] text-[#E8EDF5]'
                        : 'text-text-muted hover:bg-[rgba(255,255,255,0.04)] hover:text-[#E8EDF5]'
                    )}
                  >
                    {link.label}
                    <svg
                      width="14" height="14" viewBox="0 0 16 16" fill="none"
                      className="opacity-30 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150"
                      aria-hidden="true"
                    >
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </motion.div>
              ))}

              <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)]">
                <Link
                  href="#contato"
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center justify-center gap-2',
                    'bg-accent text-white text-[14px] font-[600] px-6 py-4 rounded-nx-sm w-full',
                    'shadow-[0_2px_16px_rgba(0,102,255,0.4)]',
                    'transition-all duration-200 active:scale-[0.98]'
                  )}
                >
                  Solicitar orçamento
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <p className="text-center font-mono text-[10px] text-text-muted/50 mt-3 tracking-[0.06em]">
                  CNPJ {COMPANY.cnpj}
                </p>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}