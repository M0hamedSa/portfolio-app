<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Portfolio App

Next.js 16.2.9 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint (flat config: `eslint.config.mjs`) |

No test framework is installed. No typecheck script — `npx tsc --noEmit` works.

## Conventions

- **Path alias**: `@/*` maps to project root (e.g. `@/app/layout`).
- **Tailwind v4**: Uses `@import "tailwindcss"` and `@theme` directive — not v3's `@tailwind` directives. See `postcss.config.mjs` (`@tailwindcss/postcss`).
- **ESLint**: Flat config (`eslint.config.mjs`) with `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`.
- **Fonts**: Geist Sans + Geist Mono via `next/font/google` set as CSS variables `--font-geist-sans` / `--font-geist-mono`.

## Architecture

This is a fresh `create-next-app` scaffold. Only boilerplate files exist under `app/` (`layout.tsx`, `page.tsx`, `globals.css`). No middleware, loading, error, route handlers, or API routes yet.
