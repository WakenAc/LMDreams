/* =====================================================================
   LMDreams v1: a obra percorrida pelo scroll.
   GSAP + ScrollTrigger controlam uma linha do tempo com 13 quadros
   (capa + 12 fases). O Lenis suaviza o scroll. Sem estas bibliotecas,
   ou com "reduzir movimento" ativo, o site fica em modo empilhado.
   ===================================================================== */
(() => {
  'use strict';

  // ?imgs=outra/pasta/ permite pré-visualizar outro conjunto de imagens (só caminhos relativos simples)
  const IMG_DIR = (() => {
    const q = new URLSearchParams(location.search).get('imgs');
    return q && /^[\w-]+(\/[\w-]+)*\/$/.test(q) ? q : 'assets/img/';
  })();
  const EXTS = ['webp', 'jpg', 'jpeg', 'png'];
  const H = 1;            // duração de cada quadro parado
  const D = 1;            // duração de cada transição
  const KB = 0.05;        // zoom lento ("ken burns") durante cada quadro

  const doc = document.documentElement;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------------------------------------------------------------------
     1. Imagens: procura o ficheiro com a extensão que existir.
        Se não existir, mostra um marcador com o nome a gerar.
     ------------------------------------------------------------------- */
  const probes = new Map();
  function probe(base) {
    if (!probes.has(base)) {
      probes.set(base, new Promise((resolve) => {
        let k = 0;
        const next = () => {
          if (k >= EXTS.length) { resolve(null); return; }
          const src = `${IMG_DIR}${base}.${EXTS[k++]}`;
          const im = new Image();
          im.onload = () => resolve({ src, w: im.naturalWidth, h: im.naturalHeight });
          im.onerror = next;
          im.src = src;
        };
        next();
      }));
    }
    return probes.get(base);
  }

  function fillPlaceholder(el, base) {
    const ph = el.querySelector('.ph');
    if (!ph || ph.childElementCount) return;
    const phase = el.closest('.phase');
    const n = phase ? (phase.id === 'inicio' ? '00' : phase.id.replace('fase-', '')) : '';
    const add = (cls, text) => {
      const s = document.createElement('span');
      s.className = cls;
      s.textContent = text;
      ph.appendChild(s);
    };
    if (n) {
      // cada fase com um tom diferente, para se perceberem as transições
      const k = +n;
      ph.style.setProperty('--ph-glow', `hsla(${(28 + k * 27) % 360}, 45%, 55%, 0.2)`);
      ph.style.setProperty('--ph-pos', `${25 + ((k * 37) % 55)}% ${30 + ((k * 23) % 40)}%`);
      add('ph__n', n);
    }
    add('ph__label', 'Imagem por gerar');
    add('ph__file', `${IMG_DIR}${base}.jpg`);
  }

  function loadInto(el) {
    if (el.dataset.state) return probe(el.dataset.img);
    el.dataset.state = 'loading';
    const base = el.dataset.img;
    const img = el.querySelector('img');
    return probe(base).then((r) => {
      el.dataset.state = 'done';
      if (r) {
        img.src = r.src;
        el.dataset.w = r.w;
        el.dataset.h = r.h;
        el.classList.remove('is-missing');
      } else {
        el.classList.add('is-missing');
        fillPlaceholder(el, base);
      }
      return r;
    });
  }

  // Imagens fora da obra: carregam quando se aproximam do ecrã
  const lazyEls = [...document.querySelectorAll('[data-img]')].filter((el) => !el.closest('.journey'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { loadInto(e.target); io.unobserve(e.target); }
      });
    }, { rootMargin: '900px 0px' });
    lazyEls.forEach((el) => io.observe(el));
  } else {
    lazyEls.forEach(loadInto);
  }

  /* -------------------------------------------------------------------
     2. Menu "Percorrer a obra"
     ------------------------------------------------------------------- */
  const exploreBtn = document.querySelector('.explore__tab');
  const explorePanel = document.getElementById('explore-panel');
  function openExplore() {
    explorePanel.hidden = false;
    exploreBtn.setAttribute('aria-expanded', 'true');
  }
  function closeExplore(returnFocus) {
    if (explorePanel.hidden) return;
    explorePanel.hidden = true;
    exploreBtn.setAttribute('aria-expanded', 'false');
    if (returnFocus) exploreBtn.focus();
  }
  if (exploreBtn && explorePanel) {
    const explore = exploreBtn.parentElement;
    exploreBtn.addEventListener('click', () => (explorePanel.hidden ? openExplore() : closeExplore()));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeExplore(explore.contains(document.activeElement));
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.explore')) closeExplore();
    });
    explorePanel.addEventListener('click', (e) => { if (e.target.closest('a')) closeExplore(); });
    // fecha quando o foco do teclado sai do menu
    explore.addEventListener('focusout', (e) => {
      if (e.relatedTarget && !explore.contains(e.relatedTarget)) closeExplore();
    });
  }

  /* -------------------------------------------------------------------
     3. Serviços: a imagem acompanha o serviço sob o cursor
     ------------------------------------------------------------------- */
  const svcs = [...document.querySelectorAll('.svc')];
  const svcImgs = [...document.querySelectorAll('.services__img')];
  svcs.forEach((li, k) => {
    li.addEventListener('mouseenter', () => {
      svcs.forEach((x) => x.classList.toggle('is-on', x === li));
      svcImgs.forEach((im, j) => im.classList.toggle('is-on', j === k));
    });
  });

  /* -------------------------------------------------------------------
     4. Projetos: botões da faixa horizontal
     ------------------------------------------------------------------- */
  const strip = document.querySelector('.strip');
  const stripBtns = [...document.querySelectorAll('.strip-btn')];
  function syncStrip() {
    if (!strip) return;
    const max = strip.scrollWidth - strip.clientWidth - 2;
    stripBtns.forEach((b) => {
      // aria-disabled em vez de disabled: o botão não perde o foco do teclado
      const atEnd = +b.dataset.dir < 0 ? strip.scrollLeft <= 2 : strip.scrollLeft >= max;
      b.setAttribute('aria-disabled', String(atEnd));
    });
  }
  if (strip) {
    stripBtns.forEach((b) => b.addEventListener('click', () => {
      if (b.getAttribute('aria-disabled') === 'true') return;
      const card = strip.querySelector('.card');
      const gap = parseFloat(getComputedStyle(strip).columnGap) || 20;
      const step = card ? card.getBoundingClientRect().width + gap : strip.clientWidth * 0.8;
      strip.scrollBy({ left: step * +b.dataset.dir, behavior: reduceMotion ? 'auto' : 'smooth' });
    }));
    strip.addEventListener('scroll', syncStrip, { passive: true });
    window.addEventListener('resize', syncStrip);
    syncStrip();
  }

  /* -------------------------------------------------------------------
     4b. Projetos: janela com comparador antes/depois e galeria
     ------------------------------------------------------------------- */
  const dialog = document.getElementById('projeto-dialogo');
  const projetos = window.LM_PROJETOS || [];
  const CATEGORIAS = {
    remodelacoes: 'Remodelações',
    cozinhas: 'Cozinhas',
    'casas-de-banho': 'Casas de banho',
    interiores: 'Interiores',
    exteriores: 'Exteriores',
    construcao: 'Construção',
    recuperacao: 'Recuperação de imóveis',
  };
  const el = (tag, cls, attrs) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    Object.entries(attrs || {}).forEach(([k, v]) => n.setAttribute(k, v));
    return n;
  };
  const photo = (img, cls) => el('img', cls, {
    src: img.src, alt: img.alt, width: img.width, height: img.height, loading: 'lazy', decoding: 'async',
  });

  function comparador(antes, depois, sufixo) {
    const fig = el('figure', 'cmp');
    fig.style.setProperty('--ar', (depois.width / depois.height).toFixed(4));
    fig.style.setProperty('--nw', `${depois.width}px`); // não ampliar fotografias pequenas
    const after = photo(depois, 'cmp__after');
    const before = el('div', 'cmp__before');
    before.appendChild(photo(antes));
    const line = el('span', 'cmp__line', { 'aria-hidden': 'true' });
    const tagB = el('span', 'cmp__tag cmp__tag--b', { 'aria-hidden': 'true' });
    tagB.textContent = 'Antes';
    const tagA = el('span', 'cmp__tag cmp__tag--a', { 'aria-hidden': 'true' });
    tagA.textContent = 'Depois';
    // O controlo de teclado é um input range (invisível); o rato e o toque são tratados
    // na própria figura: tocar posiciona, arrastar na horizontal move, deslizar na vertical faz scroll.
    const range = el('input', 'cmp__range', {
      type: 'range', min: '0', max: '100', value: '50',
      'aria-label': `Comparar antes e depois${sufixo || ''}`, 'aria-describedby': 'proj-hint',
    });
    const set = () => {
      const v = +range.value;
      fig.style.setProperty('--pos', `${v}%`);
      range.setAttribute('aria-valuetext', `${v} % antes, ${100 - v} % depois`);
    };
    range.addEventListener('input', set);
    set();
    const fromX = (x) => {
      const r = fig.getBoundingClientRect();
      range.value = Math.round(Math.min(1, Math.max(0, (x - r.left) / r.width)) * 100);
      set();
    };
    let drag = null;
    fig.addEventListener('pointerdown', (e) => {
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, on: e.pointerType === 'mouse' };
      if (drag.on) {
        e.preventDefault();
        fig.setPointerCapture(e.pointerId);
        fromX(e.clientX);
      }
    });
    fig.addEventListener('pointermove', (e) => {
      if (!drag || drag.id !== e.pointerId) return;
      const dx = Math.abs(e.clientX - drag.x);
      if (!drag.on && dx > 8 && dx > Math.abs(e.clientY - drag.y)) {
        drag.on = true;
        fig.setPointerCapture(e.pointerId);
      }
      if (drag.on) fromX(e.clientX);
    });
    const end = () => { drag = null; };
    fig.addEventListener('pointerup', end);
    fig.addEventListener('pointercancel', end);
    fig.addEventListener('click', (e) => fromX(e.clientX)); // um toque chega (WCAG 2.5.7)
    fig.append(after, before, line, tagB, tagA, range);
    return fig;
  }

  function abrirProjeto(id) {
    const p = projetos.find((x) => x.id === id);
    if (!p || !dialog) return;
    dialog.querySelector('.proj__cat').textContent = CATEGORIAS[p.categoria] || '';
    dialog.querySelector('.proj__t').textContent = p.nome;
    dialog.querySelector('.proj__desc').textContent = p.descricao;
    const meta = dialog.querySelector('.proj__meta');
    meta.replaceChildren();
    [['Tipo de intervenção', p.tipoDeIntervencao], ['Localidade', p.localidade]].forEach(([k, v]) => {
      const row = el('div');
      const dt = el('dt');
      dt.textContent = k;
      const dd = el('dd');
      dd.textContent = v;
      row.append(dt, dd);
      meta.appendChild(row);
    });
    const body = dialog.querySelector('.proj__body');
    body.replaceChildren();
    if (p.antes.length) {
      const h = el('h3', 'proj__sub');
      h.textContent = 'Antes e depois';
      body.appendChild(h);
      const note = el('p', 'proj__hint', { id: 'proj-hint' });
      note.textContent = 'Toque ou arraste a linha, ou use as setas do teclado, para comparar.';
      body.appendChild(note);
      const n = p.antes.length;
      p.antes.forEach((a, i) => body.appendChild(comparador(a, p.depois[i], n > 1 ? ` (${i + 1} de ${n})` : '')));
    }
    const resto = p.depois.slice(p.antes.length);
    if (resto.length) {
      const h = el('h3', 'proj__sub');
      h.textContent = p.antes.length ? 'Mais fotografias' : 'Fotografias';
      body.appendChild(h);
      const grid = el('div', 'proj__grid');
      resto.forEach((img) => {
        const f = el('figure', 'proj__ph');
        f.appendChild(photo(img));
        grid.appendChild(f);
      });
      body.appendChild(grid);
    }
    dialog.querySelector('.proj__inner').scrollTop = 0;
    if (lenis) lenis.stop();
    doc.classList.add('has-dialog');
    dialog.showModal();
  }
  // Arrumação ao fechar. Não depende só do evento "close", que nem todos os browsers
  // disparam de forma fiável: é chamada por cada caminho de fecho e pode correr várias vezes.
  function aoFecharProjeto() {
    if (!doc.classList.contains('has-dialog')) return;
    doc.classList.remove('has-dialog');
    if (lenis) lenis.start();
  }
  function fecharProjeto() {
    if (dialog.open) dialog.close();
    aoFecharProjeto();
  }
  if (dialog) {
    document.querySelectorAll('.card__open').forEach((b) => {
      b.addEventListener('click', () => abrirProjeto(b.dataset.projeto));
    });
    dialog.querySelector('.proj__close').addEventListener('click', fecharProjeto);
    // clicar fora do painel fecha (só se o clique também começou fora, e não no 2.º clique de um duplo clique)
    let downOnBackdrop = false;
    dialog.addEventListener('pointerdown', (e) => { downOnBackdrop = e.target === dialog; });
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog && downOnBackdrop && e.detail < 2) fecharProjeto();
      downOnBackdrop = false;
    });
    dialog.addEventListener('cancel', aoFecharProjeto); // tecla Escape
    dialog.addEventListener('close', aoFecharProjeto);
  }

  /* -------------------------------------------------------------------
     5. A obra
     ------------------------------------------------------------------- */
  const journey = document.querySelector('.journey');
  const stage = journey && journey.querySelector('.stage');
  const phases = stage ? [...stage.querySelectorAll('.phase')] : [];
  const media = phases.map((p) => p.querySelector('.phase__media'));
  // Ecrãs muito baixos (telemóvel deitado, zoom de 200-400%) não têm altura para o palco:
  // ficam no modo empilhado, onde o texto nunca é cortado.
  const shortVp = matchMedia('(max-height: 539px)');
  shortVp.addEventListener('change', () => location.reload());
  const cinematic = !reduceMotion && !shortVp.matches && !!(window.gsap && window.ScrollTrigger) && phases.length > 1;

  // Carrega as imagens da obra: capa primeiro, depois as restantes
  const loaderLine = document.querySelector('.loader__line');
  let loadedCount = 0;
  const firstLoads = media.slice(0, 3).map((m) => loadInto(m).then(() => {
    loadedCount += 1;
    if (loaderLine) loaderLine.style.setProperty('--p', loadedCount / 3);
  }));
  const restLoads = Promise.all(firstLoads).then(() => Promise.all(media.slice(3).map(loadInto)));

  function reveal() {
    if (doc.classList.contains('is-loaded')) return;
    doc.classList.add('is-loaded');
    if (lenis) lenis.start();
  }

  let lenis = null;

  if (!cinematic) {
    media.forEach(loadInto);
    Promise.race([Promise.all(firstLoads), wait(1200)]).then(reveal);
    return;
  }

  /* ---------- 5.1 modo cinematográfico ------------------------------ */
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  doc.classList.add('is-cinematic');

  if (window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
    lenis.stop();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const N = phases.length;
  const TOTAL = N * H + (N - 1) * D;
  const T = (i) => i * (H + D); // início do quadro i
  journey.style.setProperty('--units', TOTAL);

  const imgs = media.map((m) => m.querySelector('img'));
  const heroAside = phases[0].querySelector('.cover__aside');
  const copy = phases.map((p, i) => (i === 0
    ? [p.querySelector('.phase__copy'), heroAside].filter(Boolean)
    : [...p.querySelectorAll('.reveal')]));
  const laser = stage.querySelector('.laser');

  // Ponto de foco (object-position) por fase: data-focus="x y" em %
  phases.forEach((p, i) => {
    if (p.dataset.focus) media[i].style.setProperty('--focus', p.dataset.focus.split(/\s+/).map((v) => `${v}%`).join(' '));
  });

  // Zoom lento encadeado: nas transições "build" e "match" (mesmo enquadramento)
  // a câmara não pode saltar, por isso o quadro seguinte começa na escala do anterior.
  const kb = [];
  phases.forEach((p, i) => {
    const chained = i > 0 && (p.dataset.trans === 'build' || p.dataset.trans === 'match');
    const from = chained ? kb[i - 1].to : 1;
    kb.push({ from, to: from + KB, start: i === 0 || chained ? T(i) : T(i) - D });
  });

  // Estado inicial
  phases.forEach((p, i) => {
    gsap.set(p, { zIndex: i + 1 });
    gsap.set(imgs[i], { scale: kb[i].from });
    if (i > 0) {
      gsap.set(media[i], { autoAlpha: 0 });
      gsap.set(copy[i], { opacity: 0, y: 40 });
    }
  });

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'none', immediateRender: false } });
  tl.set({}, {}, TOTAL);

  // Zoom lento
  phases.forEach((p, i) => {
    const k = kb[i];
    tl.fromTo(imgs[i], { scale: k.from }, { scale: k.to, duration: T(i) + H - k.start }, k.start);
  });

  // Texto: entra no fim da transição, sai no início da seguinte
  phases.forEach((p, i) => {
    if (i > 0) {
      const late = p.dataset.trans === 'aperture-out';
      tl.fromTo(copy[i], { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.42, stagger: 0.06, ease: 'power2.out',
      }, late ? T(i) - 0.16 : T(i) - 0.5);
    }
    if (i < N - 1) {
      tl.fromTo(copy[i], { opacity: 1, y: 0 }, {
        opacity: 0, y: -30, duration: 0.3, stagger: 0.03, ease: 'power1.in',
      }, T(i) + H);
    }
  });

  /* ---------- 5.2 geometria da janela (transições "aperture") ------- */
  function parseWin(str) {
    const [x, y, w, h] = (str || '50 50 20 25').split(/\s+/).map(Number);
    return { x, y, w, h };
  }
  function parseFocus(el) {
    const f = getComputedStyle(el).getPropertyValue('--focus').trim();
    if (!f) return { fx: 0.5, fy: 0.5 };
    const [a, b] = f.split(/\s+/).map((v) => parseFloat(v) / 100);
    return { fx: isNaN(a) ? 0.5 : a, fy: isNaN(b) ? 0.5 : b };
  }
  // Converte a janela (em % da imagem original) para píxeis do palco,
  // tendo em conta o recorte "cover" e o zoom lento atual da imagem.
  function windowRect(m, img, win) {
    const W = stage.clientWidth;
    const Hh = stage.clientHeight;
    const iw = +m.dataset.w || 16;
    const ih = +m.dataset.h || 9;
    const sc = Math.max(W / iw, Hh / ih);
    const rw = iw * sc;
    const rh = ih * sc;
    const { fx, fy } = parseFocus(m);
    const ox = (W - rw) * fx;
    const oy = (Hh - rh) * fy;
    const s = gsap.getProperty(img, 'scale') || 1;
    let cx = ox + (win.x / 100) * rw;
    let cy = oy + (win.y / 100) * rh;
    cx = W / 2 + (cx - W / 2) * s;
    cy = Hh / 2 + (cy - Hh / 2) * s;
    return { cx, cy, w: (win.w / 100) * rw * s, h: (win.h / 100) * rh * s, W, H: Hh };
  }
  // inset() local de um elemento escalado por q em torno de (cx, cy),
  // para que no ecrã se veja exatamente um retângulo hw x hh centrado em (cx, cy)
  function insetFor(r, hw, hh, q, radius) {
    const lw = hw / q;
    const lh = hh / q;
    const top = Math.max(0, r.cy - lh);
    const left = Math.max(0, r.cx - lw);
    const bottom = Math.max(0, r.H - (r.cy + lh));
    const right = Math.max(0, r.W - (r.cx + lw));
    return `inset(${top.toFixed(1)}px ${right.toFixed(1)}px ${bottom.toFixed(1)}px ${left.toFixed(1)}px round ${radius.toFixed(1)}px)`;
  }

  // Escala a que a janela, ampliada em torno do próprio centro, cobre o palco inteiro
  // (medida a partir do lado mais distante, para janelas fora do centro)
  function coverScale(r) {
    return Math.max(
      (2 * Math.max(r.cx, r.W - r.cx)) / r.w,
      (2 * Math.max(r.cy, r.H - r.cy)) / r.h,
    ) * 1.15;
  }

  const apertures = []; // para voltar a aplicar ao redimensionar

  /* ---------- 5.3 transições --------------------------------------- */
  const transitions = {
    // A câmara avança para a imagem seguinte
    push(cur, nxt, t0) {
      tl.fromTo(cur.m, { scale: 1 }, { scale: 1.25, duration: D, ease: 'power2.in' }, t0);
      tl.fromTo(nxt.m, { autoAlpha: 0, scale: 1.18 }, { autoAlpha: 1, scale: 1, duration: D * 0.7, ease: 'power2.out' }, t0 + D * 0.3);
      tl.set(cur.m, { autoAlpha: 0 }, t0 + D);
    },
    // Fundido com o mesmo enquadramento (maquete -> terreno real): as duas
    // imagens ficam à mesma escala para se sobreporem sem desvio
    match(cur, nxt, t0) {
      tl.fromTo(nxt.m, { autoAlpha: 0 }, { autoAlpha: 1, duration: D, ease: 'power1.inOut' }, t0);
      tl.set(cur.m, { autoAlpha: 0 }, t0 + D);
    },
    // A obra sobe: revelação de baixo para cima com a linha de laser
    build(cur, nxt, t0) {
      tl.set(nxt.m, { autoAlpha: 1 }, t0);
      tl.fromTo(nxt.m, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: D, ease: 'power1.inOut' }, t0);
      tl.set(laser, { autoAlpha: 1 }, t0);
      tl.fromTo(laser, { top: '100%' }, { top: '0%', duration: D, ease: 'power1.inOut' }, t0);
      tl.set(laser, { autoAlpha: 0 }, t0 + D);
      tl.set(cur.m, { autoAlpha: 0 }, t0 + D);
    },
    // Passagem de divisão em divisão, como quem atravessa a casa
    slide(cur, nxt, t0) {
      tl.set(nxt.m, { autoAlpha: 1 }, t0);
      tl.fromTo(nxt.m, { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: D, ease: 'power2.inOut' }, t0);
      tl.fromTo(nxt.img, { xPercent: 14 }, { xPercent: 0, duration: D, ease: 'power2.inOut' }, t0);
      tl.fromTo(cur.img, { xPercent: 0 }, { xPercent: -10, duration: D, ease: 'power2.inOut' }, t0);
      tl.set(cur.m, { autoAlpha: 0 }, t0 + D);
    },
    // Entrar pela janela: a fachada aproxima-se e o interior abre-se na janela
    aperture(cur, nxt, t0) {
      const win = parseWin(cur.p.dataset.win);
      const prox = { s: 0 };
      const apply = () => {
        const s = prox.s;
        const r = windowRect(cur.m, cur.img, win);
        const smax = coverScale(r);
        const z = Math.pow(smax, s);
        const q = 0.72 + 0.28 * s;
        const origin = `${r.cx.toFixed(1)}px ${r.cy.toFixed(1)}px`;
        gsap.set(cur.m, { scale: z, transformOrigin: origin });
        gsap.set(nxt.m, {
          scale: q,
          transformOrigin: origin,
          clipPath: insetFor(r, (r.w * z) / 2, (r.h * z) / 2, q, 6 * (1 - s)),
        });
      };
      apertures.push({ t0, apply });
      tl.set(nxt.m, { autoAlpha: 1 }, t0);
      tl.fromTo(prox, { s: 0 }, { s: 1, duration: D, ease: 'power1.inOut', onUpdate: apply }, t0);
      tl.set(cur.m, { autoAlpha: 0 }, t0 + D);
    },
    // Sair pela janela: o interior encolhe para dentro da janela da casa acabada
    'aperture-out'(cur, nxt, t0) {
      const win = parseWin(nxt.p.dataset.win);
      const prox = { s: 0 };
      const apply = () => {
        const s = prox.s;
        const r0 = windowRect(nxt.m, nxt.img, win);
        const smax = coverScale(r0);
        const z = Math.pow(smax, 1 - s);
        const q = 1 - 0.28 * s;
        const origin = `${r0.cx.toFixed(1)}px ${r0.cy.toFixed(1)}px`;
        gsap.set(nxt.m, { scale: z, transformOrigin: origin });
        gsap.set(cur.m, {
          scale: q,
          transformOrigin: origin,
          clipPath: insetFor(r0, (r0.w * z) / 2, (r0.h * z) / 2, q, 6 * s),
          // no último terço o interior dissolve-se no que se vê pela janela da casa acabada
          opacity: s < 0.65 ? 1 : 1 - (s - 0.65) / 0.35,
        });
      };
      apertures.push({ t0, apply });
      tl.set(cur.p, { zIndex: N + 1 }, t0); // acima das fases, abaixo da interface do palco
      tl.set(nxt.m, { autoAlpha: 1 }, t0);
      tl.fromTo(prox, { s: 0 }, { s: 1, duration: D, ease: 'power1.inOut', onUpdate: apply }, t0);
      tl.set(cur.m, { autoAlpha: 0 }, t0 + D);
      tl.set(cur.p, { zIndex: phases.indexOf(cur.p) + 1 }, t0 + D);
    },
  };

  for (let i = 1; i < N; i++) {
    const cur = { p: phases[i - 1], m: media[i - 1], img: imgs[i - 1] };
    const nxt = { p: phases[i], m: media[i], img: imgs[i] };
    const fn = transitions[phases[i].dataset.trans] || transitions.push;
    fn(cur, nxt, T(i - 1) + H);
  }

  /* ---------- 5.4 régua, legenda e cota ---------------------------- */
  const railNum = stage.querySelector('.rail__num');
  const railAct = stage.querySelector('.rail__act');
  const railTrack = stage.querySelector('.rail__track');
  const legend = stage.querySelector('.legend');
  const legendName = stage.querySelector('.legend__name');
  const legendSpecs = stage.querySelector('.legend__specs');
  const legendNum = stage.querySelector('.legend__num');
  const cota = stage.querySelector('.cota');
  const tickList = stage.querySelector('.cota__ticks');
  const exploreLinks = explorePanel ? [...explorePanel.querySelectorAll('a[href^="#fase-"]')] : [];

  const specsOf = (p) => {
    const el = p.querySelector('.phase__specs');
    return el ? el.lastChild.textContent.trim() : '';
  };
  const pad = (n) => String(n).padStart(2, '0');

  const ticks = phases.slice(1).map((p, k) => {
    const i = k + 1;
    const li = document.createElement('li');
    li.style.left = `${(T(i) / TOTAL) * 100}%`;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'cota__tick';
    b.setAttribute('aria-label', `Ir para a fase ${pad(i)}: ${p.dataset.name}`);
    const tip = document.createElement('span');
    tip.className = 'cota__tip';
    tip.textContent = `${pad(i)} ${p.dataset.name}`;
    tip.setAttribute('aria-hidden', 'true');
    b.appendChild(tip);
    b.addEventListener('click', () => scrollToPhase(i));
    // Escape esconde a etiqueta (WCAG 1.4.13)
    b.addEventListener('keydown', (e) => { if (e.key === 'Escape') b.classList.add('tip-off'); });
    ['blur', 'mouseleave'].forEach((ev) => b.addEventListener(ev, () => b.classList.remove('tip-off')));
    li.appendChild(b);
    tickList.appendChild(li);
    return b;
  });

  let current = -1;
  let swapTimer = 0;
  function setActive(i) {
    if (i === current) return;
    const first = current === -1;
    current = i;
    const p = phases[i];
    phases.forEach((ph, k) => ph.classList.toggle('is-active', k === i));
    stage.classList.toggle('is-cover', i === 0);
    if (railNum) railNum.textContent = pad(i);
    if (railAct) railAct.textContent = p.dataset.act || '';
    ticks.forEach((b, k) => {
      b.classList.toggle('is-current', k + 1 === i);
      b.classList.toggle('is-done', k + 1 < i);
      if (k + 1 === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
    exploreLinks.forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === `#${p.id}`));
    if (!legend || i === 0) return;
    const swap = () => {
      legendName.textContent = p.dataset.name;
      legendSpecs.textContent = specsOf(p);
      legendNum.textContent = pad(i);
      legend.classList.remove('is-swapping');
    };
    clearTimeout(swapTimer);
    if (first) { swap(); return; }
    legend.classList.add('is-swapping');
    swapTimer = setTimeout(swap, 200);
  }

  function update() {
    const time = tl.time();
    const prog = time / TOTAL;
    const idx = Math.min(N - 1, Math.max(0, Math.floor((time - H - D / 2) / (H + D)) + 1));
    setActive(idx);
    if (cota) cota.style.setProperty('--prog', prog.toFixed(4));
    if (railTrack) railTrack.style.setProperty('--rail', prog.toFixed(4));
  }
  tl.eventCallback('onUpdate', update);

  const st = ScrollTrigger.create({
    trigger: journey,
    start: 'top top',
    end: 'bottom bottom',
    animation: tl,
    scrub: 0.6,
  });

  function reapplyApertures() {
    const t = tl.time();
    apertures.forEach((a) => { if (t > a.t0 && t < a.t0 + D) a.apply(); });
  }
  ScrollTrigger.addEventListener('refresh', () => { reapplyApertures(); update(); });

  // Quando as dimensões reais das imagens chegam, a geometria das janelas muda
  restLoads.then(() => requestAnimationFrame(reapplyApertures));

  /* ---------- 5.5 navegação ---------------------------------------- */
  function scrollToY(y, immediate) {
    if (lenis) {
      const dist = Math.abs(y - window.scrollY);
      lenis.scrollTo(y, { immediate: !!immediate, duration: Math.min(2.8, 1 + dist / 5000) });
    } else {
      window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' });
    }
  }
  function scrollToPhase(i, immediate) {
    // meio do quadro parado: o texto já entrou por completo e ainda não começou a sair
    const time = i === 0 ? 0 : T(i) + H / 2;
    scrollToY(st.start + (time / TOTAL) * (st.end - st.start), immediate);
  }
  // "#obra" leva à primeira fase, não à capa
  const resolveId = (id) => (id === 'obra' ? phases[1].id : id);
  function go(id, immediate) {
    const target = resolveId(id);
    const idx = phases.findIndex((p) => p.id === target);
    if (idx >= 0) { scrollToPhase(idx, immediate); return true; }
    const el = document.getElementById(target);
    if (!el) return false;
    if (lenis) lenis.scrollTo(el, { immediate: !!immediate });
    else el.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' });
    return true;
  }
  let programmaticFocus = false;
  function focusTarget(id) {
    const el = document.getElementById(resolveId(id));
    if (!el) return;
    const target = el.querySelector('h1, h2') || el;
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    programmaticFocus = true;
    target.focus({ preventScroll: true });
    programmaticFocus = false;
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = decodeURIComponent(a.getAttribute('href').slice(1));
    if (!id || !go(id)) return;
    e.preventDefault();
    closeExplore();
    history.replaceState(null, '', `#${id}`);
    focusTarget(id);
  });

  // Teclado: ao entrar com Tab numa fase, salta logo para ela (sem esperar pelo scroll suave)
  phases.forEach((p, i) => p.addEventListener('focusin', () => {
    if (!programmaticFocus && i !== current) scrollToPhase(i, true);
  }));

  /* ---------- 5.6 arranque ----------------------------------------- */
  update();
  Promise.race([Promise.all(firstLoads), wait(2600)]).then(() => {
    ScrollTrigger.refresh();
    reveal(); // liga o Lenis antes de saltar para a âncora (parado, ignora scrollTo)
    const hash = decodeURIComponent(location.hash.slice(1));
    if (hash) go(hash, true);
  });
  window.addEventListener('load', () => ScrollTrigger.refresh());
  // Âncora alterada na barra de endereço ou com os botões retroceder/avançar
  window.addEventListener('hashchange', () => {
    const hash = decodeURIComponent(location.hash.slice(1));
    if (hash) go(hash);
  });

  function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }
})();
