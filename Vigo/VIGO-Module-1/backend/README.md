# <project>-<role>-backend

Starter template following SWAIS Engineering Standards v1.0.

## Setup (new project checklist)

1. Rename this folder / repo: `<project>-<role>-backend` (e.g. `sgs-parent-backend`).
2. Claim your port in the Port Registry (`PORTS.md` in the infra repo) — 8000-range.
3. Create the venv — **always named `.venv`**:
   ```bash
   python3 -m venv .venv
   .venv/bin/pip install -r requirements.txt
   ```
4. `cp .env.example .env` and fill in real values.
5. Edit `ecosystem.config.js`: set name, cwd, script path, and port.
6. Run locally: `.venv/bin/uvicorn app.main:app --reload --port 8001`

## Rules baked into this template — do not undo them

- Entry point is `app/main.py` → module path **`app.main:app`** in every project. Never `main.py` at repo root.
- Venv is always `.venv/`.
- All env reading happens in `app/config.py` only. Never `os.getenv` scattered around, never hardcoded connection strings.
- Routes are written WITHOUT the role prefix (`/students`, not `/api/parent/students`) — Nginx strips the prefix before forwarding.
- `GET /health` must always exist — monitoring depends on it.
- Never log secrets, even at startup.

## Deploy (staging/production)

```bash
git pull
.venv/bin/pip install -r requirements.txt
pm2 start ecosystem.config.js   # first time
pm2 restart <app-name>          # subsequent deploys
pm2 save
```

Never hand-type `pm2 start` with inline uvicorn args, and never rely on an activated venv —
the ecosystem file uses the absolute `.venv/bin/uvicorn` path with `interpreter: "none"`.
