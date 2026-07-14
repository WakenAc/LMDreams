import { useInView } from '../hooks/useInView';
import { FaUserCog, FaComments, FaClipboardCheck, FaMedal, FaPhone } from 'react-icons/fa';

const DIFF_ITEMS = [
  {
    icon: FaUserCog,
    title: 'Profissionais especializados',
    description:
      'Cada especialidade é executada por profissionais com experiência comprovada nessa área. Canalizadores, eletricistas, carpinteiros, pintores — cada um no seu ofício.',
  },
  {
    icon: FaComments,
    title: 'Comunicação transparente',
    description:
      'Mantemo-lo informado em cada etapa. Saberá o que está a ser feito, por quem, e se houver imprevistos — porque numa obra eles existem — será o primeiro a saber.',
  },
  {
    icon: FaClipboardCheck,
    title: 'Planeamento rigoroso',
    description:
      'Antes de qualquer trabalho, definimos um plano claro com as etapas, os profissionais envolvidos e os prazos previstos. Organização é sinónimo de respeito pelo cliente.',
  },
  {
    icon: FaMedal,
    title: 'Qualidade de execução',
    description:
      'Não entregamos um trabalho que não nos orgulhe. Cada serviço é verificado antes de ser dado como concluído, garantindo durabilidade e um acabamento cuidado.',
  },
  {
    icon: FaPhone,
    title: 'Acompanhamento durante toda a obra',
    description:
      'Desde o primeiro contacto até à entrega final, há sempre alguém disponível para esclarecer dúvidas, alinhar decisões e garantir que tudo corre como planeado.',
  },
];

export function Differentiation() {
  const { ref, isVisible } = useInView({ threshold: 0.1 });

  return (
    <section className="section-padding bg-stone-50" ref={ref}>
      <div className="container-wide">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <span className="section-label">A nossa diferença</span>
          <h2
            className={`text-3xl md:text-4xl lg:text-5xl font-heading text-brand-900 mb-6 transition-all duration-600 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transition: 'opacity 0.6s ease, transform 0.6s ease' }}
          >
            Não acreditamos no
            {' '}<em className="text-gold-500 not-italic">'faz tudo'</em>.
            <br />
            Acreditamos em especialistas.
          </h2>
          <p
            className={`text-lg text-brand-600 leading-relaxed transition-all duration-600 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transition: 'opacity 0.6s ease, transform 0.6s ease' }}
          >
            Na LMDreams, cada trabalho é feito por quem realmente sabe. Não combinamos
            especialidades na mesma pessoa — juntamos profissionais diferentes, cada um
            com a experiência certa para a sua área.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DIFF_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`group bg-white p-8 rounded-sm border border-brand-100 service-card transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transition: 'opacity 0.5s ease, transform 0.5s ease',
                  transitionDelay: `${0.1 + index * 0.1}s`,
                }}
              >
                <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center mb-5 group-hover:bg-gold-200 transition-colors">
                  <Icon className="text-gold-600 text-xl" />
                </div>
                <h3 className="text-lg font-600 text-brand-900 mb-3">{item.title}</h3>
                <p className="text-sm text-brand-500 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
