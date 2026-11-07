# Fausto's Grill website

Static site: `index.html`, `css/styles.css`, `js/config.js` (business data), `js/main.js` (behaviour). No build step, no dependencies. User-facing copy is Spanish from Spain (tú).

## Design and motion guidelines (required)
Before any UI change:
1. Read `PRODUCT.md` and `DESIGN.md`.
2. Follow the **impeccable** skill (`.claude/skills/impeccable/SKILL.md`), and read `.claude/skills/impeccable/reference/craft-floor.md` right before editing UI.
3. For anything that moves, follow **emil-design-eng** (`.claude/skills/emil-design-eng/SKILL.md`); use `animate`, `review-animations` or `improve-animations` skills for motion work.

Useful commands: `/impeccable audit`, `/impeccable polish`, `/impeccable critique`, `/review-animations`.

## Rules of thumb
- Content must remain visible if JS fails (`html.no-js`).
- Business data lives only in `js/config.js`.
- Never show example reviews without the "Reseñas de ejemplo" notice.
- Every animation needs a `prefers-reduced-motion` path.
