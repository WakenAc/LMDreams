import { useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Differentiation } from './components/Differentiation';
import { Services } from './components/Services';
import { WorkMethod } from './components/WorkMethod';
import { Portfolio } from './components/Portfolio';
import { Transparency } from './components/Transparency';
import { Testimonials } from './components/Testimonials';
import { CtaSection } from './components/CtaSection';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

function App() {
  // Smooth scroll for anchor links
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const el = document.querySelector(href);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Differentiation />
        <Services />
        <WorkMethod />
        <Portfolio />
        <Transparency />
        <Testimonials />
        <CtaSection />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
