# LeedTech Frontend

Frontend for the LeedTech Portal. This app provides the UI for student account visibility and one-time fee payments. It is built with Angular 21, NG Zorro, and Tailwind CSS.

## Requirements

- Node.js 20+ (recommended)
- npm 10+ (project is pinned to `npm@10.8.2`)

## Quick Start

```bash
npm install
npm start
```

App runs at `http://localhost:4200/` and reloads on file changes.

## What’s Inside

- Pages
- `home`: Landing/dashboard entry.
- `accounts`: Student account listing and actions.
- `welcome`: Lazy-loaded welcome flow.
- Core services
- `core/services/one-time-fee-payment-api.ts`: Student listing + creation for one-time payments.
- `core/services/accounts-api.ts`: Account listing and one-time payment creation.
- Shared utilities
- `shared/pipes/amount-format-pipe.ts`: Currency/amount formatting.
- Layout and navigation components live under `shared/components`.

## Project Structure

- `src/app/pages`: Feature pages and routes.
- `src/app/core`: API services and app-wide logic.
- `src/app/shared`: Reusable components and pipes.
- `src/environments`: Generated environment file.

## Environment Configuration

The build generates `src/environments/environment.generated.ts` before `start`, `build`, `watch`, and `test`.

Create a `.env` file at the repo root:

```bash
BASE_URL=https://api.example.com
```

The value is normalized (trailing slash removed) and exposed as `environment.baseUrl`.

Note: `AccountsApi` currently uses hardcoded localhost endpoints (`http://localhost:8080/...`). If you need that to respect `BASE_URL`, update `src/app/core/services/accounts-api.ts`.

## Scripts

- `npm start`: Run the dev server.
- `npm run build`: Production build to `dist/`.
- `npm run watch`: Continuous development build.
- `npm test`: Run unit tests (Vitest via Angular CLI).

## Angular CLI

```bash
ng generate component component-name
ng generate --help
```

## Tech Stack

- Angular 21
- NG Zorro (`ng-zorro-antd`)
- Tailwind CSS
- Lucide icons (`lucide-angular`)
