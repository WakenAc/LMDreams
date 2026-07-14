import { useInView } from '../hooks/useInView';

export function About() {
  const { ref, isVisible } = useInView({ threshold: 0.15 });

  return (
    <section
      id="sobre"
      className="section-padding bg-white"
      ref={ref}
    >
      <div className="container-wide">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Text side */}
          <div>
            <span className="section-label">Sobre nós</span>
            <h2
              className={`text-3xl md:text-4xl lg:text-5xl font-heading text-brand-900 mb-6 transition-all duration-600 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transition: 'opacity 0.6s ease, transform 0.6s ease' }}
            >
              Mais de 20 anos a construir
              <br />
              <span className="text-gold-500">com especialistas.</span>
            </h2>
            <div
              className={`space-y-4 text-brand-600 leading-relaxed transition-all duration-600 delay-150 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transition: 'opacity 0.6s ease, transform 0.6s ease' }}
            >
              <p>
                A <strong className="text-brand-800">LMDreams</strong> é uma empresa de construção
                civil composta por profissionais com mais de 20 anos de experiência no mercado.
                Ao longo destas duas décadas, desenvolvemos a capacidade de responder a
                praticamente todas as necessidades de uma obra — desde pequenas remodelações
                até projetos de construção mais completos.
              </p>
              <p>
                O que nos distingue é a forma como organizamos o trabalho. Ao contrário do que
                acontece em muitas empresas do setor, onde uma única pessoa tenta executar várias
                especialidades sem dominar verdadeiramente nenhuma, na LMDreams cada trabalho é
                realizado por profissionais dedicados e especializados na sua área.
              </p>
              <p>
                Acreditamos que a qualidade se constrói com as pessoas certas em cada lugar.
                Um canalizador a fazer canalização. Um eletricista a fazer eletricidade. Um
                carpinteiro a fazer carpintaria. Esta organização permite-nos entregar resultados
                mais rigorosos, mais duradouros e verdadeiramente profissionais.
              </p>
              <p>
                Além da competência técnica, assumimos um compromisso claro com a transparência.
                Cada etapa é comunicada ao cliente, cada decisão é explicada, cada imprevisto é
                reportado com honestidade. Sabemos que uma obra é um investimento importante e
                que a confiança se conquista com informações claras e com a certeza de que o
                trabalho está a ser bem executado.
              </p>
            </div>
          </div>

          {/* Visual side */}
          <div
            className={`relative transition-all duration-600 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transition: 'opacity 0.6s ease, transform 0.6s ease' }}
          >
            <div className="relative aspect-[4/5] w-full rounded-sm overflow-hidden image-placeholder">
              {/* Decorative frame */}
              <div className="absolute inset-0 border border-gold-300/50 m-4 rounded-sm pointer-events-none z-10" />

              {/* Placeholder content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-brand-400 p-8 text-center">
                <svg
                  className="w-16 h-16 mb-4 text-brand-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                  />
                </svg>
                <p className="text-sm">
                  [Fotografia da equipa ou estaleiro — <br />
                  substituir por imagem real]
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
