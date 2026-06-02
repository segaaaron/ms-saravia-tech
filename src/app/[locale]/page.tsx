import Hero from '@/components/hero/Hero'
import Services from '@/components/sections/Services'
import StackMarquee from '@/components/sections/StackMarquee'
import AIShowcase from '@/components/sections/AIShowcase'
import HoloDashboard from '@/components/sections/HoloDashboard'
import Work from '@/components/sections/Work'
import Process from '@/components/sections/Process'
import About from '@/components/sections/About'
import Contact from '@/components/sections/Contact'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <StackMarquee />
      <AIShowcase />
      <HoloDashboard />
      <Work />
      <Process />
      <About />
      <Contact />
    </>
  )
}
