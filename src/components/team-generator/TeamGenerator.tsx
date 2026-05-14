import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Copy, RefreshCw, Sparkles, Plus, Users, Sun, Moon, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ARABIC_TEAM_NAMES, DEFAULT_PLAYERS } from "./data";
import { chunkIntoTeams, pickRandomNames, shuffle } from "@/lib/team-utils";
import { playGenerateSound } from "@/lib/sfx";
import { PlayerCard } from "./PlayerCard";
import { TeamCard } from "./TeamCard";
import { ParticleBackground } from "./ParticleBackground";
import { TournamentBracket } from "./TournamentBracket";

type Team = { name: string; members: string[] };

type TeamGeneratorProps = { isDark: boolean; onToggleDark: () => void };

export function TeamGenerator({ isDark, onToggleDark }: TeamGeneratorProps) {
  const [players, setPlayers] = useState<string[]>(DEFAULT_PLAYERS);
  const [selected, setSelected] = useState<Set<string>>(new Set());
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
    }, 1000);
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
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <ParticleBackground />
      <div
        className="pointer-events-none fixed inset-0 -z-20"
        style={{ background: "var(--gradient-bg)" }}
      />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-[var(--shadow-primary)]"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Gamepad2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-base font-bold tracking-tight text-foreground sm:text-lg">
                PS Team Generator
              </span>
              <span className="text-xs text-muted-foreground">
                Random multiplayer squads
              </span>
            </div>
          </div>

          {/* Theme toggle pill */}
          <button
            type="button"
            role="switch"
            aria-checked={isDark}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            onClick={onToggleDark}
            className="relative inline-flex h-9 w-16 shrink-0 items-center rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 transition-colors hover:bg-[var(--surface-elevated)]"
          >
            <span
              className="flex h-7 w-7 transform items-center justify-center rounded-full text-white shadow-[var(--shadow-sm)] transition-transform duration-300"
              style={{
                background: "var(--gradient-primary)",
                transform: isDark ? "translateX(28px)" : "translateX(0)",
              }}
            >
              {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
            </span>
          </button>
        </header>

        {/* Hero */}
        <section className="mt-10 text-center sm:mt-14">
          <h1
            className="font-display font-black tracking-tight"
            style={{ fontSize: "clamp(2rem, 5vw + 0.5rem, 3.5rem)", lineHeight: 1.05 }}
          >
            <span className="text-foreground">Build your </span>
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-primary)" }}
            >
              squads
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Pick your roster. Hit generate. Get random duos with chaotic Arabic team names.
          </p>
        </section>

        {/* Players panel */}
        <section
          className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7"
          style={{ boxShadow: "var(--shadow-md)" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Users className="h-4.5 w-4.5 text-[var(--primary)]" />
              <h2 className="text-sm font-semibold tracking-wide text-foreground sm:text-base">
                Players
              </h2>
              <span className="rounded-full bg-[color-mix(in_oklab,var(--primary)_12%,transparent)] px-2.5 py-0.5 text-xs font-semibold text-[var(--primary)]">
                {selectedCount}/{players.length}
              </span>
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 text-xs text-muted-foreground hover:bg-[var(--surface-elevated)] hover:text-foreground"
                onClick={selectAll}
              >
                Select all
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                onClick={clearAll}
              >
                Clear
              </Button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-2.5 [@media(min-width:420px)]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
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

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addPlayer();
              }}
              placeholder="Add a new player..."
              className="h-11 border-[var(--border)] bg-[var(--surface-elevated)] text-base text-foreground placeholder:text-muted-foreground"
            />
            <Button
              onClick={addPlayer}
              className="h-11 gap-2 bg-[var(--surface-elevated)] text-foreground border border-[var(--border)] hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)]"
            >
              <Plus className="h-4 w-4" /> Add player
            </Button>
          </div>
        </section>

        {/* Generate CTA */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={generate}
            disabled={!canGenerate}
            className="group inline-flex h-14 items-center justify-center gap-2.5 rounded-2xl px-10 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 sm:h-15"
            style={{
              background: "var(--gradient-primary)",
              boxShadow: canGenerate ? "var(--shadow-primary)" : "var(--shadow-sm)",
            }}
          >
            {isGenerating ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Shuffling…
              </>
            ) : (
              <>
                <Sparkles className="h-4.5 w-4.5" />
                Generate Random Teams
              </>
            )}
          </button>

          {teams.length > 0 && !isGenerating && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                onClick={generate}
                className="gap-2 bg-[var(--primary)] text-white hover:bg-[color-mix(in_oklab,var(--primary)_88%,black)]"
              >
                <RefreshCw className="h-4 w-4" /> Regenerate
              </Button>
              <Button
                onClick={copyTeams}
                variant="outline"
                className="gap-2 border-[var(--primary)] bg-transparent text-[var(--primary)] hover:bg-[color-mix(in_oklab,var(--primary)_10%,transparent)] hover:text-[var(--primary)]"
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

        {teams.length > 0 && !isGenerating && (
          <TournamentBracket teams={teams} revealKey={revealKey} />
        )}

        <footer className="mt-16 text-center text-xs text-muted-foreground">
          Built for late-night PS sessions · May the duos be ever in your favor
        </footer>
      </main>
    </div>
  );
}
