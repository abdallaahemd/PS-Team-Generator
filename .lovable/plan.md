
## PlayStation Random Team Generator

A polished, gaming-themed single-page experience served at `/` — replacing the current placeholder.

### What you'll see

- **Hero header** with neon glowing title "PlayStation Team Generator", subtitle, and animated PlayStation-style icon glyphs (△ ○ ✕ □) pulsing.
- **Animated particle background**: subtle floating cyan/purple dots on a deep dark-blue → purple gradient that slowly shifts.
- **Players panel** (glassmorphism card):
  - Grid of selectable player chips/cards (click to select/deselect, glowing cyan border when selected, neon purple on hover).
  - "Selected: X / Y" counter live-updates.
  - "Select all / Clear" quick actions.
  - Each player card has a small ✕ to remove it from the list.
- **Add player row**: text input + "Add" button. Trims whitespace, blocks duplicates (case-insensitive), shows a small inline toast on duplicate/empty.
- **Big "Generate Random Teams" button** with animated gradient border and glow on hover. Disabled until ≥1 player is selected.
- **On Generate**:
  - Plays a short Web Audio synth "whoosh + beep" (no asset files).
  - Shows a 1.2s loading animation (rotating neon ring + "Shuffling players…").
  - Shuffles selected players (Fisher–Yates), splits into teams of 2 (last team may be a solo).
  - Each team gets a random Arabic name from the provided 49-name list (no repeats within one generation when possible).
  - Teams appear as staggered fade/slide-in glassmorphism cards with a randomly-tinted glowing border.
- **After generation**: "Regenerate" and "Copy teams" buttons appear. Copy puts a clean text version on the clipboard and confirms with a toast.

### Default players

Abdalla, Foda, Panda 🐼, Amr Zain, Fathy, Ahmed Samy, Mohamed Wael, Mostafa Elmalek, Mohamed Khaled, Elsayed Diab, Mohab Foda, Mohamed Sanad, Saad Hamdy, Ahmed Kamal.

### Design system

Add gaming tokens to `src/styles.css`:
- Background: deep navy `oklch(0.16 0.05 270)` → purple gradient.
- Accents: neon cyan, neon purple/magenta, soft white.
- New tokens: `--neon-cyan`, `--neon-purple`, `--neon-pink`, `--glass-bg`, `--glass-border`, `--glow-cyan`, `--glow-purple`, gradient + shadow tokens.
- Keyframes: `float-particles`, `pulse-glow`, `shimmer-border`, `team-card-in`, `gradient-shift`.
- Arabic font: load Google Fonts **Cairo** (display) for team names; pair with **Orbitron** for the title and **Inter** for body.

All component colors use the new semantic tokens — no hardcoded hex.

### Responsiveness

- Mobile (≤640px): single-column player grid, stacked buttons, full-width inputs.
- Tablet: 2–3 col grid.
- Desktop: 4–5 col grid, two-column layout for results.

### Technical structure (TanStack Start)

Stays inside the existing app per your choice — vanilla JS isn't possible here, so it'll be React + TS with the same behavior:

- `src/routes/index.tsx` — replace placeholder, mount `<TeamGenerator />`. Add SEO `head()` (title, description, og tags).
- `src/components/team-generator/TeamGenerator.tsx` — top-level state (players, selected set, teams, isGenerating).
- `src/components/team-generator/PlayerCard.tsx` — selectable chip with remove button.
- `src/components/team-generator/AddPlayerInput.tsx` — input + add button + duplicate guard.
- `src/components/team-generator/TeamCard.tsx` — animated result card with Arabic name.
- `src/components/team-generator/ParticleBackground.tsx` — lightweight canvas particle field (cyan/purple dots, ~40 particles, requestAnimationFrame, respects `prefers-reduced-motion`).
- `src/components/team-generator/data.ts` — default players + Arabic team-name array (all 49 names verbatim).
- `src/lib/team-utils.ts` — `shuffle()`, `chunkIntoTeams()`, `pickRandomNames()`.
- `src/lib/sfx.ts` — Web Audio generate-sound (no external file).

Uses existing shadcn `button`, `input`, `card`, `sonner` (toasts) where it fits.

### Acceptance checklist

- [ ] Placeholder removed; `/` renders the generator.
- [ ] All 14 default players present; can add/remove; duplicates blocked.
- [ ] Selected counter accurate; Generate disabled when 0 selected.
- [ ] Teams of 2 with solo last team when odd count.
- [ ] Each team has a random Arabic name from the provided list.
- [ ] Loading animation → staggered team reveal.
- [ ] Sound on generate, Copy + Regenerate work.
- [ ] Particle background animates and pauses with reduced motion.
- [ ] Fully responsive; dark neon aesthetic; semantic tokens only.
