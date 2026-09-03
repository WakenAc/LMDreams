import { LegalLayout, LegalSection } from "./LegalLayout";
import { SITE } from "../lib/site";

export function CookiePolicy() {
  return (
    <LegalLayout title="Política de Cookies" updated="[data a preencher]">
      <LegalSection title="1. O que são cookies">
        <p>
          Cookies são pequenos ficheiros de texto guardados no seu
          dispositivo quando visita um website, utilizados para o seu
          funcionamento correto e para melhorar a experiência de navegação.
        </p>
      </LegalSection>

      <LegalSection title="2. Que cookies utiliza este site">
        <p>
          Na sua configuração atual, este website não utiliza cookies de
          publicidade ou de rastreio de terceiros. Caso venham a ser
          adicionadas ferramentas de análise (por exemplo, estatísticas de
          visitas) ou de marketing, esta política deverá ser atualizada para
          as listar de forma detalhada, incluindo finalidade e prazo de
          validade de cada cookie.
        </p>
      </LegalSection>

      <LegalSection title="3. Como gerir os cookies">
        <p>
          Pode gerir ou desativar cookies a qualquer momento através das
          definições do seu navegador. Note que desativar determinados
          cookies pode afetar o funcionamento de algumas partes do site.
        </p>
      </LegalSection>

      <LegalSection title="4. Mais informação">
        <p>
          Para qualquer questão sobre esta política, contacte-nos através de{" "}
          {SITE.email}.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
