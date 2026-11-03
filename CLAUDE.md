# CLAUDE.md

Project guidance (architecture, commands, SEO, contacts) lives in `../CLAUDE.md`, one level up.
This file holds the repo-specific delivery rules.

## Delivery contract

| Key | Value |
|---|---|
| Tracker | `github: Sovun/IV` |
| Setup | `npm install` |
| Verify | `npx tsc --noEmit` (healthy: no output) and `npm run lint` (healthy: `0 errors`; the `no-page-custom-font` warning in `layout.tsx` is known) |
| Branch naming | `<slug>` for untracked work; `<type>/<issue#>-<slug>` once an issue exists |
| Commit style | `Area: summary` (e.g. `Home: replace placeholder highlights with an interactive floor plan`) |
| Merge strategy | squash |
| Labels | Issue protocol defaults |
| Autonomy | `human-merge` |
