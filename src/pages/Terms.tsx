import { LegalLayout, LegalSection } from "./LegalLayout";
import { SITE } from "../lib/site";

export function Terms() {
  return (
    <LegalLayout title="Termos e Condições" updated="[data a preencher]">
      <LegalSection title="1. Âmbito">
        <p>
          Estes termos e condições aplicam-se à utilização do website da
          LMDreams e à informação nele disponibilizada. Não constituem, por
          si só, um contrato de prestação de serviços de construção ou
          remodelação — esse contrato é sempre celebrado separadamente,
          após orçamento e acordo entre as partes.
        </p>
      </LegalSection>

      <LegalSection title="2. Conteúdo do website">
        <p>
          Envidamos esforços para manter a informação deste website
          correta e atualizada. No entanto, serviços, prazos, disponibilidade
          e valores apresentados têm caráter indicativo e devem ser
          confirmados diretamente com a LMDreams antes de qualquer decisão.
        </p>
      </LegalSection>

      <LegalSection title="3. Pedidos de orçamento">
        <p>
          O envio do formulário de contacto ou de pedido de orçamento não
          implica qualquer compromisso contratual até à aceitação formal de
          uma proposta por ambas as partes.
        </p>
      </LegalSection>

      <LegalSection title="4. Propriedade intelectual">
        <p>
          Os textos, imagens e restantes elementos gráficos deste website
          são propriedade da LMDreams ou dos seus respetivos autores, não
          podendo ser reproduzidos sem autorização prévia.
        </p>
      </LegalSection>

      <LegalSection title="5. Contacto">
        <p>
          Para qualquer esclarecimento sobre estes termos, contacte-nos
          através de {SITE.email} ou {SITE.telefone}.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
