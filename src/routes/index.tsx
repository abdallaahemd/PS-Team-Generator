import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TeamGenerator } from "@/components/team-generator/TeamGenerator";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PlayStation Team Generator — Random Multiplayer Squads" },
      {
        name: "description",
        content:
          "Generate random PlayStation multiplayer teams with a chaotic Arabic team name. Pick your players, hit generate, and let fate decide the duos.",
      },
      { property: "og:title", content: "PlayStation Team Generator" },
      {
        property: "og:description",
        content:
          "Random duos. Glowing neon UI. Arabic team names you'll actually laugh at.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [isDark, setIsDark] = useState(true);
  return (
    <div className={isDark ? "dark" : ""}>
      <TeamGenerator isDark={isDark} onToggleDark={() => setIsDark((v) => !v)} />
      <Toaster theme={isDark ? "dark" : "light"} position="top-center" richColors />
    </div>
  );
}
