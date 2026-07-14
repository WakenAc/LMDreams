import { useInView } from '../hooks/useInView';
import {
  FaPhone,
  FaBuilding,
  FaClipboardList,
  FaDollarSign,
  FaCalendarCheck,
  FaUserCog,
  FaComments,
  FaCheckDouble,
} from 'react-icons/fa';

const STEPS = [
  { icon: FaPhone, title: '1. Primeiro contacto', description: 'Fale connosco sobre o seu projeto. Conta-nos o que precisa e como imagina o resultado final.' },
  { icon: FaBuilding, title: '2. Visita ou análise do projeto', description: 'Deslocamo-nos ao local ou analisamos os projetos existentes para compreender as condições reais da obra.' },
  { icon: FaClipboardList, title: '3. Identificação das necessidades', description: 'Identificamos todas as especialidades necessárias e os profissionais indicados para cada uma.' },
  { icon: FaDollarSign, title: '4. Orçamento claro', description: 'Apresentamos um orçamento detalhado, com os trabalhos previstos, os materiais e os valores de cada etapa.' },
  { icon: FaCalendarCheck, title: '5. Planeamento dos trabalhos', description: 'Definimos um calendário realista com as fases da obra e a sequência das especialidades envolvidas.' },
  { icon: FaUserCog, title: '6. Execução por especialistas', description: 'Cada fase é executada pelos profissionais certos, com supervisão e coordenação permanentes.' },
  { icon: FaComments, title: '7. Acompanhamento e comunicação', description: 'Mantemo-lo informado sobre o progresso. Qualquer ajuste é comunicado antes de ser decidido.' },
  { icon: FaCheckDouble, title: '8. Verificação final e entrega', description: 'Antes de entregar, verificamos cada detalhe. O trabalho só fica concluído quando está tudo como devia.' },
];

export function WorkMethod() {
  const { ref, isVisible } = useInView({ threshold: 0.05 });

  return (
    <section id="metodo" className="section-padding bg-stone-50" ref={ref}>
      <div className="container-wide">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <span className="section-label">Método de trabalho</span>
          <h2
            className={`text-3xl md:text-4xl lg:text-5xl font-heading text-brand-900 mb-6 transition-all duration-600 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transition: 'opacity 0.6s ease, transform 0.6s ease' }}
          >
            Um processo simples,
            <br />
            <span className="text-gold-500">do princípio ao fim.</span>
          </h2>
          <p
            className={`text-lg text-brand-600 leading-relaxed transition-all duration-600 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transition: 'opacity 0.6s ease, transform 0.6s ease' }}
          >
            Para que tudo corra bem, definimos um processo claro. Saber o que acontece em cada
            fase dá-lhe confiança e ajuda-nos a manter o rigor que prometemos.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-brand-200 hidden md:block" />

          <div className="space-y-8 md:space-y-0">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className={`relative md:flex md:items-start gap-8 pb-8 md:pb-12 last:pb-0 transition-all duration-600 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                  style={{
                    transition: 'opacity 0.5s ease, transform 0.5s ease',
                    transitionDelay: `${0.05 * index}s`,
                  }}
                >
                  {/* Step circle */}
                  <div className="hidden md:flex shrink-0 w-12 h-12 rounded-full bg-gold-500 text-white items-center justify-center relative z-10 shadow-sm">
                    <Icon className="text-base" />
                  </div>

                  {/* Mobile indicator */}
                  <div className="flex md:hidden items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gold-500 text-white flex items-center justify-center shrink-0">
                      <Icon className="text-sm" />
                    </div>
                    <h3 className="text-base font-600 text-brand-900">{step.title}</h3>
                  </div>

                  {/* Content */}
                  <div className="md:pt-2 md:pl-0">
                    <h3 className="hidden md:block text-lg font-600 text-brand-900 mb-2">{step.title}</h3>
                    <p className="text-brand-500 text-sm md:text-base leading-relaxed max-w-xl">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
