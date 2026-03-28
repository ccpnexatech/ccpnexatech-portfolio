import LandingSaaS    from '@/templates/landing-saas/LandingSaaS'
import SiteClinica    from '@/templates/site-clinica/SiteClinica'
import Ecommerce      from '@/templates/ecommerce/Ecommerce'
import DashboardAdmin from '@/templates/dashboard-admin/DashboardAdmin'

export interface ProjectMeta {
  slug:      string
  title:     string
  tags:      string[]
  seo:       { description: string }
  Component: React.ComponentType
}

export const PROJECTS_DATA: ProjectMeta[] = [
  {
    slug:  'landing-saas',
    title: 'FlowDesk — Landing SaaS',
    tags:  ['Landing Page', 'SaaS', 'Next.js', 'Framer Motion'],
    seo:   { description: 'Template de landing page SaaS com hero animado, features, pricing e lista de espera. Construído com Next.js e TailwindCSS.' },
    Component: LandingSaaS,
  },
  {
    slug:  'site-clinica',
    title: 'Clínica Serena — Site Saúde',
    tags:  ['Institucional', 'Saúde', 'SEO Local', 'Next.js'],
    seo:   { description: 'Template de site institucional para clínica de saúde com agendamento, equipe médica e SEO local para Fortaleza.' },
    Component: SiteClinica,
  },
  {
    slug:  'ecommerce',
    title: 'Áurea Store — E-commerce',
    tags:  ['E-commerce', 'Moda', 'Stripe', 'Next.js'],
    seo:   { description: 'Template de loja virtual completa com catálogo, carrinho e checkout. Integração com Stripe e painel admin.' },
    Component: Ecommerce,
  },
  {
    slug:  'dashboard-admin',
    title: 'NexPanel — Dashboard Admin',
    tags:  ['Dashboard', 'Admin', 'NextAuth', 'Recharts'],
    seo:   { description: 'Template de sistema administrativo com autenticação, gráficos de métricas e gestão de usuários.' },
    Component: DashboardAdmin,
  },
]