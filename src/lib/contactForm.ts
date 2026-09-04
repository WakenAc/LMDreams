/**
 * Envio do formulário de contacto.
 *
 * O site é estático (GitHub Pages), pelo que o envio do e-mail é feito
 * por um serviço externo. A configuração vive em variáveis de ambiente,
 * o que permite trocar de serviço sem mexer nos componentes:
 *
 *   VITE_FORM_ENDPOINT    URL para onde o formulário é enviado
 *   VITE_FORM_ACCESS_KEY  chave pública do serviço (opcional)
 *
 * Por predefinição está preparado para o Web3Forms
 * (https://web3forms.com) — ver instruções no README.
 *
 * Nota: variáveis `VITE_*` são incorporadas no JavaScript publicado e
 * ficam visíveis para quem abrir o site. Só devem ser usadas para
 * chaves públicas, desenhadas para esse efeito. Nunca colocar aqui
 * palavras-passe ou chaves de API secretas — para isso é preciso uma
 * função serverless (ver README, secção "Formulário de contacto").
 */

const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT ?? "";
const ACCESS_KEY = import.meta.env.VITE_FORM_ACCESS_KEY ?? "";

/** O formulário só envia mesmo se houver um endpoint configurado. */
export const formularioAtivo = ENDPOINT.length > 0;

export type EstadoEnvio = "inativo" | "a-enviar" | "enviado" | "erro";

/** Campo-armadilha: invisível para pessoas, preenchido por robôs de spam. */
export const CAMPO_HONEYPOT = "botcheck";

export async function enviarFormulario(form: HTMLFormElement): Promise<void> {
  if (!formularioAtivo) {
    throw new Error("O formulário ainda não está ligado a um serviço de envio.");
  }

  const dados = new FormData(form);

  // Se a armadilha vier preenchida, foi um robô: fingimos sucesso e não
  // enviamos nada, para não dar pistas a quem faz spam.
  if (dados.get(CAMPO_HONEYPOT)) return;

  if (ACCESS_KEY) dados.set("access_key", ACCESS_KEY);

  // Campos que ajudam a organizar o e-mail que chega à empresa.
  dados.set("subject", `Novo pedido de orçamento — ${dados.get("nome") ?? ""}`);
  dados.set("from_name", "Website LMDreams");
  const email = dados.get("email");
  if (typeof email === "string") dados.set("replyto", email);

  const resposta = await fetch(ENDPOINT, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: dados,
  });

  if (!resposta.ok) {
    throw new Error(`O serviço de envio respondeu com o estado ${resposta.status}.`);
  }
}
