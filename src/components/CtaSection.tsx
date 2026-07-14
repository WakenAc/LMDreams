import { useInView } from '../hooks/useInView';
import { FaArrowRight, FaPhone, FaWhatsapp } from 'react-icons/fa';

export function CtaSection() {
  const { ref, isVisible } = useInView({ threshold: 0.2 });

  return (
    <section className="section-padding bg-brand-900" ref={ref}>
      <div className="container-wide text-center">
        <div
          className={`max-w-2xl mx-auto transition-all duration-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transition: 'opacity 0.6s ease, transform 0.6s ease' }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading text-white mb-6">
            Tem uma obra ou remodelação
            <br />
            <span className="text-gold-400">em mente?</span>
          </h2>
          <p className="text-lg text-brand-300 leading-relaxed mb-10 max-w-xl mx-auto">
            Fale connosco sobre o seu projeto. Analisamos as suas necessidades e apresentamos
            uma solução clara, adequada e executada pelos profissionais certos.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#contactos"
              className="btn btn-primary text-base px-8 py-3.5 gap-2"
            >
              Pedir orçamento
              <FaArrowRight size={14} />
            </a>
            <a
              href="tel:+351919233372"
              className="btn text-base px-8 py-3.5 gap-2 text-white border border-white/20 hover:bg-white/10 hover:border-accent-400 transition-all"
            >
              <FaPhone size={14} />
              Contactar por telefone
            </a>
            <a
              href="https://wa.me/351919233372"
              target="_blank"
              rel="noopener noreferrer"
              className="btn text-base px-8 py-3.5 gap-2 text-white border border-white/20 hover:bg-white/10 hover:border-accent-400 transition-all"
            >
              <FaWhatsapp size={16} />
              Falar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
