import type { Metadata } from 'next'

// Sections — serão implementadas progressivamente
import Hero           from '@/components/sections/Hero'
import About          from '@/components/sections/About'
import Mission        from '@/components/sections/Mission'
import Services       from '@/components/sections/Services'
import ProjectLevels  from '@/components/sections/ProjectLevels'
import Portfolio      from '@/components/sections/Portfolio'
import Kanban         from '@/components/sections/Kanban'
import Pricing        from '@/components/sections/Pricing'
import Contact        from '@/components/sections/Contact'

export const metadata: Metadata = {
  title: 'CCP NEXATECH — Tecnologia que transforma negócios',
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Mission />
      <Services />
      <ProjectLevels />
      <Portfolio />
      <Kanban />
      <Pricing />
      <Contact />
    </>
  )
}
