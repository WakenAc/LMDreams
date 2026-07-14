import { useState, useMemo } from 'react';
import { useInView } from '../hooks/useInView';
import { services } from '../data/services-react';
import { FaSearch } from 'react-icons/fa';

export function Services() {
  const [searchQuery, setSearchQuery] = useState('');
  const { ref, isVisible } = useInView({ threshold: 0.05 });

  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return services;
    const q = searchQuery.toLowerCase();
    return services.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <section
      id="servicos"
      className="section-padding bg-white"
      ref={ref}
    >
      <div className="container-wide">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <span className="section-label">Serviços</span>
          <h2
            className={`text-3xl md:text-4xl lg:text-5xl font-heading text-brand-900 mb-6 transition-all duration-600 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transition: 'opacity 0.6s ease, transform 0.6s ease' }}
          >
            Todas as especialidades
            <br />
            <span className="text-gold-500">para a sua obra.</span>
          </h2>
          <p
            className={`text-lg text-brand-600 leading-relaxed transition-all duration-600 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transition: 'opacity 0.6s ease, transform 0.6s ease' }}
          >
            Da canalização à pintura, da carpintaria às impermeabilizações — coordenamos
            todas as especialidades necessárias para que a sua obra seja executada com
            qualidade, do início ao fim.
          </p>
        </div>

        {/* Search */}
        <div
          className={`relative max-w-md mb-10 transition-all duration-600 delay-150 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transition: 'opacity 0.6s ease, transform 0.6s ease' }}
        >
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400 text-sm" />
          <input
            type="text"
            placeholder="Procurar serviço..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-brand-200 rounded-sm text-sm text-brand-800 bg-brand-50 placeholder:text-brand-400 focus:outline-none focus:border-gold-500 focus:bg-white transition-colors"
            aria-label="Procurar serviço"
          />
        </div>

        {/* Services grid */}
        {filteredServices.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  className={`group p-5 rounded-sm border border-brand-100 bg-white service-card transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                  style={{
                    transition: 'opacity 0.5s ease, transform 0.5s ease',
                    transitionDelay: `${0.05 + (index % 8) * 0.05}s`,
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center mb-4 group-hover:bg-gold-200 transition-colors">
                    <Icon className="text-gold-600 text-base" />
                  </div>
                  <h3 className="text-base font-600 text-brand-900 mb-2">{service.title}</h3>
                  <p className="text-sm text-brand-500 leading-relaxed">{service.description}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-brand-400 py-12">
            Nenhum serviço encontrado para "{searchQuery}".
          </p>
        )}

        {/* Note */}
        <p className="text-sm text-brand-400 mt-8 text-center border-t border-brand-100 pt-6">
          Os serviços disponíveis devem ser confirmados diretamente com a empresa antes da publicação final.
        </p>
      </div>
    </section>
  );
}
