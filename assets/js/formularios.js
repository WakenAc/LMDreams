/* =====================================================================
   Formulários do site: pedido de orçamento (index.html, #contactos) e
   candidatura (trabalhe-connosco/#candidatura, o mesmo para todas as
   vagas). Validam no navegador e enviam para
   uma aplicação Web do Google Apps Script, que grava cada pedido numa
   folha de cálculo (docs/formularios/apps-script/).

   O envio é um pedido "simples" (corpo URLSearchParams, sem cabeçalhos
   próprios): o Apps Script não responde à verificação prévia do CORS.
   Sem JavaScript, os formulários não enviam: a nota <noscript> indica o
   telefone e o e-mail. O site não guarda nada no navegador.
   ===================================================================== */
(() => {
  'use strict';

  // Endereço da aplicação Web do Apps Script. É público por natureza (está no código do site);
  // a proteção contra abusos está no próprio script. O scripts/verificar.cjs bloqueia a
  // publicação enquanto estiver vazio.
  const ENDPOINT = 'https://script.google.com/macros/s/AKfycbzksuGzD1kQ3-57alP6mLUZ7TkAj6tmsz3c3Mcijf2NsEPLMQlSCDR1ohlTyXOU5Prt/exec';
  const LIMITE_MS = 15000;

  const TELEFONE_ESCRITO = '+351 919 233 372 (chamada para a rede móvel nacional)';
  const EMAIL = 'mendes3pm@gmail.com';
  const MENSAGENS = {
    enviar: 'A enviar…',
    sucesso: {
      orcamento: 'Obrigado. Recebemos o seu pedido e respondemos no prazo máximo de 8 dias úteis.',
      candidatura: 'Obrigado. Recebemos a sua candidatura. Vamos analisá-la e entrar em contacto consigo pelo telefone que indicou.',
    },
    erro: `Não foi possível enviar. Tente novamente ou contacte-nos pelo ${TELEFONE_ESCRITO} ou por e-mail para ${EMAIL}.`,
    indisponivel: `De momento não é possível enviar pelo formulário. Contacte-nos pelo ${TELEFONE_ESCRITO} ou por e-mail para ${EMAIL}.`,
    resumo: 'Há campos por preencher ou a corrigir. Veja as indicações em cada campo.',
    campos: {
      nome: 'Indique o seu nome.',
      contacto: 'Indique um telefone ou um e-mail.',
      telefone: 'O telefone não parece válido. Exemplo: 912 345 678.',
      telefoneObrigatorio: 'Indique o seu telefone.',
      email: 'O e-mail não parece válido. Exemplo: nome@exemplo.pt.',
      localidade: 'Indique a localidade da obra (pelo menos 2 caracteres).',
      servico: 'Escolha o tipo de serviço.',
      inicio: 'Indique quando pretende começar a obra.',
      descricao: 'Descreva a obra em poucas palavras (pelo menos 10 caracteres).',
      profissao: 'Escolha a sua profissão.',
      zona: 'Indique a zona onde pode trabalhar (pelo menos 2 caracteres).',
      experiencia: 'Indique os anos de experiência.',
      disponibilidade: 'Indique a sua disponibilidade.',
      privacidade: 'Confirme que tomou conhecimento da Política de privacidade.',
    },
  };

  const telefoneValido = (v) => /^\+?\d{9,15}$/.test(v.replace(/[\s().-]/g, ''));
  const emailValido = (v) => v.length <= 254 && /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(v);

  /** Erros do formulário: { nomeDoCampo: mensagem }. */
  function validar(form) {
    const tipo = form.dataset.formulario;
    const valor = (nome) => (form.elements[nome] ? String(form.elements[nome].value).trim() : '');
    const erros = {};
    const obrigatorios = tipo === 'orcamento'
      ? ['nome', 'localidade', 'servico', 'inicio']
      : ['nome', 'profissao', 'zona', 'experiencia', 'disponibilidade'];
    for (const nome of obrigatorios) if (!valor(nome)) erros[nome] = MENSAGENS.campos[nome];
    // Os mesmos mínimos do Codigo.gs (TAMANHOS): o que o site aceita, o script também aceita.
    for (const nome of ['nome', 'localidade', 'zona']) {
      if (form.elements[nome] && valor(nome) && valor(nome).length < 2) erros[nome] = MENSAGENS.campos[nome];
    }

    const telefone = valor('telefone');
    if (tipo === 'candidatura' && !telefone) erros.telefone = MENSAGENS.campos.telefoneObrigatorio;
    else if (telefone && !telefoneValido(telefone)) erros.telefone = MENSAGENS.campos.telefone;
    if (tipo === 'orcamento') {
      const email = valor('email');
      if (email && !emailValido(email)) erros.email = MENSAGENS.campos.email;
      if (!telefone && !email) erros.contacto = MENSAGENS.campos.contacto;
      if (valor('descricao').length < 10) erros.descricao = MENSAGENS.campos.descricao;
    }
    if (!form.elements.privacidade.checked) erros.privacidade = MENSAGENS.campos.privacidade;
    return erros;
  }

  function mostrarErros(form, erros) {
    for (const el of form.querySelectorAll('[data-erro]')) {
      const nome = el.dataset.erro;
      el.textContent = erros[nome] || '';
      el.hidden = !erros[nome];
    }
    for (const campo of form.querySelectorAll('input, select, textarea')) {
      if (!campo.name || campo.type === 'hidden' || campo.closest('.form__armadilha')) continue;
      const comErro = Boolean(erros[campo.name] || (campo.dataset.grupo && erros[campo.dataset.grupo]));
      if (comErro) campo.setAttribute('aria-invalid', 'true');
      else campo.removeAttribute('aria-invalid');
    }
  }

  function primeiroComErro(form, erros) {
    for (const campo of form.querySelectorAll('input, select, textarea')) {
      if (erros[campo.name] || (campo.dataset.grupo && erros[campo.dataset.grupo])) return campo;
    }
    return null;
  }

  // A região de estado está sempre no DOM (role="status"): mudar o texto é anunciado pelos leitores de ecrã.
  function estado(form, texto, tipo) {
    const el = form.querySelector('[data-estado]');
    el.textContent = texto || '';
    el.dataset.tipo = tipo || '';
  }

  async function enviar(form, inicio) {
    const dados = new URLSearchParams();
    dados.set('formulario', form.dataset.formulario);
    for (const campo of form.querySelectorAll('input, select, textarea')) {
      if (!campo.name || campo.name === 'privacidade') continue;
      const v = String(campo.value).trim();
      if (v) dados.set(campo.name, v);
    }
    dados.set('privacidade', form.elements.privacidade.checked ? 'sim' : 'nao');
    // Tempo de preenchimento: desde o primeiro toque no formulário ou, se não houve (formulário
    // preenchido pelo navegador), desde que a página abriu.
    dados.set('t', String(Math.round(inicio ? performance.now() - inicio : performance.now())));

    const controlador = new AbortController();
    const limite = setTimeout(() => controlador.abort(), LIMITE_MS);
    try {
      const resposta = await fetch(ENDPOINT, { method: 'POST', body: dados, signal: controlador.signal, cache: 'no-store' });
      if (!resposta.ok) return { ok: false };
      const json = await resposta.json().catch(() => null);
      return json && typeof json === 'object' ? json : { ok: false };
    } catch {
      return { ok: false };
    } finally {
      clearTimeout(limite);
    }
  }

  // As páginas das vagas ligam para o formulário de candidatura com ?vaga=<slug>: a profissão
  // dessa vaga (a opção com data-vaga igual) fica já escolhida. O resto do formulário não muda.
  function escolherVaga(form) {
    const vaga = new URLSearchParams(location.search).get('vaga');
    if (!vaga) return;
    for (const opcao of form.querySelectorAll('option[data-vaga]')) {
      if (opcao.dataset.vaga === vaga) opcao.selected = true;
    }
  }

  function iniciar(form) {
    escolherVaga(form);
    if (!ENDPOINT) {
      // Sem endereço: o botão fica escondido e aparece a nota com o telefone e o e-mail.
      form.dataset.indisponivel = '';
      return;
    }
    form.dataset.ativo = '';
    form.noValidate = true;
    const botao = form.querySelector('[type="submit"]');
    let inicio = 0;
    let tentado = false;
    // Durante o envio, o botão fica com aria-disabled (e não disabled), para não perder o foco do teclado.
    let enviando = false;
    form.addEventListener('focusin', () => { if (!inicio) inicio = performance.now(); });
    form.addEventListener('input', () => { if (tentado) mostrarErros(form, validar(form)); });
    form.addEventListener('change', () => { if (tentado) mostrarErros(form, validar(form)); });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (enviando) return;
      tentado = true;
      const erros = validar(form);
      mostrarErros(form, erros);
      if (Object.keys(erros).length) {
        estado(form, MENSAGENS.resumo, 'erro');
        const alvo = primeiroComErro(form, erros);
        if (alvo) alvo.focus();
        return;
      }
      enviando = true;
      botao.setAttribute('aria-disabled', 'true');
      estado(form, MENSAGENS.enviar, 'info');
      const resposta = await enviar(form, inicio);
      enviando = false;
      botao.removeAttribute('aria-disabled');
      if (resposta.ok === true) {
        form.reset();
        tentado = false;
        inicio = 0;
        mostrarErros(form, {});
        estado(form, MENSAGENS.sucesso[form.dataset.formulario], 'sucesso');
      } else if (resposta.codigo === 'invalido' && Array.isArray(resposta.campos) && resposta.campos.length) {
        // O script recusou campos que o navegador aceitou: mostra-os como os erros do navegador.
        const doServidor = {};
        for (const nome of resposta.campos) {
          doServidor[nome] = MENSAGENS.campos[nome] || MENSAGENS.campos[`${nome}Obrigatorio`] || MENSAGENS.resumo;
        }
        mostrarErros(form, doServidor);
        estado(form, MENSAGENS.resumo, 'erro');
        const alvo = primeiroComErro(form, doServidor);
        if (alvo) alvo.focus();
      } else if (resposta.codigo === 'indisponivel') {
        estado(form, MENSAGENS.indisponivel, 'erro');
      } else {
        estado(form, MENSAGENS.erro, 'erro');
      }
    });
  }

  document.querySelectorAll('form[data-formulario]').forEach(iniciar);
})();
