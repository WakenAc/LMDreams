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
  "w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-stone-400 transition-colors focus:border-copper-500 focus:outline-none focus:ring-2 focus:ring-copper-500/20";

const labelClass = "text-sm font-medium text-ink";

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
    <section id="contactos" className="scroll-mt-20 bg-paper py-20 sm:py-28">
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
              className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-4 transition-colors hover:border-copper-400/50"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-copper-50 text-copper-600">
                <Phone className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                  Telefone / WhatsApp
                </span>
                <span className="block font-semibold text-ink">
                  {SITE.telefone}
                </span>
              </span>
            </a>

            <a
              href={`mailto:${SITE.email}`}
              className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-4 transition-colors hover:border-copper-400/50"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-copper-50 text-copper-600">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                  E-mail
                </span>
                <span className="block font-semibold text-ink">{SITE.email}</span>
              </span>
            </a>

            <div className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-copper-50 text-copper-600">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                  Área de atuação
                </span>
                <span className="block font-semibold text-ink">
                  {SITE.areaAtuacao}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-copper-50 text-copper-600">
                <Clock className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                  Horário de atendimento
                </span>
                <span className="block font-semibold text-ink">
                  {SITE.horario}{" "}
                  <span className="font-normal text-stone-400">
                    (a confirmar)
                  </span>
                </span>
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
                Redes sociais
              </span>
              <a
                href={SITE.instagramHref}
                title="Placeholder — associar Instagram real"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 text-stone-400 transition-colors hover:border-copper-400 hover:text-copper-500"
              >
                <Instagram className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={SITE.facebookHref}
                title="Placeholder — associar Facebook real"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 text-stone-400 transition-colors hover:border-copper-400 hover:text-copper-500"
              >
                <Facebook className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-soft sm:p-9">
          {enviado ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <CheckCircle2 className="h-10 w-10 text-copper-500" aria-hidden="true" />
              <h3 className="font-display text-xl font-semibold text-ink">
                Pedido preparado com sucesso
              </h3>
              <p className="max-w-sm text-sm leading-relaxed text-stone-500">
                Este formulário ainda não está ligado a um serviço de envio.
                Assim que a integração for ativada, receberá aqui a
                confirmação real do seu pedido. Entretanto, contacte-nos
                diretamente por telefone ou e-mail.
              </p>
              <button
                type="button"
                onClick={() => setEnviado(false)}
                className="mt-2 text-sm font-semibold text-copper-600 underline underline-offset-4"
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
                  className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-500 transition-colors hover:border-copper-400 hover:text-copper-600"
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
                  className="mt-1 h-4 w-4 rounded border-stone-300 text-copper-500 focus:ring-copper-500/30"
                />
                <label htmlFor="consentimento" className="text-sm leading-relaxed text-stone-600">
                  Autorizo o tratamento dos meus dados pessoais para efeitos
                  de resposta a este pedido de contacto, nos termos da{" "}
                  <Link
                    to="/politica-de-privacidade"
                    className="font-medium text-copper-600 underline underline-offset-2"
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
                <p className="mt-3 text-xs leading-relaxed text-stone-400">
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
