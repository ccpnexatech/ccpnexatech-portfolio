import type { Metadata } from 'next'

import Hero           from '@/components/sections/Hero'
import About          from '@/components/sections/About'
import Mission        from '@/components/sections/Mission'
import Services       from '@/components/sections/Services'
import ProjectLevels  from '@/components/sections/ProjectLevels'
import Portfolio      from '@/components/sections/Portfolio'
import Kanban         from '@/components/sections/Kanban'
import Pricing        from '@/components/sections/Pricing'
import Contact        from '@/components/sections/Contact'

// Usa o template definido no layout: "Tecnologia que transforma negócios | CCP NEXATECH"
export const metadata: Metadata = {
  title: 'Tecnologia que transforma negócios',
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