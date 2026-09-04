import { LegalLayout, LegalSection } from "./LegalLayout";
import { SITE } from "../lib/site";

export function PrivacyPolicy() {
  return (
    <LegalLayout title="Política de Privacidade" updated="[data a preencher]">
      <LegalSection title="1. Quem trata os seus dados">
        <p>
          A LMDreams é responsável pelo tratamento dos dados pessoais
          recolhidos através deste website, nomeadamente através do
          formulário de contacto. Para qualquer questão sobre os seus dados,
          pode contactar-nos através de {SITE.email}.
        </p>
      </LegalSection>

      <LegalSection title="2. Que dados recolhemos">
        <p>
          Quando preenche o formulário de contacto, recolhemos: nome,
          telefone, e-mail, localização da obra, tipo de serviço pretendido,
          orçamento aproximado indicado e o conteúdo da sua mensagem.
        </p>
        <p>
          Se optar por nos enviar fotografias do espaço através do WhatsApp,
          essas imagens são tratadas nessa aplicação, sujeitas às condições
          e à política de privacidade do respetivo fornecedor.
        </p>
      </LegalSection>

      <LegalSection title="3. Finalidade do tratamento">
        <p>
          Os dados recolhidos destinam-se exclusivamente a responder ao seu
          pedido de contacto ou orçamento, e a comunicar consigo sobre um
          eventual projeto de construção ou remodelação.
        </p>
      </LegalSection>

      <LegalSection title="4. Partilha de dados">
        <p>
          Não vendemos nem partilhamos os seus dados pessoais com terceiros
          para fins de marketing.
        </p>
        <p>
          Para que o formulário de contacto funcione, os dados que nele
          introduz são transmitidos a um serviço externo de envio de
          formulários, que os encaminha para o nosso e-mail. O alojamento
          do website é igualmente assegurado por um prestador externo.
        </p>
        <p>
          [A preencher — indicar o nome do serviço de formulários
          efetivamente utilizado e a localização dos respetivos servidores,
          bem como o fornecedor de alojamento do site.]
        </p>
      </LegalSection>

      <LegalSection title="5. Prazo de conservação">
        <p>
          [A preencher — indicar durante quanto tempo os dados recolhidos
          através do formulário são conservados, de acordo com a política
          interna da empresa.]
        </p>
      </LegalSection>

      <LegalSection title="6. Os seus direitos">
        <p>
          Nos termos do Regulamento Geral sobre a Proteção de Dados (RGPD),
          tem o direito de aceder, retificar, apagar ou limitar o
          tratamento dos seus dados pessoais, bem como o direito de
          portabilidade e de oposição. Para exercer estes direitos, contacte-nos
          através de {SITE.email}.
        </p>
      </LegalSection>

      <LegalSection title="7. Contacto e reclamações">
        <p>
          Caso considere que o tratamento dos seus dados pessoais não
          cumpre a legislação aplicável, pode apresentar reclamação junto da
          Comissão Nacional de Proteção de Dados (CNPD).
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
