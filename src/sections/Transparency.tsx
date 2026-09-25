import { transparency } from '../content/transparency'
import { Container } from '../components/ui/Container'
import { Picture } from '../components/ui/Picture'
import { RichText } from '../components/ui/RichText'
import { Section } from '../components/ui/Section'
import { SectionHeading } from '../components/ui/SectionHeading'
import { CotaSeparator, RuledList } from './About'

// Transparência e confiança (Parte 5.4 §8; direção visual, secção 9).
//
// Segue-se aos Projetos, com o mesmo fundo: abre com o separador de cota (o pacote de
// Projetos não deve pôr outro no fim da sua secção).
// Computador (>= 1024 px): texto à esquerda (colunas 1 a 6: título, introdução e a lista
// "O que vai saber") e, à direita (colunas 8 a 12), a fotografia 3:2 com o parágrafo sobre
// imprevistos por baixo, em destaque discreto com uma linha de latão à esquerda.
// Tablet e telemóvel largo (640 a 1023 px): texto a toda a largura e, por baixo, o parágrafo
// sobre imprevistos (4 colunas) ao lado da fotografia (4 colunas, à direita).
// Telemóvel (< 640 px): empilhado; título, lista, fotografia e parágrafo sobre imprevistos.

const LIST_TITLE_ID = 'transparencia-lista-titulo'

/** Tamanhos da fotografia: 5 de 12 colunas, 4 de 8 colunas, largura do contentor. */
const PHOTO_SIZES =
  '(min-width: 1336px) 516px, (min-width: 1024px) 39vw, (min-width: 640px) 47vw, calc(100vw - 32px)'

/** Zoom de 2% em hover (Parte 5.3), só com movimento aceite. */
const PHOTO_HOVER = 'transition-transform duration-200 motion-safe:hover:scale-[1.02]'

export function Transparency() {
  return (
    <Section id="transparencia" flush className="pb-[clamp(4rem,8vw,8rem)]">
      <Container>
        <CotaSeparator className="mb-[calc(clamp(4rem,8vw,8rem)_-_11px)]" />

        <div className="grid grid-cols-1 items-start gap-y-12 lg:grid-cols-12 lg:gap-x-6">
          <div data-reveal="" className="lg:col-span-6">
            <SectionHeading
              sectionId="transparencia"
              title={transparency.heading}
              intro={transparency.intro}
            />
            <h3 id={LIST_TITLE_ID} className="mt-10 text-h3 text-ink">
              {transparency.listTitle}
            </h3>
            <RuledList aria-labelledby={LIST_TITLE_ID} items={transparency.items} className="mt-5 max-w-texto" />
          </div>

          <div
            data-reveal=""
            className="grid grid-cols-1 gap-y-8 sm:grid-cols-8 sm:items-center sm:gap-x-6 lg:col-span-5 lg:col-start-8 lg:block"
          >
            <Picture
              id="transparencia"
              frameClassName="aspect-[3/2]"
              className="sm:col-span-4 sm:col-start-5 sm:row-start-1"
              sizes={PHOTO_SIZES}
              imgClassName={PHOTO_HOVER}
            />
            <p
              data-unforeseen=""
              className="max-w-texto border-l-2 border-accent py-1 pl-5 text-ink sm:col-span-4 sm:col-start-1 sm:row-start-1 lg:mt-10"
            >
              <RichText value={transparency.unforeseen} />
            </p>
          </div>
        </div>
      </Container>
    </Section>
  )
}
