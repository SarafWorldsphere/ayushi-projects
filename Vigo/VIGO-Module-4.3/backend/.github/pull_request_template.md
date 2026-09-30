## What does this PR do?

<!-- 1–3 sentences. Link the issue/task if there is one. -->

## SWAIS Standards Checklist

<!-- The reviewer will verify every box. Ticking dishonestly wastes everyone's time. -->

- [ ] No hardcoded URL, IP, port, credential, or connection string anywhere in this diff
- [ ] Environment variables read ONLY in `app/config.py` (no stray `os.getenv`)
- [ ] No secret values logged — including at startup
- [ ] Routes written WITHOUT the role prefix (`/notices`, not `/api/<role>/notices`)
- [ ] Entry point still `app/main.py` (`app.main:app`); venv still `.venv/`
- [ ] `GET /health` still works
- [ ] `requirements.txt` updated if packages were added (`pip freeze`)
- [ ] `.env.example` updated if env variables were added/renamed (and team lead informed)
- [ ] `ecosystem.config.js` still correct (name, absolute paths, `interpreter: "none"`, port)
- [ ] Port matches `PORTS.md` in the engineering-standards repo
- [ ] Tested locally together with the frontend

## How was this tested?

<!-- What did you run/curl? Include the /docs or curl check you did. -->
