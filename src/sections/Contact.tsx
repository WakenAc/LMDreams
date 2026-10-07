import { BookOpen, Building2, Clock, Copy, Mail, MapPin, MessageCircle, Phone, Share2, type LucideIcon } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { company } from '../content/company'
import { ui } from '../content/common'
import { budgetRanges, contact } from '../content/contact'
import { services } from '../content/services'
import type { ContactContent } from '../content/tipos'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { PlainText, RichText } from '../components/ui/RichText'
import { Section } from '../components/ui/Section'
import { SectionHeading } from '../components/ui/SectionHeading'
import { VisuallyHidden } from '../components/ui/VisuallyHidden'
import { Checkbox } from '../components/ui/form/Checkbox'
import { Field } from '../components/ui/form/Field'
import { FieldError } from '../components/ui/form/FieldError'
import { FileInput } from '../components/ui/form/FileInput'
import { FormStatus } from '../components/ui/form/FormStatus'
import { Honeypot } from '../components/ui/form/Honeypot'
import { Input } from '../components/ui/form/Input'
import { Select } from '../components/ui/form/Select'
import { Textarea } from '../components/ui/form/Textarea'
import { LABEL_CLASS, cx, fieldIds, joinIds } from '../components/ui/form/styles'
import {
  LEAD_FILE_ACCEPT,
  LEAD_MAX_FILES,
  addLeadFiles,
  formAcceptsFiles,
  formServiceActive,
  submitLead,
  validateLead,
  type LeadData,
  type LeadErrorKey,
  type LeadErrors,
  type LeadValues,
} from '../lib/lead'
import { useHydrated } from '../lib/hydrated'
// Só o tipo: o módulo é carregado à parte, com import() (fora do JavaScript inicial).
import type * as ModuloReducao from '../lib/reduzir-fotografias'
import { pageHref, withBase } from '../lib/links'
import { FIRST_FIELD_ID } from '../lib/quote-links'
import { whatsappHref } from '../lib/whatsapp'

// Contactos (Anexo A §11; Partes 3.8, 5.4 §11, 5.5 e 5.6; design/direcao-visual.md, secção 9):
// duas colunas em computador (formulário em 7 colunas, dados de contacto em 4), empilhadas
// em tablet e telemóvel. Sem JavaScript, ou se a ilha do formulário não carregar, o botão
// de envio dá lugar a uma nota com o e-mail, e os dados de contacto ficam sempre em texto
// ao lado: o visitante nunca fica sem saída. O formulário não tem action="mailto:…": em HTTPS, o Chrome trata esse destino
// como conteúdo misto (Lighthouse, Boas práticas).

// Módulo da redução das fotografias (src/lib/reduzir-fotografias.ts), fora do JavaScript
// inicial. Pedido logo depois da hidratação (com fotografias ligadas); se o pedido falhar,
// volta a ser tentado na escolha seguinte.
let moduloReducao: Promise<typeof ModuloReducao> | null = null
function carregarModuloReducao(): Promise<typeof ModuloReducao> {
  moduloReducao ??= import('../lib/reduzir-fotografias').catch((erro: unknown) => {
    moduloReducao = null
    throw erro
  })
  return moduloReducao
}

const FORM_HEADING_ID = 'contactos-formulario-titulo'
const DETAILS_HEADING_ID = 'contactos-dados-titulo'

/** Ids dos campos (contrato: o primeiro campo é FIRST_FIELD_ID, usado por "Pedir orçamento"). */
const IDS = {
  name: FIRST_FIELD_ID,
  phone: 'campo-telefone',
  email: 'campo-email',
  contact: 'campo-contacto',
  location: 'campo-localizacao',
  service: 'campo-servico',
  message: 'campo-mensagem',
  budget: 'campo-orcamento',
  photos: 'campo-fotografias',
  privacy: 'campo-privacidade',
  trap: 'campo-k7x',
} as const

/** Nome do campo-armadilha: sem significado, para o preenchimento automático não o reconhecer. */
const TRAP_NAME = 'campo_k7x'

/**
 * Atributo `name` de cada campo.
 * Serve para ler o que já estava escrito antes da hidratação (valuesFromForm).
 */
