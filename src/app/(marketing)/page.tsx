import { HeroSplash } from "@/components/hero/HeroSplash";
import Leaderboard from "@/components/Leaderboard";

export default function HomePage() {
  return (
    <>
      <HeroSplash />

      {/* WHAT IS GYM WARS? */}
      <section
        id="what-is-gym-wars"
        className="mx-auto max-w-6xl px-4 py-12 scroll-mt-24 rounded-xl border border-white/10"
      >
        <h2 className="text-2xl font-bold">What is Gym Wars?</h2>
        <p className="mt-3 text-muted">
          Gym Wars is the only true gym-versus-gym competition series, stacking
          gyms head-to-head at the county, state, and national levels. Each
          event produces transparent ratings powered by Gains App. A gym’s
          standing is measured by member and trainer performance, culture, and
          teamwork—so the community can see who’s truly building champions.
          These ratings also help the public choose gyms based on proven
          culture, trainer excellence, and the fitness of their members.
        </p>
      </section>

      {/* OUR MISSION & VISION */}
      <section
        id="mission-vision"
        className="mx-auto max-w-6xl px-4 py-12 scroll-mt-24 rounded-xl border border-white/10"
      >
        <h2 className="text-2xl font-bold">Our Mission & Vision</h2>
        <p className="mt-3 text-muted">
          We exist to recognize entire gyms—not just individuals—by showcasing
          the quality of their programs, the dedication of their members and the
          leadership of their trainers. When members show up, complete
          challenges properly, and perform well together, it signals a thriving
          culture and excellent coaching.
        </p>
      </section>

      {/* LEADERBOARD */}
      <section
        id="leaderboard"
        className="mx-auto max-w-6xl px-4 py-12 scroll-mt-24"
      >
        <header className="mb-6">
          <p className="text-muted text-sm">Leaderboard</p>
          <h2 className="text-2xl font-bold">Top Gyms Right Now</h2>
        </header>

        <Leaderboard />

        <a
          href="/leaderboard"
          className="mt-4 inline-block text-accent underline"
        >
          View full leaderboard →
        </a>
      </section>
    </>
  );
}
