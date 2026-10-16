## What does this PR do?

<!-- 1–3 sentences. Link the issue/task if there is one. -->

## SWAIS Standards Checklist

<!-- The reviewer will verify every box. Ticking dishonestly wastes everyone's time. -->

- [ ] No hardcoded URL, IP, port, or secret anywhere in this diff
- [ ] All data calls go through `lib/api.js` (`apiFetch` / `apiUrl`)
- [ ] Internal navigation uses `<Link>`; hrefs written WITHOUT the basePath prefix
- [ ] Routes live at `app/` root (no role-prefix folders)
- [ ] Still exactly one `next.config.js` in the repo
- [ ] `.env.example` updated if env variables were added/renamed (and team lead informed)
- [ ] `ecosystem.config.js` still correct (name, absolute paths, port)
- [ ] Port matches `PORTS.md` in the engineering-standards repo
- [ ] Tested locally together with the backend, under the path prefix

## How was this tested?

<!-- What did you run/click/curl? -->
