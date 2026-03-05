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
- `src/features` – user-facing features (interactions)
- `src/entities` – domain entities (matrix, cells)
- `src/shared` – shared UI, lib, config
- `src/context` – `MatrixContext` for matrix state
- `src/components` – table components (`MatrixTable`, `MatrixRow`, etc.)
- `src/hooks` – reusable hooks (`useMatrix`)
- `src/utils` – pure utilities (matrix generation, sums, percentiles, heatmap)
- `src/types` – shared TypeScript types (`Cell`, `Matrix`, ...)

## Scripts

- `npm run dev` – start dev server
- `npm run build` – typecheck and build
- `npm run preview` – preview production build
- `npm run lint` – run ESLint

CI/CD, tests, and pre-commit hooks will be added later.

