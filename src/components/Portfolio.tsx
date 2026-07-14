import { useState } from 'react';
import { useInView } from '../hooks/useInView';
import { portfolioItems, serviceCategories } from '../data/services';
import { FaCamera } from 'react-icons/fa';

export function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('todas');
  const { ref, isVisible } = useInView({ threshold: 0.05 });

  const filtered =
    activeCategory === 'todas'
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeCategory);

  return (
    <section id="projetos" className="section-padding bg-white" ref={ref}>
      <div className="container-wide">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <span className="section-label">Projetos</span>
          <h2
            className={`text-3xl md:text-4xl lg:text-5xl font-heading text-brand-900 mb-6 transition-all duration-600 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transition: 'opacity 0.6s ease, transform 0.6s ease' }}
          >
            Trabalhos que
            <br />
            <span className="text-gold-500">falam por si.</span>
          </h2>
          <p
            className={`text-lg text-brand-600 leading-relaxed transition-all duration-600 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transition: 'opacity 0.6s ease, transform 0.6s ease' }}
          >
            Conheça alguns dos projetos que já realizamos. Esta secção será atualizada com
            fotografias reais dos nossos trabalhos.
          </p>
        </div>

        {/* Category filter */}
        <div
          className={`flex flex-wrap gap-2 mb-10 transition-all duration-600 delay-150 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transition: 'opacity 0.6s ease, transform 0.6s ease' }}
          role="tablist"
          aria-label="Filtrar por categoria"
        >
          <button
            onClick={() => setActiveCategory('todas')}
            className={`px-4 py-2 text-sm rounded-sm border transition-all ${
              activeCategory === 'todas'
                ? 'bg-accent-600 text-white border-accent-600'
                : 'bg-white text-brand-600 border-brand-200 hover:border-accent-400'
            }`}
            role="tab"
            aria-selected={activeCategory === 'todas'}
          >
            Todas
          </button>
          {serviceCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-sm rounded-sm border transition-all ${
                activeCategory === cat.id
                  ? 'bg-accent-600 text-white border-accent-600'
                  : 'bg-white text-brand-600 border-brand-200 hover:border-accent-400'
              }`}
              role="tab"
              aria-selected={activeCategory === cat.id}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, index) => (
              <article
                key={item.id}
                className={`group cursor-pointer transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{
                  transition: 'opacity 0.5s ease, transform 0.5s ease',
                  transitionDelay: `${0.05 * index}s`,
                }}
              >
                {/* Image placeholder */}
                <div className="aspect-[4/3] image-placeholder rounded-sm overflow-hidden relative mb-4">
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-brand-400 p-6">
                    <FaCamera className="text-2xl mb-2" />
                    <span className="text-xs text-center">{item.images[0]?.placeholder || '[Fotografia]'}</span>
                  </div>
                </div>

                {/* Info */}
                <h3 className="text-lg font-600 text-brand-900 mb-1">
                  {item.title}
                </h3>
                <div className="flex items-center gap-3 text-sm text-brand-400 mb-2">
                  <span>{item.type}</span>
                  <span className="w-1 h-1 rounded-full bg-brand-300" />
                  <span>{item.location}</span>
                </div>
                <p className="text-sm text-brand-500 leading-relaxed">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-center text-brand-400 py-12">
            Nenhum projeto encontrado nesta categoria.
          </p>
        )}
      </div>
    </section>
  );
}