const NAMES = {
  name: 'nome',
  phone: 'telefone',
  email: 'email',
  location: 'localizacao',
  service: 'servico',
  budget: 'orcamento',
  message: 'mensagem',
  trap: TRAP_NAME,
  privacy: 'privacidade',
  photos: 'fotografias',
} as const

const SERVICE_OPTIONS: readonly string[] = [...services.map((s) => s.name), contact.fields.service.otherOption]

/**
 * Etiqueta da caixa da Política de privacidade. `required` é a obrigatoriedade escrita por
 * extenso (Parte 3.8), logo a seguir ao nome, como nos outros campos obrigatórios, e antes
 * do ponto final da frase fixa: "Tomei conhecimento da Política de privacidade (obrigatório)."
 */
const PRIVACY_LABEL: ContactContent['fields']['privacy'] & { required?: string } = contact.fields.privacy

const EMPTY: LeadValues = {
  name: '',
  phone: '',
  email: '',
  location: '',
  service: '',
  budget: '',
  message: '',
  trap: '',
  privacy: false,
}

/** Ordem do formulário, para pôr o foco no primeiro campo com erro. */
const ERROR_ORDER: readonly LeadErrorKey[] = ['name', 'phone', 'contact', 'email', 'location', 'message', 'privacy']

const ERROR_TARGET: Readonly<Record<LeadErrorKey, string>> = {
  name: IDS.name,
  phone: IDS.phone,
  contact: IDS.phone,
  email: IDS.email,
  location: IDS.location,
  message: IDS.message,
  privacy: IDS.privacy,
}

/** Erros que dependem de cada campo (o telefone e o e-mail partilham o erro do grupo). */
const ERRORS_OF: Partial<Record<keyof LeadValues, readonly LeadErrorKey[]>> = {
  name: ['name'],
  phone: ['phone', 'contact'],
  email: ['email', 'contact'],
  location: ['location'],
  message: ['message'],
  privacy: ['privacy'],
}

type Status =
  | { kind: 'idle' }
  | { kind: 'invalid' }
  | { kind: 'sending' }
  | { kind: 'success' }
  /** `withPhotos`: o pedido levava fotografias (a mensagem sugere enviar sem elas). */
  | { kind: 'error'; withPhotos: boolean }
  | { kind: 'mailto-before' }
  | { kind: 'mailto-after'; request: string }

type CopyState = 'idle' | 'copied' | 'failed'

const TEXT_LINK =
  'underline decoration-1 underline-offset-[3px] transition-[text-decoration-thickness] duration-150 ease-planta hover:decoration-2'

// Ligações da lista de contactos: bloco próprio com alvo de 44 px; sublinhado em hover e foco.
const DETAIL_LINK =
  'flex w-fit max-w-full min-h-11 items-center font-medium text-ink underline decoration-transparent decoration-1 ' +
  'underline-offset-4 transition-[text-decoration-color] duration-150 ease-planta ' +
  'hover:decoration-current focus-visible:decoration-current'

/**
 * Valores que estão no DOM do formulário: o que o visitante escreveu (ou o navegador
 * preencheu) no HTML pré-renderizado, antes de o JavaScript chegar.
 */
function valuesFromForm(form: HTMLFormElement): LeadValues {
  const text = (name: string): string => {
    const el = form.elements.namedItem(name)
    return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement
      ? el.value
      : ''
  }
  const privacy = form.elements.namedItem(NAMES.privacy)
  return {
    name: text(NAMES.name),
    phone: text(NAMES.phone),
    email: text(NAMES.email),
    location: text(NAMES.location),
    service: text(NAMES.service),
    budget: text(NAMES.budget),
    message: text(NAMES.message),
    trap: text(NAMES.trap),
    privacy: privacy instanceof HTMLInputElement && privacy.checked,
  }
}

function sameValues(a: LeadValues, b: LeadValues): boolean {
  return (Object.keys(a) as (keyof LeadValues)[]).every((key) => a[key] === b[key])
}

function focusField(id: string): void {
  const campo = document.getElementById(id)
  if (!(campo instanceof HTMLElement)) return
  // Ao centro, para a etiqueta e o erro não ficarem por baixo do cabeçalho fixo.
  campo.scrollIntoView({ block: 'center' })
  campo.focus({ preventScroll: true })
}

// ---------------------------------------------------------------------------
// Formulário

