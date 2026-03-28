import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PROJECTS_DATA } from '@/lib/projects-data'

/* ── generateStaticParams ──────────────────────────────────────────────────── */
export async function generateStaticParams() {
  return PROJECTS_DATA.map((p) => ({ slug: p.slug }))
}

/* ── generateMetadata ──────────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const project = PROJECTS_DATA.find((p) => p.slug === params.slug)
  if (!project) return {}
  return {
    title: project.title,
    description: project.seo.description,
    openGraph: {
      title:       project.title,
      description: project.seo.description,
      type:        'website',
    },
  }
}

/* ── Page ──────────────────────────────────────────────────────────────────── */
export default function ProjectPage({
  params,
}: {
  params: { slug: string }
}) {
  const project = PROJECTS_DATA.find((p) => p.slug === params.slug)
  if (!project) notFound()

  const { Component } = project

  return (
    <div className="min-h-screen">
      {/* Barra de contexto — "você está vendo um template" */}
      <div className="bg-navy border-b border-[rgba(255,255,255,0.08)] sticky top-16 z-40">
        <div className="container-nx py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Link
              href="/#portfolio"
              className="inline-flex items-center gap-1.5 text-caption text-text-muted hover:text-[#E8EDF5] transition-colors duration-nx-fast"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              Portfólio
            </Link>
            <span className="text-text-muted text-caption" aria-hidden="true">/</span>
            <span className="text-caption text-[#E8EDF5] font-[500] truncate max-w-[200px]">
              {project.title}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-[500] px-2 py-[2px] rounded-nx-full bg-[rgba(0,102,255,0.15)] text-accent-mid"
                >
                  {tag}
                </span>
              ))}
            </div>
            <a
              href={`mailto:ccpnexatech@gmail.com?subject=Quero esse template: ${project.title}`}
              className="inline-flex items-center gap-1.5 bg-accent text-white text-[11px] font-[500] px-3 py-1.5 rounded-nx-sm whitespace-nowrap hover:scale-[1.02] transition-transform duration-nx-fast"
            >
              Solicitar similar →
            </a>
          </div>
        </div>
      </div>

      {/* Template renderizado */}
      <Component />
    </div>
  )
}