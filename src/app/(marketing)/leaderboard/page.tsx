// src/app/leaderboard/page.tsx
import Leaderboard from "@/components/Leaderboard";

export const metadata = {
  title: "Leaderboard | Gym Wars",
  description: "Live rankings of gyms by score, wins, and participation.",
};

export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Leaderboard />
    </div>
  );
}

