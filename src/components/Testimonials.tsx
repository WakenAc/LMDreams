import { useInView } from '../hooks/useInView';
import { FaQuoteLeft, FaStar, FaUser } from 'react-icons/fa';

const PLACEHOLDER_TESTIMONIALS = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
];

export function Testimonials() {
  const { ref, isVisible } = useInView({ threshold: 0.1 });

  return (
    <section className="section-padding bg-stone-50" ref={ref}>
      <div className="container-wide">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <span className="section-label">Testemunhos</span>
          <h2
            className={`text-3xl md:text-4xl lg:text-5xl font-heading text-brand-900 mb-6 transition-all duration-600 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transition: 'opacity 0.6s ease, transform 0.6s ease' }}
          >
            O que os nossos clientes
            <br />
            <span className="text-gold-500">dizem sobre nós.</span>
          </h2>
          <p
            className={`text-lg text-brand-600 leading-relaxed transition-all duration-600 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transition: 'opacity 0.6s ease, transform 0.6s ease' }}
          >
            Esta secção será preenchida com testemunhos reais de clientes.
          </p>
        </div>

        {/* Placeholder cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLACEHOLDER_TESTIMONIALS.map((item, index) => (
            <div
              key={item.id}
              className={`bg-white p-8 rounded-sm border border-dashed border-brand-200 transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{
                transition: 'opacity 0.5s ease, transform 0.5s ease',
                transitionDelay: `${0.1 + index * 0.1}s`,
              }}
            >
              <FaQuoteLeft className="text-gold-300 text-2xl mb-4" />

              {/* Stars placeholder */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-gold-400 text-sm" />
                ))}
              </div>

              <p className="text-brand-400 text-sm italic leading-relaxed mb-6">
                [Testemunho a substituir por opinião real de um cliente. Descreva a experiência
                com o serviço prestado, a qualidade do trabalho e o acompanhamento durante a obra.]
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-brand-100">
                <div className="w-10 h-10 rounded-full bg-brand-200 flex items-center justify-center">
                  <FaUser className="text-brand-400 text-sm" />
                </div>
                <div>
                  <p className="text-sm font-600 text-brand-400">[Nome do cliente]</p>
                  <p className="text-xs text-brand-300">[Localidade / Tipo de obra]</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
