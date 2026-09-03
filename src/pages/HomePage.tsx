import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Hero } from "../sections/Hero";
import { About } from "../sections/About";
import { Differentiation } from "../sections/Differentiation";
import { Services } from "../sections/Services";
import { Process } from "../sections/Process";
import { Projects } from "../sections/Projects";
import { Transparency } from "../sections/Transparency";
import { Testimonials } from "../sections/Testimonials";
import { CtaBanner } from "../sections/CtaBanner";
import { Contact } from "../sections/Contact";

export function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      // Aguarda o layout renderizar antes de calcular a posição de scroll.
      requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth" }));
    }
  }, [location.hash]);

  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Differentiation />
        <Services />
        <Process />
        <Projects />
        <Transparency />
        <Testimonials />
        <CtaBanner />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
