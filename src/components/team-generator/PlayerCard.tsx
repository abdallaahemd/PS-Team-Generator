import { Check, X } from "lucide-react";

type Props = {
  name: string;
  selected: boolean;
  onToggle: () => void;
  onRemove: () => void;
};

export function PlayerCard({ name, selected, onToggle, onRemove }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={selected}
      onClick={onToggle}
      className={`group relative flex w-full items-center justify-between gap-2 rounded-xl px-3 py-3 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-[var(--shadow-sm)] sm:py-2.5 ${
        selected
          ? "gradient-border"
          : "border border-[var(--border)] bg-[var(--surface)] hover:border-[color-mix(in_oklab,var(--primary)_40%,var(--border))]"
      }`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition ${
            selected
              ? "bg-[var(--primary)] text-white"
              : "border border-[var(--input)] bg-transparent text-transparent"
          }`}
          aria-hidden="true"
        >
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
        <span className="min-w-0 flex-1 break-words text-[13px] font-medium leading-snug text-foreground sm:text-sm">
          {name}
        </span>
      </div>
      <span
        role="button"
        tabIndex={0}
        aria-label={`Remove ${name}`}
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }
        }}
        className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100 [@media(hover:none)]:opacity-100"
      >
        <X className="h-3.5 w-3.5" />
      </span>
    </button>
  );
}
