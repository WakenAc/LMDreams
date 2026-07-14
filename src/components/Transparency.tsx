import { useInView } from '../hooks/useInView';
import { FaEye, FaUserCheck, FaRoute, FaChartLine, FaBell, FaExclamationTriangle } from 'react-icons/fa';

const POINTS = [
  {
    icon: FaEye,
    title: 'O que vai ser executado',
    description: 'Antes de qualquer trabalho, explicamos exatamente o que será feito, porquê e por quem.',
  },
  {
    icon: FaUserCheck,
    title: 'Quem é responsável por cada especialidade',
    description: 'Saberá o nome e a função de cada profissional envolvido. Não há generalistas a fazer tudo.',
  },
  {
    icon: FaRoute,
    title: 'Quais são as principais etapas',
    description: 'Apresentamos o plano da obra com as fases previstas, para que saiba o que esperar em cada momento.',
  },
  {
    icon: FaChartLine,
    title: 'Como está a decorrer o trabalho',
    description: 'Acompanhamos a obra de perto e damos notícias regulares. Não precisa de andar a adivinhar como está o progresso.',
  },
  {
    icon: FaBell,
    title: 'Alterações que afetam o orçamento',
    description: 'Se algo mudar — e nas obras às vezes muda — explicamos o impacto nos custos e nos prazos antes de avançar.',
  },
];

export function Transparency() {
  const { ref, isVisible } = useInView({ threshold: 0.1 });

  return (
    <section className="section-padding bg-brand-900 text-white" ref={ref}>
      <div className="container-wide">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <span className="section-label text-gold-300 before:bg-gold-500/50">
            Transparência e confiança
          </span>
          <h2
            className={`text-3xl md:text-4xl lg:text-5xl font-heading text-white mb-6 transition-all duration-600 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transition: 'opacity 0.6s ease, transform 0.6s ease' }}
          >
            Tem o direito de saber
            <br />
            <span className="text-gold-300">tudo o que se passa na obra.</span>
          </h2>
          <p
            className={`text-lg text-brand-300 leading-relaxed transition-all duration-600 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transition: 'opacity 0.6s ease, transform 0.6s ease' }}
          >
            A transparência não é um slogan — é a forma como trabalhamos. Numa obra, imprevistos
            acontecem. O que nos diferencia é que nunca os escondemos.
          </p>
        </div>

        {/* Points grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POINTS.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className={`p-6 border border-white/10 rounded-sm transition-all duration-500 hover:bg-white/5 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{
                  transition: 'opacity 0.5s ease, transform 0.5s ease',
                  transitionDelay: `${0.1 + index * 0.1}s`,
                }}
              >
                <Icon className="text-gold-400 text-xl mb-4" />
                <h3 className="text-base font-600 text-white mb-2">{point.title}</h3>
                <p className="text-sm text-brand-400 leading-relaxed">{point.description}</p>
              </div>
            );
          })}
        </div>

        {/* Honest note */}
        <div
          className={`mt-12 p-6 border border-white/10 rounded-sm bg-white/5 max-w-2xl transition-all duration-600 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transition: 'opacity 0.6s ease, transform 0.6s ease' }}
        >
          <FaExclamationTriangle className="text-gold-400 text-lg mb-3" />
          <p className="text-sm text-brand-300 leading-relaxed">
            Não prometemos que nunca existem imprevistos numa obra. Prometemos que, quando
            surgirem, será o primeiro a saber — com clareza, honestidade e uma solução
            apresentada atempadamente.
          </p>
        </div>
      </div>
    </section>
  );
}
