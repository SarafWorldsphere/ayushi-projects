# <project>-<role>-frontend

Starter template following SWAIS Engineering Standards v1.0.

## Setup (new project checklist)

1. Rename this folder / repo: `<project>-<role>-frontend` (e.g. `sgs-parent-frontend`).
2. Claim your port in the Port Registry (`PORTS.md` in the infra repo) — 3000-range.
3. `cp .env.example .env.local` and fill in real values.
4. Edit `ecosystem.config.js`: set name, cwd, and PORT to match steps 1–2.
5. `npm install && npm run dev` — app runs at `http://localhost:3000/<role>` (basePath applies in dev too).

## Rules baked into this template — do not undo them

- **One** `next.config.js`. Never add a `.mjs`/`.ts` twin.
- Routes live at `app/` root — the role prefix comes from `basePath`, never from folder nesting.
- ALL API calls go through `lib/api.js`. Never `fetch("http://...")` in a component.
- Internal links use `<Link>`, never `<a>`.
- `NEXT_PUBLIC_*` env values are baked at **build time** — after changing them run `npm run build`, a restart is not enough.

## Deploy (staging/production)

```bash
git pull
npm install
npm run build
pm2 start ecosystem.config.js   # first time
pm2 restart <app-name>          # subsequent deploys
pm2 save
```

Never hand-type a `pm2 start` command with inline args.
