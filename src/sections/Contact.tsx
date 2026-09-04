import { type FormEvent, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Paperclip,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Container } from "../components/ui/Container";
import { SectionHeading } from "../components/ui/SectionHeading";
import { FAIXAS_DE_ORCAMENTO, TIPOS_DE_SERVICO } from "../data/contactOptions";
import { SITE } from "../lib/site";

const inputClass =
  "w-full rounded-xl border border-line-strong bg-surface-2 px-4 py-2.5 text-sm text-fg placeholder:text-fg-subtle transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25";

const labelClass = "text-sm font-medium text-fg";

export function Contact() {
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Formulário sem backend por predefinição.
    // Para ligar a um serviço externo (ex.: Formspree, Getform, EmailJS ou
    // uma função serverless própria), substitua este bloco por um pedido
    // fetch/POST para esse serviço — ver instruções no README.
    setEnviado(true);
  }

  return (
    <section id="contactos" className="scroll-mt-20 bg-ink py-20 sm:py-28">
      <Container className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Contactos"
            title="Vamos falar sobre a sua obra."
            description="Preencha o formulário com o máximo de detalhe possível ou contacte-nos diretamente através dos canais abaixo."
          />

          <div className="mt-10 flex flex-col gap-5">
            <a
              href={SITE.telefoneHref}
              className="flex items-center gap-4 rounded-xl border border-line bg-surface-2 p-4 transition-colors hover:border-brand/50"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                <Phone className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-xs font-medium uppercase tracking-wide text-fg-subtle">
                  Telefone / WhatsApp
                </span>
                <span className="block font-semibold text-fg">
                  {SITE.telefone}
                </span>
              </span>
            </a>

            <a
              href={`mailto:${SITE.email}`}
              className="flex items-center gap-4 rounded-xl border border-line bg-surface-2 p-4 transition-colors hover:border-brand/50"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-xs font-medium uppercase tracking-wide text-fg-subtle">
                  E-mail
                </span>
                <span className="block font-semibold text-fg">{SITE.email}</span>
              </span>
            </a>

            <div className="flex items-center gap-4 rounded-xl border border-line bg-surface-2 p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-xs font-medium uppercase tracking-wide text-fg-subtle">
                  Área de atuação
                </span>
                <span className="block font-semibold text-fg">
                  {SITE.areaAtuacao}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-line bg-surface-2 p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                <Clock className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-xs font-medium uppercase tracking-wide text-fg-subtle">
                  Horário de atendimento
                </span>
                <span className="block font-semibold text-fg">
                  {SITE.horario}{" "}
                  <span className="font-normal text-fg-subtle">
                    (a confirmar)
                  </span>
                </span>
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs font-medium uppercase tracking-wide text-fg-subtle">
                Redes sociais
              </span>
              <a
                href={SITE.instagramHref}
                title="Placeholder — associar Instagram real"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-fg-subtle transition-colors hover:border-brand hover:text-brand"
              >
                <Instagram className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={SITE.facebookHref}
                title="Placeholder — associar Facebook real"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-fg-subtle transition-colors hover:border-brand hover:text-brand"
              >
                <Facebook className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-line bg-surface-2 p-6 shadow-soft sm:p-9">
          {enviado ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <CheckCircle2 className="h-10 w-10 text-brand" aria-hidden="true" />
              <h3 className="font-display text-xl font-semibold text-fg">
                Pedido preparado com sucesso
              </h3>
              <p className="max-w-sm text-sm leading-relaxed text-fg-subtle">
                Este formulário ainda não está ligado a um serviço de envio.
                Assim que a integração for ativada, receberá aqui a
                confirmação real do seu pedido. Entretanto, contacte-nos
                diretamente por telefone ou e-mail.
              </p>
              <button
                type="button"
                onClick={() => setEnviado(false)}
                className="mt-2 text-sm font-semibold text-brand underline underline-offset-4"
              >
                Preencher novamente
              </button>
            </div>
          ) : (
            <form className="grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="nome" className={labelClass}>
                  Nome *
                </label>
                <input id="nome" name="nome" type="text" required autoComplete="name" className={inputClass} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="telefone" className={labelClass}>
                  Telefone *
                </label>
                <input id="telefone" name="telefone" type="tel" required autoComplete="tel" className={inputClass} />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label htmlFor="email" className={labelClass}>
                  E-mail *
                </label>
                <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label htmlFor="localizacao" className={labelClass}>
                  Localização da obra
                </label>
                <input
                  id="localizacao"
                  name="localizacao"
                  type="text"
                  placeholder="Concelho / localidade"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="tipoServico" className={labelClass}>
                  Tipo de serviço
                </label>
                <select id="tipoServico" name="tipoServico" defaultValue="" className={inputClass}>
                  <option value="" disabled>
                    Selecione uma opção
                  </option>
                  {TIPOS_DE_SERVICO.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="orcamento" className={labelClass}>
                  Orçamento aproximado
                </label>
                <select id="orcamento" name="orcamento" defaultValue="" className={inputClass}>
                  <option value="" disabled>
                    Selecione uma opção
                  </option>
                  {FAIXAS_DE_ORCAMENTO.map((faixa) => (
                    <option key={faixa} value={faixa}>
                      {faixa}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label htmlFor="mensagem" className={labelClass}>
                  Mensagem *
                </label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  required
                  rows={4}
                  placeholder="Descreva brevemente o que pretende fazer"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label htmlFor="fotografias" className={labelClass}>
                  Fotografias (opcional)
                </label>
                <label
                  htmlFor="fotografias"
                  className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-line-strong bg-surface px-4 py-3 text-sm text-fg-subtle transition-colors hover:border-brand hover:text-brand"
                >
                  <Paperclip className="h-4 w-4" aria-hidden="true" />
                  Anexar fotografias do espaço
                </label>
                <input
                  id="fotografias"
                  name="fotografias"
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                />
              </div>

              <div className="flex items-start gap-3 sm:col-span-2">
                <input
                  id="consentimento"
                  name="consentimento"
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 rounded border-line-strong text-brand focus:ring-brand/30"
                />
                <label htmlFor="consentimento" className="text-sm leading-relaxed text-fg-muted">
                  Autorizo o tratamento dos meus dados pessoais para efeitos
                  de resposta a este pedido de contacto, nos termos da{" "}
                  <Link
                    to="/politica-de-privacidade"
                    className="font-medium text-brand underline underline-offset-2"
                  >
                    Política de Privacidade
                  </Link>
                  . *
                </label>
              </div>

              <div className="sm:col-span-2">
                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  Enviar pedido de orçamento
                </Button>
                <p className="mt-3 text-xs leading-relaxed text-fg-subtle">
                  * Campos obrigatórios. Este formulário está preparado para
                  integração com um serviço de envio externo — ver README do
                  projeto.
                </p>
              </div>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
