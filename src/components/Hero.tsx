import { useState, useEffect } from 'react';
import { FaArrowRight, FaPhone, FaCheckCircle, FaWhatsapp } from 'react-icons/fa';
import { AnimatedLogo } from './AnimatedLogo';

export function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-brand-900">
      {/* Background texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900/95 via-brand-800/90 to-brand-900/95 z-10" />
      <div
        className="absolute inset-0 opacity-[0.08] z-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg, transparent, transparent 40px,
              rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px
            ),
            repeating-linear-gradient(
              90deg, transparent, transparent 40px,
              rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px
            )
          `,
        }}
      />

      {/* Decorative architectural line */}
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold-500/30 to-transparent z-20 hidden lg:block" />

      <div className="container-wide relative z-20 w-full py-28 md:py-36">
        {/* Two-column layout on desktop */}
        <div className="grid lg:grid-cols-2 lg:gap-16 items-center">
          {/* LEFT COLUMN — Text content */}
          <div className="max-w-xl">
            {/* Trust badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-gold-500/20 text-gold-300 text-sm font-500 mb-8 transition-all duration-700 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <FaCheckCircle size={14} className="text-gold-400" />
              Mais de 20 anos de experiência
            </div>

            {/* Main heading */}
            <h1
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-heading text-white leading-[1.05] tracking-tight mb-6 transition-all duration-700 delay-150 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              A sua obra executada
              <br />
              <span className="text-gold-400">por especialistas.</span>
            </h1>

            {/* Subtitle */}
            <p
              className={`text-lg md:text-xl text-brand-300 leading-relaxed mb-10 transition-all duration-700 delay-300 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              Há mais de 20 anos a reunir os profissionais certos para cada etapa da construção,
              garantindo qualidade, rigor e transparência do início ao fim.
            </p>

            {/* CTA buttons */}
            <div
              className={`flex flex-wrap gap-4 mb-10 transition-all duration-700 delay-450 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <a href="#contactos" className="btn btn-primary text-base px-8 py-3.5 gap-2">
                Pedir orçamento
                <FaArrowRight size={14} />
              </a>
              <a href="#servicos" className="btn text-base px-8 py-3.5 gap-2 text-white border border-white/20 hover:bg-white/10 hover:border-accent-400 transition-all">
                Conhecer os serviços
              </a>
            </div>

            {/* Trust line */}
            <div
              className={`flex flex-wrap gap-x-6 gap-y-2 text-sm text-brand-400 transition-all duration-700 delay-600 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-gold-400" />
                Mais de 20 anos de experiência
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-gold-400" />
                Profissionais especializados
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-gold-400" />
                Acompanhamento transparente
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN — Animated logo */}
          <div
            className={`hidden lg:flex items-center justify-center transition-all duration-700 delay-300 ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <AnimatedLogo />
          </div>
        </div>
      </div>

      {/* Quick contact floating buttons */}
      <div
        className={`fixed bottom-6 right-6 z-40 flex-col gap-3 transition-all duration-700 delay-800 hidden md:flex ${
          loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <a
          href="tel:+351919233372"
          className="w-12 h-12 rounded-full bg-gold-500 text-white flex items-center justify-center shadow-lg hover:bg-gold-600 transition-all hover:scale-105"
          aria-label="Ligar para LMDreams"
        >
          <FaPhone size={18} />
        </a>
        <a
          href="https://wa.me/351919233372"
          target="_blank" rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-gold-500 text-white flex items-center justify-center shadow-lg hover:bg-gold-600 transition-all hover:scale-105"
          aria-label="Enviar WhatsApp para LMDreams"
        >
          <FaWhatsapp size={20} />
        </a>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />
    </section>
  );
}
