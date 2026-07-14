# LMDreams — Website Institucional

Website institucional moderno, premium e totalmente responsivo para a **LMDreams**, empresa portuguesa de construção civil com mais de 20 anos de experiência.

> **Construído com:** React 19 • TypeScript • Vite • Tailwind CSS v4

---

## Visão geral

Landing page completa que comunica os valores da LMDreams: **experiência, especialização, qualidade e transparência**. O design foi cuidadosamente desenvolvido para posicionar a empresa como uma referência séria e competente no setor da construção civil em Portugal.

### Secções

1. **Hero** — Apresentação impactante com mensagem central e CTAs
2. **Sobre nós** — História, valores e diferenciação
3. **Diferenciação** — Cartões visuais com o conceito "especialistas, não faz-tudo"
4. **Serviços** — Grelha completa de 16 especialidades com pesquisa
5. **Método de trabalho** — Timeline transparente de 8 etapas
6. **Projetos** — Portfólio filtrável por categoria
7. **Transparência** — Secção dedicada à honestidade e comunicação
8. **Testemunhos** — Placeholders para opiniões reais de clientes
9. **CTA** — Chamada para ação final
10. **Contactos** — Formulário completo + dados de contacto
11. **Rodapé** — Links, contactos e informações legais

---

## Instalação e execução local

```bash
# 1. Clonar o repositório
git clone https://github.com/[seu-utilizador]/lmdreams-website.git
cd lmdreams-website

# 2. Instalar dependências
npm install

# 3. Iniciar servidor de desenvolvimento
npm run dev

# 4. Abrir no navegador
# http://localhost:5173
```

### Comandos disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia servidor de desenvolvimento (Vite) |
| `npm run build` | Gera build de produção em `dist/` |
| `npm run preview` | Pré-visualiza a build de produção localmente |
| `npm run typecheck` | Verifica tipos TypeScript |

---

## Publicação no GitHub Pages

### Opção 1 — Automática (GitHub Actions recomendada)

1. Crie um repositório no GitHub e faça push do código para a branch `main`
2. O workflow em `.github/workflows/deploy.yml` faz o deploy automático
3. No repositório GitHub, vá a **Settings > Pages** e selecione:
   - **Source:** GitHub Actions
4. O site fica disponível em `https://[seu-utilizador].github.io/lmdreams-website/`

### Opção 2 — Manual

```bash
npm run build
# Envie o conteúdo da pasta dist/ para a branch gh-pages
npx gh-pages -d dist
```

### Domínio personalizado

1. Crie um ficheiro `CNAME` na raiz do projeto com o seu domínio (ex: `lmdreams.pt`)
2. Configure os registos DNS do seu domínio para apontar para GitHub Pages
3. Em **Settings > Pages** do repositório, insira o domínio personalizado

### Configuração do base path

Se publicar num subdiretório (ex: `https://user.github.io/lmdreams-website/`), o GitHub Action em `.github/workflows/deploy.yml` define automaticamente a variável `VITE_BASE_PATH` com o nome do repositório.

Se usar um domínio personalizado, a variável `VITE_BASE_PATH` deve ser `/` (valor padrão).

---

## Estrutura do projeto

```
lmdreams-website/
├── public/
│   ├── 404.html              # Página 404 personalizada
│   ├── favicon.svg            # Favicon
│   ├── robots.txt             # Instruções para motores de busca
│   └── sitemap.xml            # Sitemap XML
├── src/
│   ├── components/
│   │   ├── Header.tsx         # Cabeçalho fixo com navegação
│   │   ├── Hero.tsx           # Secção inicial
│   │   ├── About.tsx          # Sobre a empresa
│   │   ├── Differentiation.tsx # Cartões de diferenciação
│   │   ├── Services.tsx       # Grelha de serviços
│   │   ├── WorkMethod.tsx     # Método de trabalho (timeline)
│   │   ├── Portfolio.tsx      # Portfólio filtrável
│   │   ├── Transparency.tsx   # Secção transparência
│   │   ├── Testimonials.tsx   # Testemunhos (placeholders)
│   │   ├── CtaSection.tsx     # Chamada para ação
│   │   ├── Contact.tsx        # Formulário de contacto
│   │   └── Footer.tsx         # Rodapé
│   ├── data/
│   │   └── services.ts        # Dados dos serviços e portfólio
│   ├── hooks/
│   │   └── useInView.ts       # Hook de animação por scroll
│   ├── App.tsx                # Componente principal
│   ├── index.css              # Estilos globais + design tokens
│   └── main.tsx               # Ponto de entrada
├── .github/workflows/
│   └── deploy.yml             # GitHub Actions para deploy
├── index.html                 # HTML principal com meta tags e SEO
├── vite.config.ts             # Configuração Vite
├── tsconfig.json              # Configuração TypeScript
└── package.json               # Dependências e scripts
```

---

## Personalização

### Conteúdo a substituir antes da publicação

