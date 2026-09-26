import { company } from '../content/company'

/** Ligação de WhatsApp só com a mensagem genérica (nunca dados do formulário; Parte 3.8). */
export function whatsappHref(): string {
  return `https://wa.me/${company.whatsapp.number}?text=${encodeURIComponent(company.whatsapp.message)}`
}
