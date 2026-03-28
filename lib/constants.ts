export const COMPANY = {
  name:     'CCP NEXATECH',
  cnpj:     '59.691.989/0001-70',
  tagline:  'Tecnologia que transforma negócios',
  city:     'Fortaleza',
  state:    'CE',
  country:  'Brasil',
  url:      'https://ccpnexatech-portfolio.vercel.app',
  email:    'ccpnexatech@gmail.com',
  yearsMarket:     1,
  yearsExperience: 5,
  googleSearch: 'MId5NRT_p2Enk4im6BPXj2kWhQaBKYuDf5dsREb5g3s',
} as const

export const NAV_LINKS = [
  { label: 'Sobre',    href: '#sobre' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Portfólio',href: '#portfolio' },
  { label: 'Preços',   href: '#precos' },
  { label: 'Contato',  href: '#contato' },
] as const

export const SERVICES = [
  {
    id: 'landing-page',
    title: 'Landing Page',
    description: 'Páginas de alta conversão para captar leads e vender mais.',
    icon: 'layout',
    badge: 'blue' as const,
  },
  {
    id: 'institutional',
    title: 'Site Institucional',
    description: 'Presença digital profissional com SEO local e nacional.',
    icon: 'globe',
    badge: 'cyan' as const,
  },
  {
    id: 'web-app',
    title: 'Aplicação Web',
    description: 'Sistemas e dashboards que automatizam e escalam o seu negócio.',
    icon: 'monitor',
    badge: 'cyan' as const,
  },
  {
    id: 'ecommerce',
    title: 'E-commerce',
    description: 'Lojas virtuais rápidas, seguras e otimizadas para conversão.',
    icon: 'shopping-bag',
    badge: 'gold' as const,
  },
] as const

export const PROJECT_LEVELS = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Ideal para negócios que precisam de presença digital rápida.',
    deliveryDays: 7,
    badge: 'gray' as const,
    features: [
      'Landing page ou site institucional',
      'Até 5 seções',
      'Formulário de contato',
      'SEO básico',
      'Deploy em Vercel',
      'Suporte 30 dias',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Para negócios que querem performance, SEO avançado e identidade forte.',
    deliveryDays: 14,
    badge: 'blue' as const,
    featured: true,
    features: [
      'Tudo do Basic',
      'Até 10 seções + animações',
      'SEO completo + JSON-LD',
      'Integração de analytics',
      'Dark mode',
      'Suporte 60 dias',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Sistemas completos e aplicações customizadas para escalar.',
    deliveryDays: 30,
    badge: 'gold' as const,
    features: [
      'Tudo do Pro',
      'Sistema web / dashboard',
      'Autenticação e painel admin',
      'Integrações via API',
      'CI/CD configurado',
      'Suporte 90 dias',
    ],
  },
] as const
