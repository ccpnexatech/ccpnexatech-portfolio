'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  /* Detecta scroll para mudar visual da navbar */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Fecha menu mobile ao pressionar Escape */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  /* Bloqueia scroll do body enquanto menu está aberto */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-nx-default',
        scrolled
          ? 'bg-navy/95 backdrop-blur-md border-b border-[rgba(255,255,255,0.06)] shadow-nx-lg'
          : 'bg-transparent',
      )}
    >
      <nav
        className="container-nx flex items-center justify-between h-16"
        aria-label="Navegação principal"
      >

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-nx-sm"
          aria-label={`${COMPANY.name} — página inicial`}
        >
          <LogoMark />
          <span className="font-syne font-[700] text-[1rem] tracking-[0.04em] text-[#E8EDF5]">
            CCP <span className="text-accent">NEXA</span>TECH
          </span>
        </Link>

        {/* Links — desktop */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-cta text-text-muted hover:text-[#E8EDF5] px-3 py-2 rounded-nx-sm transition-colors duration-nx-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA — desktop */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="#contato"
            className="inline-flex items-center gap-1.5 bg-accent text-white text-cta px-5 py-2.5 rounded-nx-sm font-[500] transition-all duration-nx-fast hover:scale-[1.02] hover:shadow-nx-accent active:scale-[0.98]"
          >
            Solicitar orçamento
          </Link>
        </div>

        {/* Botão hamburguer — mobile */}
        <button
          type="button"
          className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px] rounded-nx-sm text-[#E8EDF5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        >
          <span
            className={cn(
              'w-5 h-px bg-current transition-all duration-nx-default origin-center',
              open && 'translate-y-[6px] rotate-45',
            )}
          />
          <span
            className={cn(
              'w-5 h-px bg-current transition-all duration-nx-default',
              open && 'opacity-0 scale-x-0',
            )}
          />
          <span
            className={cn(
              'w-5 h-px bg-current transition-all duration-nx-default origin-center',
              open && '-translate-y-[6px] -rotate-45',
            )}
          />
        </button>

      </nav>

      {/* Menu mobile */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        className={cn(
          'md:hidden fixed inset-0 top-16 bg-navy/98 backdrop-blur-md transition-all duration-nx-smooth',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      >
        <nav className="container-nx py-8 flex flex-col gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-h4 font-[500] text-[#E8EDF5] px-4 py-3 rounded-nx-md hover:bg-[rgba(255,255,255,0.05)] transition-colors duration-nx-fast"
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.08)]">
            <Link
              href="#contato"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 bg-accent text-white text-cta px-6 py-3.5 rounded-nx-sm font-[500] w-full"
            >
              Solicitar orçamento →
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}

/* ── Logo mark inline ──────────────────────────────────────────────────────── */
function LogoMark() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <polygon
        points="80,8 148,44 148,116 80,152 12,116 12,44"
        stroke="#0066FF"
        strokeWidth="6"
        fill="rgba(0,102,255,0.08)"
      />
      <polygon
        points="80,28 128,54 128,106 80,132 32,106 32,54"
        stroke="#0066FF"
        strokeWidth="4"
        fill="rgba(0,102,255,0.14)"
      />
      <polygon points="80,52 104,80 80,108 56,80" fill="#0066FF" />
      <circle cx="80" cy="80" r="10" fill="white" />
    </svg>
  )
}