import { useMemo } from "react";
import { motion } from "framer-motion";
import { Trophy, Crown } from "lucide-react";

type Team = { name: string; members: string[] };

type Props = {
  teams: Team[];
  /** changes when teams regenerate so we re-shuffle the bye */
  revealKey: number;
};

function initials(name: string) {
  // works for Arabic and Latin: first two non-space chars
  const stripped = name.replace(/\s+/g, "");
  return stripped.slice(0, 2);
}

function TeamPill({ team, side }: { team: Team | null; side: "left" | "right" }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.03 }}
      className={`group flex items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]/80 p-2.5 backdrop-blur-md transition-shadow hover:shadow-[0_0_24px_-4px_var(--primary)] sm:gap-3 sm:p-3 ${
        side === "right" ? "flex-row-reverse text-right" : ""
      }`}
      style={{ minWidth: 0 }}
    >
      <div
        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white sm:h-11 sm:w-11 sm:text-xs"
        style={{
          background: "var(--gradient-primary)",
          boxShadow: "0 0 18px -2px var(--primary), inset 0 0 0 1px rgba(255,255,255,0.15)",
        }}
        dir="ltr"
      >
        {team ? initials(team.name) : "?"}
      </div>
      <div className="min-w-0 flex-1">
        <div
          dir="rtl"
          lang="ar"
          className="truncate font-arabic text-sm font-bold text-foreground sm:text-base"
        >
          {team?.name ?? "TBD"}
        </div>
        <div className="truncate text-[10px] text-muted-foreground sm:text-[11px]">
          {team ? `${team.members.length} ${team.members.length === 1 ? "player" : "players"}` : "—"}
        </div>
      </div>
    </motion.div>
  );
}

function Match({
  a,
  b,
  side,
  label,
}: {
  a: Team | null;
  b: Team | null;
  side: "left" | "right";
  label: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className={`flex items-center gap-2 ${side === "right" ? "justify-end" : "justify-start"}`}>
        <span className="rounded-full bg-[color-mix(in_oklab,var(--accent)_15%,transparent)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--accent)]">
          {label}
        </span>
      </div>
      <TeamPill team={a} side={side} />
      <div className={`flex items-center gap-1.5 px-1 ${side === "right" ? "justify-end" : "justify-start"}`}>
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
        <span className="text-[10px] font-bold text-muted-foreground">VS</span>
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
      </div>
      <TeamPill team={b} side={side} />
    </div>
  );
}

function FinalSquare({ qualified }: { qualified?: Team | null }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative mx-auto flex aspect-square w-full max-w-[180px] flex-col items-center justify-center rounded-2xl p-4 text-center"
      style={{
        background:
          "linear-gradient(135deg, #f5d061 0%, #c9a14a 50%, #8a6a1e 100%)",
        boxShadow:
          "0 0 40px -4px rgba(245, 208, 97, 0.65), inset 0 0 0 1px rgba(255,255,255,0.35)",
      }}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        animate={{ opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ boxShadow: "0 0 60px 4px rgba(245, 208, 97, 0.55)" }}
      />
      <Trophy className="h-7 w-7 text-[#3a2a06] drop-shadow sm:h-9 sm:w-9" />
      <div className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#2a1f04] sm:text-xs">
        Final
      </div>
      {qualified && (
        <div
          dir="rtl"
          lang="ar"
          className="mt-1 line-clamp-2 font-arabic text-[11px] font-bold text-[#2a1f04] sm:text-sm"
        >
          {qualified.name}
        </div>
      )}
      {qualified && (
        <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#2a1f04]/85 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#f5d061] sm:text-[9px]">
          <Crown className="h-2.5 w-2.5" /> Qualified
        </div>
      )}
    </motion.div>
  );
}

function BracketLines() {
  // Decorative SVG connector — hidden on small screens (vertical layout)
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
    >
      <defs>
        <linearGradient id="bracket-grad" x1="0" x2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.1" />
          <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <motion.path
        d="M 0 25 H 50"
        stroke="url(#bracket-grad)"
        strokeWidth="0.4"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
      <motion.path
        d="M 0 75 H 50"
        stroke="url(#bracket-grad)"
        strokeWidth="0.4"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      />
      <motion.path
        d="M 100 25 H 50"
        stroke="url(#bracket-grad)"
        strokeWidth="0.4"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
      <motion.path
        d="M 100 75 H 50"
        stroke="url(#bracket-grad)"
        strokeWidth="0.4"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      />
    </svg>
  );
}

export function TournamentBracket({ teams, revealKey }: Props) {
  // Compute bracket structure based on team count.
  const layout = useMemo(() => {
    if (teams.length === 4) {
      return {
        kind: "four" as const,
        left: { a: teams[0], b: teams[1] },
        right: { a: teams[2], b: teams[3] },
        bye: null as Team | null,
      };
    }
    if (teams.length === 3) {
      // Randomly pick which team gets the bye
      const byeIdx = Math.floor(Math.random() * 3);
      const playing = teams.filter((_, i) => i !== byeIdx);
      return {
        kind: "three" as const,
        left: { a: playing[0], b: playing[1] },
        right: null,
        bye: teams[byeIdx],
      };
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealKey, teams.length]);

  if (!layout) return null;

  return (
    <section className="mt-12">
      <div className="mb-6 text-center">
        <h2
          className="font-display text-2xl font-black tracking-tight sm:text-3xl"
          style={{ lineHeight: 1.1 }}
        >
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-primary)" }}
          >
            Tournament Bracket
          </span>
        </h2>
        <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
          {layout.kind === "four"
            ? "Semifinals → Final"
            : "One squad qualified directly to the Final"}
        </p>
      </div>

      <motion.div
        key={revealKey}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 p-5 backdrop-blur-md sm:p-8"
        style={{ boxShadow: "var(--shadow-md)" }}
      >
        <BracketLines />

        <div className="relative grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto_1fr] md:gap-4">
          {/* Left side */}
          <div>
            {layout.kind === "four" ? (
              <Match a={layout.left.a} b={layout.left.b} side="left" label="Semifinal 1" />
            ) : (
              <Match a={layout.left.a} b={layout.left.b} side="left" label="Semifinal" />
            )}
          </div>

          {/* Center final */}
          <div className="flex items-center justify-center md:px-4">
            <FinalSquare qualified={layout.kind === "three" ? layout.bye : null} />
          </div>

          {/* Right side */}
          <div>
            {layout.kind === "four" ? (
              <Match a={layout.right!.a} b={layout.right!.b} side="right" label="Semifinal 2" />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[var(--border)] p-4 text-center">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">
                  Bye
                </div>
                <TeamPill team={layout.bye} side="left" />
                <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--accent)_15%,transparent)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">
                  <Crown className="h-3 w-3" /> Qualified to Final
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
