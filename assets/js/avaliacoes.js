/* Avaliações Google, atualizadas à mão.
   Como atualizar:
   1. Abrir o perfil da LMDreams no Google e copiar as avaliações com `minimo` estrelas ou mais.
   2. Nome: só o primeiro nome e a inicial do apelido (por exemplo "Ana S."), como forma de minimizar dados pessoais.
   3. Texto: exatamente como está no Google; cortar só com "…" e sem mudar o sentido.
   4. Atualizar `atualizado` com a data do dia (AAAA-MM-DD).
   A secção "Avaliações" só aparece no site quando houver pelo menos uma avaliação e o link do perfil. */
window.LM_AVALIACOES = {
  // Ligação pública para o perfil no Google, onde se veem todas as avaliações
  // (por exemplo https://maps.app.goo.gl/... ou https://www.google.com/maps/place/...).
  perfil: '',
  // Estrelas mínimas para uma avaliação aparecer no site.
  minimo: 4,
  atualizado: '',
  avaliacoes: [
    // { nome: 'Ana S.', estrelas: 5, data: '2026-09', texto: 'Texto da avaliação, tal como está no Google.' },
  ],
};
