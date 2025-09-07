export const metadata = {
  title: "Challenges | Gym Wars",
  description: "Face-Off challenges, stations, rules, and scoring.",
};

/** Edit schedule times here */
const SCHEDULE = [
  { time: "TBD",      title: "Opening Buy-In Challenge",      href: "#opening-buy-in",   meta: "12-min EMOM" },
  { time: "10:30 AM", title: "Team Grind Challenge",          href: "#team-grind",       meta: "3 Stations" },
  { time: "12:00 PM", title: "Gym Wars Trainers Face-Off",    href: "#trainers-faceoff", meta: "Tire Flip + Push-Ups" },
];

export default function ChallengesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Grid: main + sticky sidebar */}
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* MAIN */}
        <div className="space-y-10">
          {/* Title */}
          <header className="space-y-2">
            <h1 className="text-3xl font-bold">Face-Off Challenges</h1>
            <p className="text-sm text-muted">
              Official event challenges, formats, and rules.
            </p>
          </header>

          {/* Global Scoring Highlight */}
          <section aria-label="Scoring Overview">
            <div className="rounded-xl border border-accent/40 bg-accent/10 p-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide">Scoring System</h2>
              <p className="mt-1 text-sm">
                <span className="font-semibold">Points awarded by placement:</span>{" "}
                <span className="font-semibold text-accent">1st = 5 pts … 5th = 1 pt</span>.
              </p>
            </div>
          </section>

          {/* Opening Buy-In */}
          <section id="opening-buy-in" className="space-y-4 scroll-mt-24">
            <header>
              <h2 className="text-2xl font-semibold">Opening Buy-In Challenge</h2>
              <p className="text-sm">
                <span className="font-medium">Format:</span> 12-minute EMOM (Every Minute on the Minute)
              </p>
              <ul className="mt-1 list-disc list-inside text-sm space-y-1">
                <li>💥 All athletes participate simultaneously.</li>
                <li>Team that completes all 12 minutes = <span className="font-semibold">10 points</span>.</li>
              </ul>
            </header>

            <div>
              <h3 className="font-medium">🔁 Movement Cycle</h3>
              <table className="mt-2 w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-white/5">
                    <th className="border px-2 py-1">Minute</th>
                    <th className="border px-2 py-1">Movement</th>
                    <th className="border px-2 py-1">Reps</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border px-2">1</td><td className="border px-2">Jumping Jacks</td><td className="border px-2">30</td></tr>
                  <tr><td className="border px-2">2</td><td className="border px-2">Jump-Squats</td><td className="border px-2">25</td></tr>
                  <tr><td className="border px-2">3</td><td className="border px-2">Push-Ups</td><td className="border px-2">20</td></tr>
                  <tr><td className="border px-2">4</td><td className="border px-2">Burpees</td><td className="border px-2">15</td></tr>
                  <tr>
                    <td className="border px-2 py-1 text-center" colSpan={3}>
                      Minutes 5–8: Repeat Cycle • Minutes 9–12: Repeat Cycle
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="font-medium">✅ Scoring</h3>
              <p className="text-sm">
                Teams that complete all 12 minutes = <span className="font-semibold">10 points</span>.
              </p>
            </div>
          </section>

          {/* Team Grind */}
          <section id="team-grind" className="space-y-5 scroll-mt-24">
            <header className="space-y-1">
              <h2 className="text-2xl font-semibold">Team Grind Challenge</h2>
              <p className="text-sm"><span className="font-medium">Format:</span> Each gym rotates through 3 stations.</p>
              <p className="text-sm">
                <span className="font-semibold">Placement scoring:</span> 1st = 5 pts … 5th = 1 pt.
              </p>
            </header>

            {/* Station 1 */}
            <article id="station-1" className="rounded-xl border border-border p-4 space-y-2 scroll-mt-24">
              <h3 className="text-lg font-semibold">STATION 1 — Max Rep Power Station</h3>
              <p className="text-sm">
                <span className="font-medium">Challenge:</span> 135 lbs &nbsp;•&nbsp; Barbell — Burpee into Deadlift
              </p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li><span className="font-medium">Goal:</span> Complete 100 team reps.</li>
                <li>⏱ <span className="font-medium">Clock:</span> First to finish.</li>
                <li>🔁 Team rotation allowed.</li>
              </ul>
              <div>
                <h4 className="font-medium">✅ Rules</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Each rep = burpee → deadlift (full lockout).</li>
                  <li>Rotate athletes freely.</li>
                  <li>First team to reach <span className="font-semibold">100</span> wins.</li>
                </ul>
              </div>
            </article>

            {/* Station 2 */}
            <article id="station-2" className="rounded-xl border border-border p-4 space-y-2 scroll-mt-24">
              <h3 className="text-lg font-semibold">STATION 2 — Time-Based Weighted Lunge Relay</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li><span className="font-medium">Goal:</span> Lunge from 10 to 100 yds and back, 4× (800 yards total).</li>
                <li>8 athletes (Men &amp; Women).</li>
                <li>Men: 50 lb DBs &nbsp;|&nbsp; Women: 30 lb DBs.</li>
              </ul>
              <div>
                <h4 className="font-medium">✅ Rules</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Each athlete lunges 100 yards; partner lunges back (1 full round).</li>
                  <li>Each team must complete 4 round trips (800 yards total).</li>
                  <li>No dropping dumbbells during the lunge.</li>
                  <li><span className="font-medium">Penalty:</span> 15 push-ups on the spot before continuing.</li>
                </ul>
              </div>
            </article>

            {/* Station 3 */}
            <article id="station-3" className="rounded-xl border border-border p-4 space-y-2 scroll-mt-24">
              <h3 className="text-lg font-semibold">STATION 3 — Pull-Up Drop Set & Sprint Tag Team</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li><span className="font-medium">Goal:</span> Complete pull-up ladder from 10 → 1 reps.</li>
                <li>🔁 Team rotations allowed.</li>
              </ul>

              <div className="space-y-2">
                <h4 className="font-medium">✅ Rules</h4>
                <p className="text-sm">
                  Teams of two alternate between pull-ups and 100-yard sprints. Start with 10 reps, then decrease by 1 each round until the final set of 1.
                </p>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Round 1</p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Athlete A: 10 pull-ups, then holds (chin-above-bar or dead hang).</li>
                    <li>Athlete B: 100-yard sprint (out & back) while A holds.</li>
                    <li>Switch roles when B returns; repeat.</li>
                  </ul>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Round 2</p>
                  <p className="text-sm">Next pair begins at 9 pull-ups, then 8, … down to 1.</p>
                </div>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Hold during sprint required: <span className="font-medium">chin-above-bar = full points</span>, <span className="font-medium">dead hang = half points</span> for that round.</li>
                  <li>If the hold breaks: athlete performs 15 push-ups; runner must restart the sprint.</li>
                </ul>
              </div>
            </article>
          </section>

          {/* Trainers Face-Off */}
          <section id="trainers-faceoff" className="space-y-3 scroll-mt-24">
            <header>
              <h2 className="text-2xl font-semibold">Gym Wars Trainers Face-Off</h2>
              <p className="text-sm">
                <span className="font-medium">Format:</span> Trainers/Coaches per gym &nbsp;|&nbsp;
                <span className="font-medium">Structure:</span> Tire Flip &amp; Push-Up Gauntlet
              </p>
            </header>

            <article className="rounded-xl border border-border p-4 space-y-2">
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Start: 1 trainer flips tire 10 yards (10–20 yd line).</li>
                <li>Then runs 100 yards out & back, then performs 25 push-ups.</li>
                <li>Next trainer flips tire from 20–30 yd line, then runs 100 yards out & back, then performs 25 push-ups.</li>
                <li>Repeat until the tire reaches the 100-yard line.</li>
              </ul>
              <div>
                <h4 className="font-medium">✅ Rules</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>No skipping push-ups.</li>
                  <li>Flipper must finish push-ups before the next flip.</li>
                  <li>Team must rotate roles (no same person flipping twice in a row).</li>
                  <li>Men: 25 push-ups &nbsp;|&nbsp; Women: 15 push-ups.</li>
                </ul>
              </div>
            </article>
          </section>
        </div>

        {/* SIDEBAR */}
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
              Schedule & Quick Links
            </h3>

            <ul className="space-y-2">
              {SCHEDULE.map((item) => (
                <li key={item.href} className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white">
                    {item.time}
                  </div>
                  <div>
                    <a href={item.href} className="font-medium hover:underline">
                      {item.title}
                    </a>
                    <div className="text-xs text-muted">{item.meta}</div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 border-t border-border/60 pt-3">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                Stations
              </div>
              <ul className="space-y-1 text-sm">
                <li><a href="#station-1" className="hover:underline">Station 1 — Max Rep Power</a></li>
                <li><a href="#station-2" className="hover:underline">Station 2 — Lunge Relay</a></li>
                <li><a href="#station-3" className="hover:underline">Station 3 — Pull-Up & Sprint</a></li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
