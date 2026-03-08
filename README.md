# React Matrix Table

Interactive matrix table built with **React + TypeScript + Vite**.

## Tech stack

- React 19 + TypeScript
- Vite
- React Context for state management
- Plain CSS / CSS modules (no UI libraries, no CSS-in-JS)

## Architecture

The project follows a **Feature-Sliced Design (FSD)** style layout with additional required folders:

- `src/app` – app-level composition and providers
- `src/pages` – pages/screens (`MatrixPage`)
- `src/widgets` – complex UI blocks (matrix table widget)
- `src/entities` – domain entities (matrix, cells)
- `src/shared` – shared UI, lib, context, hooks, types

## Scripts

- `npm run dev` – start dev server
- `npm run build` – typecheck and build
- `npm run preview` – preview production build
- `npm run lint` – run ESLint
- `npm test` – run Vitest test suite
- `npm run test:watch` – run tests in watch mode

## Tooling

- **Testing**: Vitest + React Testing Library (`src/shared/lib/matrix/__tests__`, `src/shared/context/__tests__`, `src/widgets/matrix-table/__tests__`)
- **Aliases** (TS + Vite):
  - `@app/*` → `src/app/*`
  - `@entities/*` → `src/entities/*`
  - `@widgets/*` → `src/widgets/*`
  - `@pages/*` → `src/pages/*`
  - `@shared/*` → `src/shared/*`
- **Git hooks** (via Husky):
  - `pre-commit`: runs `lint-staged` (`eslint` + `vitest` on staged `*.ts,*.tsx`)
  - `commit-msg`: runs `commitlint` with conventional commits
- **CI**: GitHub Actions workflow in `.github/workflows/ci.yml` (install, lint, test, build on push/PR)
- **Deploy**: `.github/workflows/deploy.yml` builds with `VITE_BASE_URL=/{repo-name}/` and deploys to **GitHub Pages**. Enable Pages in repo Settings → Pages → Source: GitHub Actions. Live URL: `https://<user>.github.io/<repo-name>/`.

## Features

- **Keyboard navigation**: focus the table (click or tab), then use **Arrow keys** to move, **Enter** or **Space** to increment the focused cell, **Escape** to clear hover highlights.
- **Persistence**: matrix state (dimensions, data, X) is saved to `localStorage` and restored on reload (debounced 400ms for high-load).
- **Edge cases**: empty matrix (M=0, N=0), single cell, X=0 (no highlights) are supported and covered by tests.
- **High-load / virtualization**: when **rows > 25**, the table body is virtualized with `@tanstack/react-virtual` so only visible rows are rendered (smooth scroll for 100×100). **Memoized** `MatrixRow` and `MatrixCell` reduce re-renders when the matrix updates.

To enable Husky locally:

```bash
npm install
npm run prepare
```

> Note: commit messages are fully under your control – just write them as usual (наприклад, `feat: add matrix interactions`) і не додавай жодних автоматичних трейлерів типу `Made-with: Cursor`.

