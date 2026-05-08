type Props = {
  name: string;
  members: string[];
  index: number;
};

const BORDER_HUES = ["var(--neon-cyan)", "var(--neon-purple)", "var(--neon-pink)"];

export function TeamCard({ name, members, index }: Props) {
  const hue = BORDER_HUES[index % BORDER_HUES.length];

  return (
    <div
      className="team-card relative overflow-hidden rounded-2xl border bg-[var(--glass-bg)] p-5 backdrop-blur-xl"
      style={{
        borderColor: hue,
        boxShadow: `0 0 24px -6px ${hue}, inset 0 1px 0 rgba(255,255,255,0.06)`,
        animationDelay: `${index * 90}ms`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at 20% 0%, ${hue}, transparent 60%)`,
        }}
      />
      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Team {index + 1}
          </span>
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
            style={{ background: `${hue}22`, color: hue }}
          >
            {members.length === 1 ? "SOLO" : "DUO"}
          </span>
        </div>
        <h3
          dir="rtl"
          lang="ar"
          className="mt-2 font-arabic text-2xl font-extrabold leading-tight"
          style={{ color: hue, textShadow: `0 0 18px ${hue}55` }}
        >
          {name}
        </h3>
        <ul className="mt-4 space-y-2">
          {members.map((m, i) => (
            <li
              key={m + i}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-foreground"
            >
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-black"
                style={{ background: `${hue}22`, color: hue }}
              >
                P{i + 1}
              </span>
              {m}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
