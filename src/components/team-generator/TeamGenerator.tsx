import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Copy, RefreshCw, Sparkles, Plus, Users, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ARABIC_TEAM_NAMES, DEFAULT_PLAYERS } from "./data";
import { chunkIntoTeams, pickRandomNames, shuffle } from "@/lib/team-utils";
import { playGenerateSound } from "@/lib/sfx";
import { PlayerCard } from "./PlayerCard";
import { TeamCard } from "./TeamCard";
import { ParticleBackground } from "./ParticleBackground";

type Team = { name: string; members: string[] };

type TeamGeneratorProps = { isDark: boolean; onToggleDark: () => void };

export function TeamGenerator({ isDark, onToggleDark }: TeamGeneratorProps) {
  const [players, setPlayers] = useState<string[]>(DEFAULT_PLAYERS);
  const [selected, setSelected] = useState<Set<string>>(new Set(DEFAULT_PLAYERS));
  const [newName, setNewName] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [revealKey, setRevealKey] = useState(0);

  const selectedCount = selected.size;
  const canGenerate = selectedCount >= 1 && !isGenerating;

  const lowerSet = useMemo(
    () => new Set(players.map((p) => p.toLowerCase())),
    [players],
  );

  const toggle = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const addPlayer = () => {
    const trimmed = newName.trim();
    if (!trimmed) {
      toast.error("Enter a player name first");
      return;
    }
    if (lowerSet.has(trimmed.toLowerCase())) {
      toast.error("That player is already on the list");
      return;
    }
    setPlayers((p) => [...p, trimmed]);
    setSelected((s) => new Set(s).add(trimmed));
    setNewName("");
    toast.success(`Added ${trimmed}`);
  };

  const removePlayer = (name: string) => {
    setPlayers((p) => p.filter((n) => n !== name));
    setSelected((s) => {
      const next = new Set(s);
      next.delete(name);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(players));
  const clearAll = () => setSelected(new Set());

  const generate = () => {
    if (!canGenerate) return;
    playGenerateSound();
    setIsGenerating(true);
    setTeams([]);
    const pool = players.filter((p) => selected.has(p));

    setTimeout(() => {
      const shuffled = shuffle(pool);
      const chunks = chunkIntoTeams(shuffled, 2);
      const names = pickRandomNames(ARABIC_TEAM_NAMES, chunks.length);
      const result: Team[] = chunks.map((members, i) => ({
        name: names[i],
        members,
      }));
      setTeams(result);
      setRevealKey((k) => k + 1);
      setIsGenerating(false);
    }, 1200);
  };

  const copyTeams = async () => {
    if (!teams.length) return;
    const text = teams
      .map(
        (t, i) =>
          `Team ${i + 1} — ${t.name}\n${t.members.map((m) => `  • ${m}`).join("\n")}`,
      )
      .join("\n\n");
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Teams copied to clipboard");
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <ParticleBackground />
      {/* Animated gradient backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-20 bg-[var(--gradient-bg)] bg-[length:200%_200%] animate-gradient-shift" />
      <div className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--neon-purple)_22%,transparent),transparent_60%)]" />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
        {/* Hero */}
        <header className="relative text-center">
          <button
            onClick={onToggleDark}
            aria-label="Toggle dark mode"
            className="absolute right-0 top-0 inline-flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 text-xs font-bold uppercase tracking-wider text-foreground backdrop-blur-md transition hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)] hover:shadow-[var(--glow-cyan)]"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="hidden sm:inline">
              {isDark ? "Light Mode" : "Dark Mode"} Operation
            </span>
          </button>
          <div className="mb-4 flex items-center justify-center gap-3 text-2xl">
            <span className="text-[var(--neon-pink)] drop-shadow-[0_0_10px_var(--neon-pink)] animate-pulse-glow">△</span>
            <span className="text-[var(--neon-cyan)] drop-shadow-[0_0_10px_var(--neon-cyan)] animate-pulse-glow [animation-delay:0.2s]">○</span>
            <span className="text-[var(--neon-purple)] drop-shadow-[0_0_10px_var(--neon-purple)] animate-pulse-glow [animation-delay:0.4s]">✕</span>
            <span className="text-[var(--neon-cyan)] drop-shadow-[0_0_10px_var(--neon-cyan)] animate-pulse-glow [animation-delay:0.6s]">□</span>
          </div>
          <h1 className="font-display text-4xl font-black uppercase tracking-tight sm:text-7xl">
            <span className="bg-[var(--gradient-neon)] bg-clip-text text-transparent drop-shadow-[0_0_30px_color-mix(in_oklab,var(--neon-cyan)_45%,transparent)]">
              PlayStation
            </span>
            <br />
            <span className="bg-gradient-to-r from-[var(--neon-pink)] via-[var(--neon-cyan)] to-[var(--neon-purple)] bg-clip-text text-transparent drop-shadow-[0_0_30px_color-mix(in_oklab,var(--neon-pink)_45%,transparent)]">
              Team Generator
            </span>
          </h1>
        </header>

        {/* Players panel */}
        <section
          className="mt-12 rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-5 backdrop-blur-xl sm:p-7"
          style={{ boxShadow: "var(--shadow-elegant)" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[var(--neon-cyan)]" />
              <h2 className="font-display text-lg font-bold uppercase tracking-wider text-foreground">
                Players
              </h2>
              <span className="ml-2 rounded-full border border-[var(--neon-cyan)]/40 bg-[color-mix(in_oklab,var(--neon-cyan)_15%,transparent)] px-2.5 py-0.5 text-xs font-bold text-[var(--neon-cyan)]">
                {selectedCount} / {players.length} selected
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-xs text-foreground hover:bg-[color-mix(in_oklab,var(--neon-cyan)_15%,transparent)] hover:text-[var(--neon-cyan)]"
                onClick={selectAll}
              >
                Select all
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs text-foreground hover:bg-destructive/15 hover:text-destructive"
                onClick={clearAll}
              >
                Clear
              </Button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {players.map((p) => (
              <PlayerCard
                key={p}
                name={p}
                selected={selected.has(p)}
                onToggle={() => toggle(p)}
                onRemove={() => removePlayer(p)}
              />
            ))}
          </div>

          {/* Add player */}
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addPlayer();
              }}
              placeholder="Add a new player..."
              className="h-11 border-border bg-[var(--glass-strong)] text-base text-foreground placeholder:text-muted-foreground focus-visible:border-[var(--neon-cyan)] focus-visible:ring-[var(--neon-cyan)]/30"
            />
            <Button
              onClick={addPlayer}
              className="h-11 gap-2 border border-[var(--neon-cyan)]/50 bg-[color-mix(in_oklab,var(--neon-cyan)_18%,transparent)] text-[var(--neon-cyan)] hover:bg-[color-mix(in_oklab,var(--neon-cyan)_28%,transparent)] hover:shadow-[var(--glow-cyan)]"
            >
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
        </section>

        {/* Generate button */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <button
            onClick={generate}
            disabled={!canGenerate}
            className={`group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-2xl px-10 font-display text-base font-extrabold uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 sm:h-16 sm:text-lg ${
              canGenerate ? "animate-glow-breathe" : ""
            }`}
            style={{
              background: "var(--gradient-neon)",
              backgroundSize: "300% 300%",
              animation: canGenerate
                ? "gradient-shift 4s ease infinite, glow-breathe 3.5s ease-in-out infinite"
                : undefined,
              color: "var(--gen-btn-text)",
            }}
          >
            <span
              className="absolute inset-[2px] rounded-[14px] backdrop-blur-md transition group-hover:opacity-70"
              style={{ background: "var(--gen-btn-inner)" }}
            />
            <span className="relative flex items-center gap-3">
              {isGenerating ? (
                <>
                  <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                  Shuffling players…
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Generate Random Teams
                </>
              )}
            </span>
          </button>

          {teams.length > 0 && !isGenerating && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                onClick={generate}
                className="gap-2 border border-[var(--neon-purple)] bg-[var(--neon-purple)] font-bold text-[var(--neon-ink)] hover:bg-[var(--neon-purple)]/90 hover:shadow-[var(--glow-purple)]"
              >
                <RefreshCw className="h-4 w-4" /> Regenerate
              </Button>
              <Button
                onClick={copyTeams}
                className="gap-2 border border-[var(--neon-cyan)] bg-[var(--neon-cyan)] font-bold text-[var(--neon-ink)] hover:bg-[var(--neon-cyan)]/90 hover:shadow-[var(--glow-cyan)]"
              >
                <Copy className="h-4 w-4" /> Copy teams
              </Button>
            </div>
          )}
        </div>

        {/* Teams */}
        {teams.length > 0 && !isGenerating && (
          <section
            key={revealKey}
            className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {teams.map((t, i) => (
              <TeamCard key={`${revealKey}-${i}`} index={i} name={t.name} members={t.members} />
            ))}
          </section>
        )}

        <footer className="mt-16 text-center text-xs text-muted-foreground">
          Built for late-night PS sessions · May the duos be ever in your favor
        </footer>
      </main>
    </div>
  );
}
