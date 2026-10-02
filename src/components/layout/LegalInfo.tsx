import type { ReactNode } from 'react'
import { company } from '../../content/company'
import { footer } from '../../content/footer'
import { PlainText } from '../ui/RichText'

// Bloco "Informação legal" do rodapé (Parte 5.6), em carimbo: a tabela de legenda de uma
// planta, com rótulos em Plex Mono 12 px (muted-on-dark) e valores em on-dark. Cada linha
// do modelo é uma linha do carimbo, pela mesma ordem:
//   1. denominação, tipo · marca LMDreams (ENI: nome civil, empresário em nome individual)
//   2. sede · NIPC e matrícula, conservatória (ENI: NIF · morada profissional)
//   3. capital social; capital realizado e capital próprio só quando não são null (só sociedades)
//   4. título do IMPIC
//   5. e-mail · telefone (tipo de chamada)
// Os dados vêm de company.ts (placeholders realçados pelo PlainText) e os rótulos de
// footer.legalLabels. Rótulos, pontuação e valores ficam no mesmo parágrafo, na ordem de
// leitura do modelo.

const TITLE_ID = 'informacao-legal-titulo'

const LABEL = 'font-mono text-caption font-medium tracking-[0.06em] uppercase text-muted-on-dark'
const ROW = 'border-t border-line-on-dark'
const CELL = 'px-4 py-3'
// Linha com duas ou três células: empilhadas em telemóvel, lado a lado a partir de 768 px.
const SPLIT =
  `${ROW} grid divide-y divide-line-on-dark md:grid-flow-col md:auto-cols-fr md:divide-x md:divide-y-0`

function Cell({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <p className={CELL}>
      {label ? <span className={`block ${LABEL}`}>{label}</span> : null}
      <span className={label ? 'mt-1 block' : 'block'}>{children}</span>
    </p>
  )
}

export function LegalInfo() {
  const l = company.legal
  const labels = footer.legalLabels
  const eni = l.form === 'eni'

  return (
    <section data-legal-info="" aria-labelledby={TITLE_ID}>
      <h2 id={TITLE_ID} className="font-display text-[1.0625rem] leading-snug font-semibold text-on-dark">
        {footer.legalInfoHeading}
      </h2>

      <div className="mt-4 rounded-sm border border-line-on-dark text-small text-on-dark">
        {/* 1. Firma (ou nome civil) e marca */}
        <p className={CELL}>
          <span className="text-body font-medium">
            <PlainText onDark text={`${l.name}, ${eni ? labels.eniSuffix : l.companyType}`} />
          </span>
          <span className="text-muted-on-dark"> · </span>
          <span className={LABEL}>{labels.brand}</span>
        </p>

        {/* 2. Sede, NIPC e matrícula (ENI: NIF e morada profissional) */}
        {eni ? (
          <div className={SPLIT}>
            <Cell label={labels.nif}>
              <PlainText onDark text={l.nipc} />
            </Cell>
            <Cell label={labels.professionalAddress}>
              <PlainText onDark text={l.address} />
            </Cell>
          </div>
        ) : (
          <div className={SPLIT}>
            <Cell label={labels.seat}>
              <PlainText onDark text={l.address} />
            </Cell>
            <Cell label={labels.nipc}>
              <PlainText
                onDark
                text={
                  l.registry === null
                    ? `${l.nipc} (${labels.registryUnnamed})`
                    : `${l.nipc}, ${labels.registry} ${l.registry}`
                }
              />
            </Cell>
          </div>
        )}

        {/* 3. Capital (só sociedades) */}
        {eni ? null : (
          <div className={SPLIT}>
            <Cell label={labels.shareCapital}>
              <PlainText onDark text={l.shareCapital} />
            </Cell>
            {l.paidUpCapital !== null ? (
              <Cell>
                <PlainText onDark text={l.paidUpCapital} />
              </Cell>
            ) : null}
            {l.equityNote !== null ? (
              <Cell>
                <PlainText onDark text={l.equityNote} />
              </Cell>
            ) : null}
          </div>
        )}

        {/* 4. Título habilitante do IMPIC */}
        <p className={`${ROW} ${CELL}`}>
          <PlainText
            onDark
            text={`${l.license.type} ${labels.license} ${l.license.number}, ${labels.licenseIssuer}`}
          />
        </p>

        {/* 5. Contactos */}
        <p className={`${ROW} ${CELL}`}>
          <span className="break-words">{company.email}</span>
          <span className="text-muted-on-dark"> · </span>
          <span className="tabular whitespace-nowrap">{company.phone.display}</span> ({company.phoneCallNote})
        </p>
      </div>
    </section>
  )
}
