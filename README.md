# CCP NEXATECH — Portfolio

Site institucional e portfólio da **CCP NEXATECH** (CNPJ 59.691.989/0001-70).

> Tecnologia que transforma negócios.

---

## Stack

- **Next.js 14** — App Router + Server Components
- **TailwindCSS** — Design tokens centralizados em `tailwind.config.ts`
- **Framer Motion** — Animações de entrada e transição
- **TypeScript** — Strict mode
- **Vercel** — Deploy contínuo via GitHub

---

## Início rápido

```bash
# 1. Instalar dependências
npm install

# 2. Rodar em desenvolvimento
npm run dev

# 3. Acessar
# http://localhost:3000
```

---

## Estrutura

```
nexatech/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Layout raiz + SEO global
│   ├── page.tsx            # Home page
│   ├── sitemap.ts          # Sitemap dinâmico
│   └── robots.ts           # robots.txt
├── components/
│   ├── sections/           # Seções da home
│   └── ui/                 # Componentes reutilizáveis
├── templates/              # Projetos template do portfólio
├── lib/                    # Utilitários (cn, etc.)
├── styles/                 # globals.css com design tokens
└── tailwind.config.ts      # Tokens centralizados
```

---

## Design System

Consulte `docs/nexatech-design-system-v1.docx` para a referência completa de cores, tipografia, tokens, componentes e diretrizes de motion.

---

## Deploy

O projeto está configurado para deploy automático na **Vercel**.
Qualquer push na branch `main` dispara o pipeline de CI/CD.

---

## Licença

Proprietário — CCP NEXATECH LTDA · CNPJ 59.691.989/0001-70
