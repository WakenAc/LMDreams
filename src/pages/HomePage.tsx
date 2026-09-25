import { SiteLayout } from '../components/layout/SiteLayout'
import { About } from '../sections/About'
import { CallToAction } from '../sections/CallToAction'
import { Contact } from '../sections/Contact'
import { Differentiators } from '../sections/Differentiators'
import { Hero } from '../sections/Hero'
import { Process } from '../sections/Process'
import { Projects } from '../sections/Projects'
import { Services } from '../sections/Services'
import { Testimonials } from '../sections/Testimonials'
import { Transparency } from '../sections/Transparency'

// Montagem da página principal (orquestrador). Ordem das secções: Anexo A e Parte 5.3.
export default function HomePage() {
  return (
    <SiteLayout>
      <Hero />
      <About />
      <Differentiators />
      <Services />
      <Process />
      <Projects />
      <Transparency />
      <Testimonials />
      <CallToAction />
      <Contact />
    </SiteLayout>
  )
}
