import { X } from "lucide-react";

type Props = {
  name: string;
  selected: boolean;
  onToggle: () => void;
  onRemove: () => void;
};

export function PlayerCard({ name, selected, onToggle, onRemove }: Props) {
  return (
    <div
      className={`group relative flex items-center justify-between rounded-xl border px-3 py-2.5 backdrop-blur-md transition-all duration-200 cursor-pointer select-none
        ${
          selected
            ? "border-[var(--neon-cyan)] bg-[var(--glass-bg)] shadow-[var(--glow-cyan)]"
            : "border-[var(--glass-border)] bg-[var(--glass-bg)] hover:border-[var(--neon-purple)] hover:shadow-[var(--glow-purple)]"
        }
      `}
      onClick={onToggle}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[10px] font-bold transition
            ${selected ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)]" : "border-white/30 text-transparent"}`}
        >
          ✓
        </span>
        <span className="truncate text-sm font-medium text-foreground">{name}</span>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        aria-label={`Remove ${name}`}
        className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition hover:bg-destructive/20 hover:text-destructive group-hover:opacity-100"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
