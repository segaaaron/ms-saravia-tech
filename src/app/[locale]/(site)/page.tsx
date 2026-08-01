import dynamic from 'next/dynamic'
import Hero from '@/components/hero/Hero'
import Services from '@/components/sections/Services'
import StackMarquee from '@/components/sections/StackMarquee'
import FaqJsonLd from '@/components/seo/FaqJsonLd'

// Secciones bajo el pliegue: code-split con next/dynamic SIN ssr:false. El HTML se sigue
// renderizando en el servidor (indexable, SEO intacto) — solo se separa su chunk JS del
// bundle inicial de la ruta, que baja el First Load. Hero/Services/StackMarquee quedan en
// carga normal (above-the-fold; no diferir el LCP). No hay cambio visual: mismo SSR.
const AIShowcase = dynamic(() => import('@/components/sections/AIShowcase'))
const HoloDashboard = dynamic(() => import('@/components/sections/HoloDashboard'))
const Work = dynamic(() => import('@/components/sections/Work'))
const DemosShowcase = dynamic(() => import('@/components/sections/DemosShowcase'))
const EstimateCta = dynamic(() => import('@/components/sections/EstimateCta'))
const Process = dynamic(() => import('@/components/sections/Process'))
const About = dynamic(() => import('@/components/sections/About'))
const Faq = dynamic(() => import('@/components/sections/Faq'))
const Contact = dynamic(() => import('@/components/sections/Contact'))

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return (
    <>
      <FaqJsonLd locale={locale} />
      <Hero />
      <Services />
      <StackMarquee />
      <AIShowcase />
      <HoloDashboard />
      <Work />
      <DemosShowcase />
      <EstimateCta />
      <Process />
      <About />
      <Faq />
      <Contact />
    </>
  )
}
