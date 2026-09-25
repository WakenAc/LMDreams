import { company } from '../../content/company'
import { footer } from '../../content/footer'
import { PlainText } from '../ui/RichText'

// Provisório (Fase 2). Versão final: pacote WP1 (bloco "Informação legal" em carimbo,
// variante sociedade ou empresário em nome individual, Parte 5.6).
export function LegalInfo() {
  const l = company.legal
  return (
    <section data-legal-info="" aria-labelledby="informacao-legal-titulo" className="text-small text-muted-on-dark">
      <h2 id="informacao-legal-titulo" className="font-mono text-caption uppercase text-on-dark">
        {footer.legalInfoHeading}
      </h2>
      <p className="mt-2">
        <PlainText onDark text={`${l.name}, ${l.companyType} · ${footer.legalLabels.brand}`} />
      </p>
      <p>
        <PlainText
          onDark
          text={`${footer.legalLabels.seat}: ${l.address} · ${footer.legalLabels.nipc}: ${l.nipc}, ${footer.legalLabels.registry} ${l.registry}`}
        />
      </p>
    </section>
  )
}
