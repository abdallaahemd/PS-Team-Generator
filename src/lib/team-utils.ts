// Fisher–Yates shuffle, returns a new array
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Split into teams of `size`. Last team may be smaller.
export function chunkIntoTeams<T>(items: T[], size = 2): T[][] {
  const teams: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    teams.push(items.slice(i, i + size));
  }
  return teams;
}

// Pick `count` random unique names from pool. Falls back to repeats if not enough.
export function pickRandomNames(pool: string[], count: number): string[] {
  if (count <= pool.length) return shuffle(pool).slice(0, count);
  const result = shuffle(pool);
  while (result.length < count) result.push(pool[Math.floor(Math.random() * pool.length)]);
  return result;
}
