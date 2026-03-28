import type { MetadataRoute } from 'next'
import { COMPANY } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: COMPANY.url,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${COMPANY.url}/projects/landing-saas`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${COMPANY.url}/projects/ecommerce`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${COMPANY.url}/projects/dashboard-admin`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${COMPANY.url}/projects/site-clinica`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${COMPANY.url}/privacidade`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${COMPANY.url}/termos`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}