function LeadForm() {
  // Até à hidratação, o navegador valida os campos `required` e o envio não faz nada
  // (method="dialog" fora de um <dialog>: nenhum dado sai da página nem vai para o URL);
  // depois, a validação própria substitui a nativa.
  const hydrated = useHydrated()
  const [values, setValues] = useState<LeadValues>(EMPTY)
  const [errors, setErrors] = useState<LeadErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [files, setFiles] = useState<readonly File[]>([])
  // Cópia síncrona das fotografias (a redução é assíncrona e o envio lê a lista no fim dela)
  // e a redução em curso, para o envio esperar por ela.
  const filesRef = useRef<readonly File[]>([])
  const preparacaoRef = useRef<Promise<void>>(Promise.resolve())
  const [preparing, setPreparing] = useState(0)
  // Recusas da última preparação (o envio não segue se houver recusas que o visitante ainda
  // não viu, por terem chegado depois do clique).
  const recusasRef = useRef<readonly string[]>([])
  const aPrepararRef = useRef(0)
  const [fileErrors, setFileErrors] = useState<readonly string[]>([])
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [copy, setCopy] = useState<CopyState>('idle')
  const formRef = useRef<HTMLFormElement>(null)

  // Hidratação: o formulário do HTML pré-renderizado já aceita texto antes de o JavaScript
  // chegar (o carregador só o pede depois do evento load). Na hidratação, o React não mexe
  // nos valores do DOM, mas o render seguinte (useHydrated) repunha nos campos controlados
  // o estado vazio e apagava o que o visitante escreveu. Este efeito corre no commit da
  // hidratação, antes desse render, e passa para o estado o que está no DOM, incluindo o
  // campo-armadilha (continua a apanhar robôs) e as fotografias já escolhidas.
  // Com fotografias ligadas, o módulo da redução é pedido já, para estar pronto na escolha.
  useEffect(() => {
    if (formAcceptsFiles) carregarModuloReducao().catch(() => undefined)
  }, [])

  useLayoutEffect(() => {
    const form = formRef.current
    if (!form) return
    const found = valuesFromForm(form)
    if (!sameValues(found, EMPTY)) setValues(found)
    if (formAcceptsFiles) {
      const input = form.elements.namedItem(NAMES.photos)
      const chosen = input instanceof HTMLInputElement ? Array.from(input.files ?? []) : []
      if (chosen.length > 0) void addFiles(chosen)
    }
  }, [])

  const busy = status.kind === 'sending' || status.kind === 'mailto-before'
  const contactErrorId = fieldIds(IDS.contact).error
  const privacyErrorId = fieldIds(IDS.privacy).error
  const photosErrorId = fieldIds(IDS.photos).error

  /**
   * Validação depois do primeiro envio: ao sair de um campo mostra ou atualiza o erro;
   * ao escrever só retira os erros que deixaram de existir.
   */
  function revalidate(field: keyof LeadValues, next: LeadValues, mode: 'change' | 'blur'): void {
    const keys = ERRORS_OF[field]
    if (!submitted || !keys) return
    const found = validateLead(next)
    setErrors((prev) => {
      const out: LeadErrors = { ...prev }
      for (const key of keys) {
        const message = found[key]
        if (!message) delete out[key]
        else if (mode === 'blur') out[key] = message
      }
      return out
    })
  }

  function update<K extends keyof LeadValues>(field: K, value: LeadValues[K]): void {
    const next: LeadValues = { ...values, [field]: value }
    setValues(next)
    revalidate(field, next, field === 'privacy' ? 'blur' : 'change')
  }

  function blur(field: keyof LeadValues): void {
    revalidate(field, values, 'blur')
  }

  function applyFiles(next: readonly File[]): void {
    filesRef.current = next
    setFiles(next)
  }

  /** Reduz as fotografias escolhidas (src/lib/reduzir-fotografias.ts) e junta-as às que já estavam. */
  function addFiles(novos: File[]): Promise<void> {
    aPrepararRef.current += 1
    setPreparing((n) => n + 1)
    const preparacao = preparacaoRef.current.then(async () => {
      try {
        // Se o módulo da redução não carregar, seguem as originais (com os limites de addLeadFiles).
        let reduzidas: File[] = novos
        try {
          const { reduceLeadFiles } = await carregarModuloReducao()
          reduzidas = await reduceLeadFiles(novos, LEAD_MAX_FILES - filesRef.current.length)
        } catch {
          // Sem redução.
        }
        const result = addLeadFiles(filesRef.current, reduzidas)
        applyFiles(result.files)
        setFileErrors(result.errors)
        recusasRef.current = result.errors
      } finally {
        aPrepararRef.current -= 1
        setPreparing((n) => n - 1)
      }
    })
    preparacaoRef.current = preparacao
    return preparacao
  }

  /** Espera por todas as preparações, incluindo as que comecem enquanto espera. */
  async function esperarPreparacao(): Promise<void> {
    let atual: Promise<void>
    do {
      atual = preparacaoRef.current
      await atual
    } while (atual !== preparacaoRef.current)
  }

  function removeFile(index: number): void {
    applyFiles(filesRef.current.filter((_, i) => i !== index))
    setFileErrors([])
  }

  async function copyRequest(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text)
      setCopy('copied')
    } catch {
      setCopy('failed')
    }
  }

  async function handleSubmit(): Promise<void> {
    if (busy) return
    const found = validateLead(values)
    const first = ERROR_ORDER.find((key) => found[key])
    // Os erros entram no DOM antes do foco, para serem lidos com o campo.
    flushSync(() => {
      setSubmitted(true)
      setErrors(found)
      setCopy('idle')
      setStatus(first ? { kind: 'invalid' } : formServiceActive ? { kind: 'sending' } : { kind: 'mailto-before' })
    })
    if (first) {
      focusField(ERROR_TARGET[first])
      return
    }

    const dados: LeadData = {
      name: values.name,
      phone: values.phone,
      email: values.email,
      location: values.location,
      service: values.service,
      budget: values.budget,
      message: values.message,
      trap: values.trap,
    }
    // Fotografias ainda a ser reduzidas: o envio espera por elas. Se dessa preparação saírem
    // recusas (formato, tamanho, número), o envio não segue: o visitante vê-as primeiro.
    const haviaPreparacao = aPrepararRef.current > 0
    await esperarPreparacao()
    if (haviaPreparacao && recusasRef.current.length > 0) {
      // O campo volta a ficar ativo antes de receber o foco.
      flushSync(() => setStatus({ kind: 'idle' }))
      document.getElementById(IDS.photos)?.focus()
      return
    }
    const ficheiros = formAcceptsFiles ? filesRef.current : []
    const result = await submitLead(dados, ficheiros)
    if (result.mode === 'email') {
      // O site não sabe se o e-mail foi enviado: nunca mostra a mensagem de sucesso.
      setStatus({ kind: 'mailto-after', request: result.request })
      return
    }
    if (result.ok) {
      setStatus({ kind: 'success' })
      setValues(EMPTY)
      applyFiles([])
      setFileErrors([])
      setErrors({})
      setSubmitted(false)
    } else {
      setStatus({ kind: 'error', withPhotos: ficheiros.length > 0 })
    }
  }

  const hasErrors = Object.keys(errors).length > 0
  let alertMessage: string | null = null
  if (status.kind === 'error') alertMessage = status.withPhotos ? contact.states.errorWithPhotos : contact.states.error
  else if (status.kind === 'invalid' && hasErrors) alertMessage = contact.errors.summary

  let statusMessage: string | null = null
  if (status.kind === 'sending') statusMessage = contact.states.sending
  else if (status.kind === 'success') statusMessage = contact.states.success
  else if (status.kind === 'mailto-before') statusMessage = contact.states.mailtoBefore
  else if (status.kind === 'mailto-after') statusMessage = contact.states.mailtoAfter

  let copyMessage: string | null = null
  if (copy === 'copied') copyMessage = contact.states.copied
  else if (copy === 'failed') copyMessage = contact.states.copyFailed

  return (
    <form
      ref={formRef}
      data-lead-form=""
      noValidate={hydrated}
      method="dialog"
      aria-labelledby={FORM_HEADING_ID}
      onSubmit={(event) => {
        event.preventDefault()
        void handleSubmit()
      }}
      className="relative mt-6 grid gap-6"
    >
      <Honeypot id={IDS.trap} name={NAMES.trap} value={values.trap} onChange={(v) => update('trap', v)} />

      <Field id={IDS.name} label={contact.fields.name.label} error={errors.name}>
        {(a11y) => (
          <Input
            {...a11y}
            name={NAMES.name}
            autoComplete="name"
            required
            maxLength={120}
            value={values.name}
            onChange={(e) => update('name', e.currentTarget.value)}
            onBlur={() => blur('name')}
          />
        )}
      </Field>

      <fieldset className="min-w-0">
        <legend className={LABEL_CLASS}>{contact.fields.contactGroup.legend}</legend>
        <FieldError id={contactErrorId} messages={errors.contact} />
        <div className="mt-3 grid gap-4 sm:grid-cols-2 sm:gap-6">
          <Field
            id={IDS.phone}
            label={contact.fields.contactGroup.phone.label}
            error={errors.phone}
            describedBy={errors.contact ? contactErrorId : undefined}
            invalid={Boolean(errors.contact)}
          >
            {(a11y) => (
              <Input
                {...a11y}
                type="tel"
                inputMode="tel"
                name={NAMES.phone}
                autoComplete="tel"
                spellCheck={false}
                maxLength={30}
                value={values.phone}
                onChange={(e) => update('phone', e.currentTarget.value)}
                onBlur={() => blur('phone')}
              />
            )}
          </Field>
          <Field
            id={IDS.email}
            label={contact.fields.contactGroup.email.label}
            error={errors.email}
            describedBy={errors.contact ? contactErrorId : undefined}
            invalid={Boolean(errors.contact)}
          >
            {(a11y) => (
              <Input
                {...a11y}
                type="email"
                inputMode="email"
                name={NAMES.email}
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                maxLength={254}
                value={values.email}
                onChange={(e) => update('email', e.currentTarget.value)}
                onBlur={() => blur('email')}
              />
            )}
          </Field>
        </div>
      </fieldset>

      <Field
        id={IDS.location}
        label={contact.fields.location.label}
        help={contact.fields.location.help}
        error={errors.location}
      >
        {(a11y) => (
          <Input
            {...a11y}
            name={NAMES.location}
            autoComplete="address-level2"
            required
            maxLength={120}
            value={values.location}
            onChange={(e) => update('location', e.currentTarget.value)}
            onBlur={() => blur('location')}
          />
        )}
      </Field>

      <Field id={IDS.service} label={contact.fields.service.label}>
        {(a11y) => (
          <Select
            {...a11y}
            name={NAMES.service}
            value={values.service}
            onChange={(e) => update('service', e.currentTarget.value)}
          >
            <option value="">{contact.fields.service.emptyOption}</option>
            {SERVICE_OPTIONS.map((nome) => (
              <option key={nome} value={nome}>
                {nome}
              </option>
            ))}
          </Select>
        )}
      </Field>

      <Field
        id={IDS.message}
        label={contact.fields.message.label}
        help={contact.fields.message.help}
        error={errors.message}
      >
        {(a11y) => (
          <Textarea
            {...a11y}
            name={NAMES.message}
            required
            maxLength={5000}
            value={values.message}
            onChange={(e) => update('message', e.currentTarget.value)}
            onBlur={() => blur('message')}
          />
        )}
      </Field>

      <Field id={IDS.budget} label={contact.fields.budget.label} help={contact.fields.budget.help}>
        {(a11y) => (
          <Select
            {...a11y}
            name={NAMES.budget}
            value={values.budget}
            onChange={(e) => update('budget', e.currentTarget.value)}
          >
            <option value="">{contact.fields.budget.emptyOption}</option>
            {budgetRanges.options.map((intervalo) => (
              <option key={intervalo} value={intervalo}>
                {intervalo}
              </option>
            ))}
          </Select>
        )}
      </Field>

      {formAcceptsFiles ? (
        <div>
          <Field
            id={IDS.photos}
            label={contact.fields.photos.label}
            help={contact.fields.photos.help}
            describedBy={fileErrors.length > 0 ? photosErrorId : undefined}
          >
            {(a11y) => (
              <FileInput
                {...a11y}
                name={NAMES.photos}
                accept={LEAD_FILE_ACCEPT}
                files={files}
                onFilesSelected={(novos) => {
                  void addFiles(novos)
                }}
                disabled={busy}
                onRemove={removeFile}
                listLabel={contact.fields.photos.selected}
                removeLabel={contact.fields.photos.remove}
              />
            )}
          </Field>
          {/* Região viva: a preparação e as fotografias recusadas são anunciadas logo depois da escolha. */}
          <div aria-live="polite">
            {preparing > 0 ? (
              <p data-photos-preparing="" className="mt-2 text-small text-muted">
                {contact.fields.photos.preparing}
              </p>
            ) : null}
            <FieldError id={photosErrorId} messages={fileErrors} />
          </div>
        </div>
      ) : (
        <p className="max-w-texto text-small text-muted">{contact.noFilesNote}</p>
      )}

      <div>
        <Checkbox
          id={IDS.privacy}
          name={NAMES.privacy}
          required
          checked={values.privacy}
          onChange={(e) => update('privacy', e.currentTarget.checked)}
          aria-invalid={errors.privacy ? true : undefined}
          aria-describedby={joinIds(errors.privacy ? privacyErrorId : null)}
        >
          {PRIVACY_LABEL.before}
          <a href={pageHref('privacy')} className={TEXT_LINK}>
            {PRIVACY_LABEL.link}
          </a>
          {PRIVACY_LABEL.required ? <span data-required=""> {PRIVACY_LABEL.required}</span> : null}
          {PRIVACY_LABEL.after}
        </Checkbox>
        <div className="pl-9">
          <FieldError id={privacyErrorId} messages={errors.privacy} />
        </div>
      </div>

      {/* Aviso RGPD (primeira camada; Parte 5.6), antes do botão de envio. */}
      <div data-rgpd-notice="" className="grid max-w-texto gap-2 text-small text-muted">
        {contact.notice.map((bloco, i) => (
          <p key={i}>
            <RichText value={bloco} />
          </p>
        ))}
      </div>

      {/* Sem JavaScript, ou se a ilha do formulário não carregar, o formulário não envia:
          esta nota, escondida por omissão, toma o lugar do botão. Estilos no index.html
          (<noscript> e html[data-lead-failed], marca posta por src/entry-client.tsx), sem o
          atributo hidden: o Tailwind esconde-o com !important numa camada, que ganharia. */}
      <p data-lead-nojs="" className="max-w-texto text-body text-ink">
        <RichText value={contact.noJsNote} />
      </p>

      <div>
        <Button data-lead-submit="" type="submit" size="lg" block aria-disabled={busy || undefined}>
          {status.kind === 'sending' ? contact.states.sending : ui.labels.sendRequest}
        </Button>

        {/* Regiões vivas sempre presentes (vazias até haver mensagem). */}
        <FormStatus kind="alert" tone="error" className="mt-4">
          {alertMessage ? <PlainText text={alertMessage} /> : null}
        </FormStatus>
        {status.kind === 'error' ? (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href={company.phone.href} variant="secondary">
              {ui.labels.callPhone}
            </Button>
            <Button href={whatsappHref()} variant="secondary">
              {ui.labels.whatsapp}
            </Button>
          </div>
        ) : null}

        <FormStatus
          kind="status"
          tone={status.kind === 'success' ? 'success' : 'info'}
          visuallyHidden={status.kind === 'sending'}
          className="mt-4"
        >
          {statusMessage ? <PlainText text={statusMessage} /> : null}
        </FormStatus>
        {status.kind === 'mailto-after' ? (
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button
              variant="secondary"
              icon={<Copy size={20} strokeWidth={1.5} aria-hidden="true" focusable="false" />}
              onClick={() => {
                void copyRequest(status.request)
              }}
            >
              {ui.labels.copyRequest}
            </Button>
            <a href={`mailto:${company.email}`} className={cx(DETAIL_LINK, 'break-all')}>
              {company.email}
            </a>
          </div>
        ) : null}
        <FormStatus kind="status" tone={copy === 'failed' ? 'error' : 'success'} className="mt-4">
          {copyMessage ? <PlainText text={copyMessage} /> : null}
        </FormStatus>
      </div>
    </form>
  )
}