O website está preparado com placeholders claramente identificados para os seguintes conteúdos:

| Localização | Placeholder | Descrição |
|---|---|---|
| `index.html` | `[___NÚMERO DE TELEFONE___]` | Telefone da empresa (várias ocorrências) |
| `index.html` | `[___EMAIL___]` | E-mail da empresa |
| `src/components/Contact.tsx` | `[___NÚMERO DE TELEFONE___]` | Telefone nos contactos |
| `src/components/Contact.tsx` | `[___NÚMERO DE WHATSAPP___]` | Número WhatsApp |
| `src/components/Contact.tsx` | `[___EMAIL___]` | E-mail nos contactos |
| `src/components/Contact.tsx` | `[___ÁREA DE ATUAÇÃO___]` | Área geográfica de atuação |
| `src/components/CtaSection.tsx` | `[tel:___NÚMERO___]` | Link telefónico |
| `src/components/CtaSection.tsx` | `[whatsapp:___NÚMERO___]` | Link WhatsApp |
| `src/components/Footer.tsx` | `[___NÚMERO DE TELEFONE___]` | Telefone no rodapé |
| `src/components/Footer.tsx` | `[___NÚMERO DE WHATSAPP___]` | WhatsApp no rodapé |
| `src/components/Footer.tsx` | `[___EMAIL___]` | E-mail no rodapé |
| `src/components/Footer.tsx` | `[___ÁREA DE ATUAÇÃO___]` | Área no rodapé |
| `src/components/Hero.tsx` | `[tel:___NÚMERO___]` | Botão de ligação rápida |
| `src/components/Hero.tsx` | `[whatsapp:___NÚMERO___]` | Botão WhatsApp rápido |
| `src/components/About.tsx` | `[Fotografia da equipa..]` | Imagem real da empresa |
| `src/components/Portfolio.tsx` | `[Fotografia antes/depois]` | Imagens reais de projetos |
| `src/data/services.ts` | `[Localidade]`, `[Breve descrição...]` | Dados dos projetos |
| `src/components/Testimonials.tsx` | `[Testemunho a substituir...]` | Opiniões reais de clientes |
| `index.html` (JSON-LD) | `[___NÚMERO DE TELEFONE___]` | Structured data |

### Cores e design

O sistema de design está centralizado em `src/index.css` usando variáveis CSS Tailwind v4 `@theme`:

- **`brand-*`** — Paleta principal (cinzas e pretos)
- **`stone-*`** — Tons de pedra/areia
- **`accent-*`** — Cor de destaque (cobre/terracota)

Para alterar a cor de destaque, modifique a paleta `accent-*` no `@theme`:

```css
/* Exemplo: alterar para dourado envelhecido */
--color-accent-600: #b8944a;
--color-accent-500: #d4b06a;
```

### Tipografia

O website usa:

- **Títulos:** [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) — elegante e forte
- **Corpo:** [Inter](https://fonts.google.com/specimen/Inter) — limpa e legível

As fontes estão importadas no `index.html` via Google Fonts.

---

## Funcionalidades

- **Totalmente responsivo** — Computador, tablet e telemóvel
- **Animações suaves** — Fade-in ao scroll com IntersectionObserver
- **Navegação fluída** — Scroll suave para âncoras
- **Pesquisa de serviços** — Filtro em tempo real na grelha de serviços
- **Portfólio filtrável** — Navegação por categorias de projeto
- **Formulário de contacto** — Preparado para integração futura com API (EmailJS, Formspree, etc.)
- **SEO completo** — Meta tags, Open Graph, JSON-LD, sitemap, robots.txt
- **Acessibilidade** — Navegação por teclado, labels, contraste, leitores de ecrã
- **Performance** — Lazy loading, animações com `prefers-reduced-motion`, build otimizado
- **GitHub Pages** — Deploy automático via GitHub Actions
- **Página 404** — Personalizada

---

## Formulário de contacto

O formulário está preparado para ser ligado a um serviço de envio de e-mails. Por padrão, os dados são registados na consola (`console.log`).

Para integrar com um serviço real:

**Opção 1 — EmailJS**

```tsx
// Em src/components/Contact.tsx, no handleSubmit:
import emailjs from '@emailjs/browser';

emailjs.send(
  'YOUR_SERVICE_ID',
  'YOUR_TEMPLATE_ID',
  formData,
  'YOUR_PUBLIC_KEY'
);
```

**Opção 2 — API própria**

Crie um endpoint e faça fetch no `handleSubmit`:

```tsx
const response = await fetch('https://sua-api.com/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});
```

**Opção 3 — Formspree**

Altere o `action` do formulário para `https://formspree.io/f/YOUR_FORM_ID`.

---

## Licença

Este projeto é propriedade da LMDreams. Todos os direitos reservados.

---

*Website desenvolvido para apresentação institucional da LMDreams — Construção Civil e Remodelações em Portugal.*
