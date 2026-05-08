## Changes to `src/components/team-generator/TeamGenerator.tsx`

1. **Fix Regenerate & Copy buttons text visibility** — replace the `variant="outline"` Buttons with solid neon-styled buttons (white foreground on saturated neon background, no transparent fill). Use `bg-[var(--neon-purple)] text-white` and `bg-[var(--neon-cyan)] text-[oklch(0.13_0.05_270)]` so labels are crisp.

2. **Make "Team Generator" headline more visible** — apply the same neon gradient + glow currently used on "PlayStation" to the second line so both lines pop, and bump weight/size slightly.

3. **Remove the subtitle paragraph** ("Pick your squad…").

4. **Add a Dark Mode toggle** (labelled "Dark Mode Operation") in the header area:
   - New `Sun` / `Moon` icon button (top-right of hero)
   - Toggles the `dark` class on the root wrapper via state lifted into `src/routes/index.tsx` (or local state with a `useState` + conditional className)
   - Default: dark (current look)
   - When light mode: switch background gradient + glass tokens to a lighter palette so text/contrast remains readable

5. **Color audit for both modes** in `src/styles.css`:
   - Verify `:root` (light) has working neon tokens on a light backdrop (currently neon tokens are only tuned for dark)
   - Add light-mode `--gradient-bg`, `--glass-bg`, `--glass-border` overrides
   - Ensure foreground/muted-foreground contrast passes against both backdrops

## Files touched
- `src/components/team-generator/TeamGenerator.tsx` — button styles, header changes, theme toggle UI
- `src/routes/index.tsx` — lift dark/light state, conditionally apply `dark` class
- `src/styles.css` — light-mode overrides for gradient/glass tokens

No logic changes to team generation, players, or sound.