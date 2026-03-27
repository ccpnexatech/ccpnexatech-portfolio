import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://ccpnexatech.com.br'

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    // Projetos template — adicionar conforme forem publicados
    // { url: `${base}/projects/landing-saas`, ... },
  ]
}
