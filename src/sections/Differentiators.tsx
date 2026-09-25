import { differentiators } from '../content/differentiators'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { Icon } from '../components/ui/Icon'
import { Picture } from '../components/ui/Picture'
import { PlainText } from '../components/ui/RichText'
import { Section } from '../components/ui/Section'
import { SectionHeading } from '../components/ui/SectionHeading'

// Diferenciação (Parte 5.4 §4; direção visual, secção 9): faixa escura com uma grelha
// assimétrica, sem motivos da planta. A partir de 1024 px, numa grelha de 12 colunas:
//
//   [ fotografia 3:2 (7 colunas, 2 linhas) ][ cartão 1 (5 colunas) ]
//   [                                       ][ cartão 2 (5 colunas) ]
//   [ cartão 3 (4) ][ cartão 4 (4) ][ cartão 5 (4) ]
//
// A lista dos cinco cartões é uma só <ul> em subgrelha (subgrid) que ocupa a grelha inteira,
// para os cartões se alinharem com a fotografia sem partir a semântica da lista.
// Tablet (768 a 1023 px): fotografia a toda a largura e cartões em 2 colunas, o último largo.
// Telemóvel: tudo empilhado, cartões a toda a largura.

/** Posição de cada cartão a partir de 1024 px (pela ordem do conteúdo). */
const CARD_PLACEMENT: readonly string[] = [
  'lg:col-span-5 lg:col-start-8 lg:row-start-1',
  'lg:col-span-5 lg:col-start-8 lg:row-start-2',
  'lg:col-span-4 lg:col-start-1 lg:row-start-3',
  'lg:col-span-4 lg:col-start-5 lg:row-start-3',
  'lg:col-span-4 lg:col-start-9 lg:row-start-3',
]

/** Largura da fotografia: 7 de 12 colunas (732 px no contentor máximo de 1272 px). */
const PICTURE_SIZES = '(min-width: 1336px) 732px, (min-width: 1024px) 55vw, 100vw'

export function Differentiators() {
  const { cards } = differentiators
  const oddCount = cards.length % 2 === 1
  return (
    <Section id="diferenciacao" tone="dark">
      <Container>
        <div data-reveal="">
          <SectionHeading
            sectionId="diferenciacao"
            title={differentiators.heading}
            intro={differentiators.intro}
            onDark
          />
        </div>

        <div data-reveal="" className="mt-12 grid gap-4 md:mt-14 md:gap-6 lg:mt-16 lg:grid-cols-12">
          {/* A partir de 1024 px, a largura vem das 7 colunas (lg:w-full) e a altura estica
              até à dos cartões 1 e 2 (lg:self-stretch); a proporção 3:2 dá a altura mínima.
              Sem a largura explícita, quando os cartões são mais altos do que a proporção
              (1024 px, textos em 3 linhas), a largura era derivada da altura esticada e a
              fotografia entrava na coluna dos cartões, por cima do texto. */}
          <Picture
            id="diferenciacao"
            frameClassName="aspect-[3/2]"
            className="lg:col-span-7 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:w-full lg:self-stretch"
            sizes={PICTURE_SIZES}
          />
          {/* Cartões estáticos: sem estado de hover (só os controlos reagem ao rato). */}
          <ul className="grid gap-4 md:grid-cols-2 md:gap-6 lg:col-span-12 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:grid-cols-subgrid lg:grid-rows-subgrid">
            {cards.map((card, i) => (
              <Card
                key={card.title}
                as="li"
                variant="differentiator"
                className={[
                  oddCount && i === cards.length - 1 ? 'md:col-span-2' : '',
                  CARD_PLACEMENT[i] ?? 'lg:col-span-4',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <Icon name={card.icon} className="shrink-0 text-accent-on-dark" />
                <div className="mt-2">
                  <h3 className="text-h3 text-on-dark">
                    <PlainText text={card.title} onDark />
                  </h3>
                  <p className="mt-2 max-w-texto text-muted-on-dark">
                    <PlainText text={card.text} onDark />
                  </p>
                </div>
              </Card>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  )
}
