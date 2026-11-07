# Design

## World
**Papel de carnicería + brasa.** Kraft butcher paper as the reading ground (menu, location, contact), charcoal for the moments of fire (hero, photos, reviews, footer). One accent: ember.

## Color tokens (`css/styles.css :root`)
| Token | Hex | Use |
|---|---|---|
| `--paper` | #f2e9d8 | page ground |
| `--paper-deep` | #e7d9bf | form panel, map placeholder |
| `--ink` | #1f1814 | text on paper |
| `--ink-soft` | #5b4a3e | secondary text on paper (≥7:1) |
| `--rule` | #cdb994 | hairlines on paper |
| `--ember` | #b23a12 | accent on paper (≥5.5:1) |
| `--char` | #16110e | dark sections |
| `--on-char-soft` | #c8b49b | secondary text on charcoal (tinted, never gray) |
| `--ember-hot` | #ff7a3d | accent on charcoal |

## Type
- Display: **Gloock** (high-contrast serif, signage voice). Headings, dish names, rating number.
- Body/UI: **Hanken Grotesk** 400/500/600.
- Prices use `tabular-nums`. Fluid scale `--step--1 … --step-4`.
- No eyebrows/kickers above headings, no section numbers, no gradient text.

## Layout
- Max width 72rem, gutter `clamp(1rem, 4vw, 3rem)`, spacing scale base 4 (`--s-1 … --s-9`).
- Section head: heading left, short lede right on desktop; stacked on mobile.
- Menu: tabs + two columns of dishes with dotted leaders, like a printed carta.

## Motion (Emil Kowalski + impeccable)
- **One authored moment:** hero heading "sears" in left-to-right (clip-path + blur, 900ms, `cubic-bezier(0.16,1,0.3,1)`) over a canvas of rising embers. Embers pause offscreen/hidden and are off with reduced motion.
- Feedback: buttons `scale(0.97)` on `:active`, 140ms ease-out.
- State: menu tab indicator slides (transform, 240ms `--ease-out`); panel enters with opacity + 6px rise + 2px blur via `@starting-style`. Keyboard tab changes are instant.
- Lightbox: native `<dialog>`, scale 0.96→1 from center, exit faster than entrance.
- No scroll-reveal on every section. No `ease-in`. No `transition: all`.
- `prefers-reduced-motion`: movement removed, opacity/color feedback kept.

## Browser surfaces
Selection, focus ring, caret and scrollbar are themed in ember.
