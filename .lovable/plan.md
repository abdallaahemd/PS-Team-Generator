## Goal

Redesign the PlayStation Team Generator into a clean, premium gaming dashboard inspired by Discord + PlayStation + modern SaaS. Reduce neon overload, fix theme consistency, strengthen hierarchy, and add proper accessibility + responsive behavior.

## 1. Design tokens (`src/styles.css`)

Rebuild the palette around the requested colors:

**Dark mode**
- `--background` #0B1020, `--card`/surface #12182B, surface-elevated #171E36
- `--foreground` #FFFFFF, `--muted-foreground` #AAB0C0
- `--primary` #6C5CE7, `--accent` #00D1FF
- `--border` rgba(255,255,255,0.08), `--ring` #6C5CE7

**Light mode**
- `--background` #F5F7FB, `--card` #FFFFFF, surface-elevated #FAFBFE
- `--foreground` #111827, `--muted-foreground` #5B6478
- `--primary` #6C5CE7, `--accent` #0099CC
- `--border` rgba(17,24,39,0.08), `--ring` #6C5CE7

Replace heavy neon glows with:
- `--shadow-sm`, `--shadow-md`, `--shadow-lg` (soft, layered, low-opacity)
- `--shadow-primary` = subtle violet halo (only used on the Generate CTA)
- `--gradient-primary` = linear 135° from primary → accent (used sparingly: CTA, selected border, headline accent)
- `--gradient-bg` = very subtle radial wash, no animated shifting

Remove/retire: `--glow-cyan/purple/pink`, `--neon-pink`, animated `gradient-shift` background, `glow-breathe`, `pulse-glow`.

Keep `--font-display` (Orbitron) for the headline only; everything else uses Inter for SaaS feel. Keep Cairo for Arabic team names.

## 2. Particle background (`ParticleBackground.tsx`)

- Read theme via `document.documentElement.classList.contains('dark')` and a `MutationObserver` on `class` so it restyles live on toggle.
- Dark: small dots in primary/accent at ~25% alpha, fewer particles (~35), subtle drift.
- Light: same positions, near-white with primary tint at ~12% alpha so they read as soft texture, not glowing dots.
- Honor `prefers-reduced-motion`: render a single static frame, no `requestAnimationFrame` loop, and skip on resize re-paint loop.
- Add `tabindex="-1"` and `aria-hidden`.

## 3. PlayerCard (`PlayerCard.tsx`)

- Convert to compact pill: `rounded-xl`, surface bg, 1px border, `shadow-sm` on hover only.
- Selected: gradient border via `padding-box`/`border-box` trick (background-image of `--gradient-primary` on a wrapper, inner surface fill) — no glow.
- Hover: `transform: scale(1.02)` + slightly brighter surface.
- Checkbox icon: lucide `Check` inside a small rounded square that fills with `--primary` when selected; empty bordered square otherwise.
- Remove `X` button: visible on hover (desktop) AND always visible on touch (`@media (hover: none)`) so mobile users can delete.
- Focus-visible: `outline: 2px solid var(--ring); outline-offset: 2px`. Make the card a real `<button>` for keyboard accessibility (Space/Enter toggles); the X stays a nested button with `stopPropagation`.

## 4. TeamCard (`TeamCard.tsx`)

- Replace neon border + radial wash with: surface bg, 1px border, `shadow-md`, top accent strip (4px) using a single per-team color drawn from `[primary, accent, primary→accent gradient]`.
- Team name: keep Arabic font + RTL, but color = `--foreground`, with a smaller colored "Team N" eyebrow above using the accent color. Drop `text-shadow` glow.
- Member rows: subtle surface-elevated bg, no gradient chips. P1/P2 badge = small rounded square with `--primary` tint.
- Keep `team-card-in` entry animation (fade + translate, no blur), respect `prefers-reduced-motion`.

## 5. TeamGenerator layout (`TeamGenerator.tsx`)

**Header**
- Left: small logo block (gradient square w/ Sparkles icon) + "PS Team Generator" wordmark (Orbitron, normal-case, tracking-tight). Subtitle line "Random multiplayer squads" in muted-foreground.
- Right: theme toggle as a modern pill-style switch (track + thumb with sun/moon), not a red button. Use `Switch` from shadcn or a custom 44px-wide toggle. Proper `aria-label` and `aria-pressed`.
- Remove the four PlayStation glyph row OR shrink to a single small monochrome decoration in the logo area.

**Players panel**
- `rounded-2xl`, surface card, `shadow-md`, generous padding (p-6 sm:p-8).
- Header row: title + selected count badge (subtle primary tint, not neon). Select all / Clear as `ghost` buttons with proper focus rings.
- Grid: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`, `gap-3`. On mobile (<400px), still 2 columns but smaller padding.
- Add-player row: Input + Button align cleanly; on mobile they stack with full width. Input uses surface-elevated bg, focused state shows `--ring` outline.

**Generate CTA**
- Large centered button: `h-14`, `px-10`, `rounded-2xl`, `--gradient-primary` background, white text, soft `--shadow-primary` halo, hover `translateY(-1px)` + slightly stronger shadow. No animated breathing glow. Sparkles icon left.
- Disabled: 40% opacity, no transform.

**Post-generate actions**
- Regenerate: secondary button = solid `--primary` bg, white text.
- Copy: outline button with primary text + 1px primary border, hover = primary tint bg. Both clearly readable in both themes.

**Teams grid**
- `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, `gap-5`.

**Footer**: keep tagline, muted-foreground, smaller.

## 6. Accessibility pass

- Global `*:focus-visible` rule in styles.css: `outline: 2px solid var(--ring); outline-offset: 2px; border-radius: inherit;`. Remove ring conflicts on shadcn `Button` (override variants if needed).
- All interactive elements: native `<button>` or `<input>`, no `<div onClick>` without role/tabindex.
- Player cards: `<button type="button" aria-pressed={selected}>`.
- Theme toggle: `aria-label="Switch to light/dark mode"` + `aria-pressed`.
- Color contrast: verify primary/accent text on surfaces meets WCAG AA in both themes (white #FFF on #6C5CE7 = AA pass; #6C5CE7 on #F5F7FB ≈ 5.3:1 pass).

## 7. Responsive

- Test at 360, 414, 768, 1024, 1440. Header collapses cleanly (toggle becomes icon-only <640px). Players grid scales as above. CTA stays centered, full-width minus gutter on mobile.
- Use `clamp()` for hero size: `clamp(1.75rem, 4vw + 1rem, 3rem)`.

## Files touched

- `src/styles.css` — full token rewrite, drop neon glows, add new shadows/gradients, global focus-visible.
- `src/components/team-generator/TeamGenerator.tsx` — layout, header/toggle, CTA, action buttons.
- `src/components/team-generator/PlayerCard.tsx` — pill redesign, button semantics, focus, gradient-border selected state.
- `src/components/team-generator/TeamCard.tsx` — calmer styling, accent strip.
- `src/components/team-generator/ParticleBackground.tsx` — theme-aware repaint, reduced-motion static frame.
- `src/routes/index.tsx` — minor (toggle wiring stays the same).

No business logic changes (data, shuffling, sound, copy text remain identical).