// ---------------------------------------------------------------------------
// Dados de contacto

interface DetailRowProps {
  icon: LucideIcon
  label: string
  children: ReactNode
}

/** Linha da lista com régua: ícone decorativo, rótulo e valor. */
function DetailRow({ icon: Icone, label, children }: DetailRowProps) {
  return (
    <div className="relative border-b border-line py-4 pl-10">
      <dt className="text-small text-muted">
        <Icone
          size={24}
          strokeWidth={1.5}
          aria-hidden="true"
          focusable="false"
          className="absolute top-[1.125rem] left-0 text-muted"
        />
        {label}
      </dt>
      <dd className="mt-0.5 text-body text-ink">{children}</dd>
    </div>
  )
}

function ContactDetails() {
  const d = contact.details
  const icon = company.complaintsBookIcon
  return (
    <address className="mt-4 not-italic">
      <dl className="border-t border-line md:grid md:grid-cols-2 md:gap-x-6 lg:block">
        <DetailRow icon={Phone} label={d.phoneLabel}>
          <a href={company.phone.href} className={cx(DETAIL_LINK, 'tabular')}>
            {company.phone.display}
          </a>
          <span className="block text-small text-muted">({company.phoneCallNote})</span>
        </DetailRow>

        <DetailRow icon={MessageCircle} label={d.whatsappLabel}>
          <a href={whatsappHref()} target="_blank" rel="noopener" className={DETAIL_LINK}>
            {ui.labels.whatsapp}
            <VisuallyHidden> {ui.a11y.newWindow}</VisuallyHidden>
          </a>
        </DetailRow>

        <DetailRow icon={Mail} label={d.emailLabel}>
          <a href={`mailto:${company.email}`} className={cx(DETAIL_LINK, 'break-all')}>
            {company.email}
          </a>
        </DetailRow>

        <DetailRow icon={MapPin} label={d.areaLabel}>
          {company.areaServed}
        </DetailRow>

        {company.publicAddress ? (
          <DetailRow icon={Building2} label={d.addressLabel}>
            {company.publicAddress}
          </DetailRow>
        ) : null}

        <DetailRow icon={Clock} label={d.hoursLabel}>
          <PlainText text={company.hours} />
        </DetailRow>

        {company.social.length > 0 ? (
          <DetailRow icon={Share2} label={d.socialLabel}>
            <ul className="flex flex-wrap gap-x-6">
              {company.social.map((rede) => (
                <li key={rede.network}>
                  <a href={rede.url} target="_blank" rel="noopener" className={DETAIL_LINK}>
                    {rede.label}
                    <VisuallyHidden> {ui.a11y.newWindow}</VisuallyHidden>
                  </a>
                </li>
              ))}
            </ul>
          </DetailRow>
        ) : company.socialPending ? (
          <DetailRow icon={Share2} label={d.socialLabel}>
            <PlainText text={company.socialPending} />
          </DetailRow>
        ) : null}

        <DetailRow icon={BookOpen} label={d.complaintsLabel}>
          <a href={ui.complaintsBook.url} target="_blank" rel="noopener" className={cx(DETAIL_LINK, 'gap-3')}>
            {typeof icon === 'string' ? null : (
              <img src={withBase(icon.src)} width={icon.width} height={icon.height} alt="" className="h-10 w-auto" />
            )}
            <span>{ui.complaintsBook.label}</span>
            <VisuallyHidden> {ui.a11y.newWindow}</VisuallyHidden>
          </a>
          {/* Sem o ícone oficial, fica só a ligação em texto (pendente em CONTEUDO-A-SUBSTITUIR.md). */}
        </DetailRow>
      </dl>
    </address>
  )
}

// ---------------------------------------------------------------------------
// Secção

export function Contact() {
  return (
    <Section id="contactos">
      <Container>
        <div data-reveal="">
          <SectionHeading sectionId="contactos" title={contact.heading} intro={contact.intro} />
        </div>
        <div className="mt-10 grid gap-14 lg:mt-14 lg:grid-cols-12 lg:gap-x-6">
          <div data-reveal="" className="min-w-0 lg:col-span-7">
            <h3 id={FORM_HEADING_ID} className="text-h3">
              {contact.formHeading}
            </h3>
            <LeadForm />
          </div>
          <div
            data-reveal=""
            className="min-w-0 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:col-span-4 lg:col-start-9 lg:self-start"
          >
            <h3 id={DETAILS_HEADING_ID} className="text-h3">
              {contact.detailsHeading}
            </h3>
            <ContactDetails />
          </div>
        </div>
      </Container>
    </Section>
  )
}
