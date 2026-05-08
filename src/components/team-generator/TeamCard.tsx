type Props = {
  name: string;
  members: string[];
  index: number;
};

const ACCENTS = [
  "var(--primary)",
  "var(--accent)",
  "linear-gradient(90deg, var(--primary), var(--accent))",
];

export function TeamCard({ name, members, index }: Props) {
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <div
      className="team-card relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
      style={{
        boxShadow: "var(--shadow-md)",
        animationDelay: `${index * 80}ms`,
      }}
    >
      {/* Top accent strip */}
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: accent }}
        aria-hidden="true"
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
          Team {index + 1}
        </span>
        <span className="rounded-full bg-[color-mix(in_oklab,var(--primary)_12%,transparent)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--primary)]">
          {members.length === 1 ? "SOLO" : "DUO"}
        </span>
      </div>
      <h3
        dir="rtl"
        lang="ar"
        className="mt-2 font-arabic text-2xl font-extrabold leading-tight text-foreground"
      >
        {name}
      </h3>
      <ul className="mt-4 space-y-2">
        {members.map((m, i) => (
          <li
            key={m + i}
            className="flex items-center gap-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 text-sm font-medium text-foreground"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[color-mix(in_oklab,var(--primary)_14%,transparent)] text-[11px] font-bold text-[var(--primary)]">
              P{i + 1}
            </span>
            {m}
          </li>
        ))}
      </ul>
    </div>
  );
}
