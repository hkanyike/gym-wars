"use client";

import { useEffect, useMemo, useState } from "react";

type RowIn = Record<string, any>;

type Row = {
  id: string;
  name: string;
  city?: string;
  state?: string;

  // Per-challenge points
  buyInPoints: number;
  burpeeDeadliftPoints: number;
  lungeRelayPoints: number;
  pullSprintPoints: number;
  pushTirePoints: number;

  // Optional times
  burpeeDeadliftTime: string | null;
  lungeRelayTime: string | null;
  pullSprintTime: string | null;
  pushTireTime: string | null;

  trainers: number;
  members: number;

  totalScore: number;
};

type ApiRes =
  | { ok: true; data: RowIn[] }
  | { ok: true; leaderboard: RowIn[] }
  | RowIn[]
  | { ok: false; error: string };

const thBtn =
  "px-3 py-2 text-left text-xs font-semibold tracking-wide hover:underline";

export default function Leaderboard() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [stateFilter, setStateFilter] = useState<string>("");

  type SortKey =
    | "rank"
    | "name"
    | "score"
    | "buyInPoints"
    | "burpeeDeadliftPoints"
    | "lungeRelayPoints"
    | "pullSprintPoints"
    | "pushTirePoints";

  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/leaderboard", { cache: "no-store" });
        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) {
          setError("Leaderboard API did not return JSON.");
          setRows([]);
          return;
        }
        const data: ApiRes = await res.json();

        let list: RowIn[] = Array.isArray(data)
          ? data
          : (data as any).data || (data as any).leaderboard || [];

        const normalized: Row[] = list.map((r) => normalizeRow(r));

        setRows(normalized);
      } catch (e: any) {
        setError(e?.message || "Failed to load leaderboard.");
        setRows([]);
      }
    })();
  }, []);

  const states = useMemo(() => {
    if (!rows) return [];
    const s = new Set<string>();
    for (const r of rows) if (r.state) s.add(r.state);
    return Array.from(s).sort();
  }, [rows]);

  const view = useMemo(() => {
    if (!rows) return [];

    let list = rows;
    if (stateFilter) {
      list = list.filter(
        (r) => (r.state || "").toUpperCase() === stateFilter.toUpperCase()
      );
    }
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter((r) => r.name.toLowerCase().includes(needle));
    }

    // Sort by total for rank calc
    const base = [...list].sort((a, b) => b.totalScore - a.totalScore);

    // Tie-aware ranks (1,2,2,2,5…)
    let lastScore: number | null = null;
    let lastRank = 0;
    let index = 0;
    const withRank = base.map((r) => {
      index += 1;
      const s = r.totalScore;
      const rank = lastScore === null ? 1 : s === lastScore ? lastRank : index;
      lastScore = s;
      lastRank = rank;
      const overallWins = rank === 1 ? 1 : 0; // overall winner only
      return { ...r, computedRank: rank, overallWins } as any;
    });

    // UI sort selection
    const sorted = [...withRank].sort((a: any, b: any) => {
      const dir = sortDir === "asc" ? 1 : -1;
      switch (sortKey) {
        case "name":
          return a.name.localeCompare(b.name) * dir;
        case "buyInPoints":
          return (a.buyInPoints - b.buyInPoints) * dir;
        case "burpeeDeadliftPoints":
          return (a.burpeeDeadliftPoints - b.burpeeDeadliftPoints) * dir;
        case "lungeRelayPoints":
          return (a.lungeRelayPoints - b.lungeRelayPoints) * dir;
        case "pullSprintPoints":
          return (a.pullSprintPoints - b.pullSprintPoints) * dir;
        case "pushTirePoints":
          return (a.pushTirePoints - b.pushTirePoints) * dir;
        case "score":
          return (a.totalScore - b.totalScore) * dir;
        case "rank":
        default:
          return (a.computedRank - b.computedRank) * dir;
      }
    });

    return sorted;
  }, [rows, stateFilter, q, sortKey, sortDir]);

  function setSort(next:
    | "rank"
    | "name"
    | "score"
    | "buyInPoints"
    | "burpeeDeadliftPoints"
    | "lungeRelayPoints"
    | "pullSprintPoints"
    | "pushTirePoints"
  ) {
    if (sortKey === next) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(next);
      setSortDir(next === "rank" ? "asc" : "desc");
    }
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-500/30 bg-red-500/10 p-4 text-red-200">
        {error}
      </div>
    );
  }
  if (!rows) {
    return <div className="text-sm text-muted">Loading leaderboard…</div>;
  }

  return (
    <div className="grid gap-4">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-muted">Leaderboard</p>
          <h2 className="text-2xl font-bold">Gym Rankings</h2>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="text-sm">
            <span className="mr-2 inline-block">State:</span>
            <select
              className="rounded-md border border-border bg-white px-3 py-2 text-black"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
            >
              <option value="">All</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <input
            className="rounded-md border border-border bg-bg px-3 py-2 text-sm"
            placeholder="Search gym…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="px-3 py-2">#</th>
              <th>
                <button className={thBtn} onClick={() => setSort("name")}>
                  Gym{sortKey === "name" ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
                </button>
              </th>
              <th className="px-3 py-2">Location</th>

              <th>
                <button className={thBtn} onClick={() => setSort("buyInPoints")}>
                  Buy-In (pts)
                  {sortKey === "buyInPoints" ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
                </button>
              </th>
              <th>
                <button
                  className={thBtn}
                  onClick={() => setSort("burpeeDeadliftPoints")}
                >
                  Burpee/Deadlift (pts • time)
                  {sortKey === "burpeeDeadliftPoints"
                    ? sortDir === "asc"
                      ? " ↑"
                      : " ↓"
                    : ""}
                </button>
              </th>
              <th>
                <button
                  className={thBtn}
                  onClick={() => setSort("lungeRelayPoints")}
                >
                  Lunge Relay (pts • time)
                  {sortKey === "lungeRelayPoints"
                    ? sortDir === "asc"
                      ? " ↑"
                      : " ↓"
                    : ""}
                </button>
              </th>
              <th>
                <button
                  className={thBtn}
                  onClick={() => setSort("pullSprintPoints")}
                >
                  Pull-Up/Sprint (pts • time)
                  {sortKey === "pullSprintPoints"
                    ? sortDir === "asc"
                      ? " ↑"
                      : " ↓"
                    : ""}
                </button>
              </th>
              <th>
                <button className={thBtn} onClick={() => setSort("pushTirePoints")}>
                  Push-Up/Tire Flip (pts • time)
                  {sortKey === "pushTirePoints"
                    ? sortDir === "asc"
                      ? " ↑"
                      : " ↓"
                    : ""}
                </button>
              </th>

              <th>
                <button className={thBtn} onClick={() => setSort("score")}>
                  Total
                  {sortKey === "score" ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
                </button>
              </th>
              <th className="px-3 py-2">Overall Wins</th>
            </tr>
          </thead>
          <tbody>
            {view.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-3 py-6 text-center text-muted">
                  No leaderboard data yet.
                </td>
              </tr>
            ) : (
              view.map((r: any) => (
                <tr
                  key={r.id}
                  className="border-t border-white/10 odd:bg-white/0 even:bg-white/[0.03]"
                >
                  <td className="px-3 py-2">{r.computedRank}</td>
                  <td className="px-3 py-2 font-medium">{r.name}</td>
                  <td className="px-3 py-2">
                    {r.city && r.state ? `${r.city}, ${r.state}` : r.state || "-"}
                  </td>

                  <Cell points={r.buyInPoints} />
                  <Cell
                    points={r.burpeeDeadliftPoints}
                    time={r.burpeeDeadliftTime}
                  />
                  <Cell points={r.lungeRelayPoints} time={r.lungeRelayTime} />
                  <Cell points={r.pullSprintPoints} time={r.pullSprintTime} />
                  <Cell points={r.pushTirePoints} time={r.pushTireTime} />

                  <td className="px-3 py-2 font-semibold">{r.totalScore}</td>
                  <td className="px-3 py-2">{r.overallWins}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function num(v: any): number | null {
  return Number.isFinite(v) ? (v as number) : null;
}
function numOr0(v: any): number {
  return Number.isFinite(v) ? (v as number) : 0;
}
function strOrNull(v: any): string | null {
  const s = String(v ?? "").trim();
  return s ? s : null;
}

/** Accepts both old and new field names and computes totals */
function normalizeRow(r: RowIn): Row {
  // IDs / name
  const id = String(r.id ?? r.slug ?? r.handle ?? r.name ?? cryptoRand()).toLowerCase().replace(/\s+/g, "-");
  const name = String(r.name ?? r.gymName ?? "Unknown Gym");

  // location
  let city = r.city ?? null;
  let state = r.state ?? null;
  if ((!city || !state) && (r.location || r.cityState)) {
    const source = r.location || r.cityState;
    const parts = String(source).split(",").map((s) => s.trim());
    if (parts.length >= 2) {
      city = parts[0];
      state = parts[1];
    }
  }

  // Per-event points (new OR old keys)
  const buyInPoints =
    num(r.buyInPoints) ?? num(r.buyIn) ?? num(r.buy_in) ?? num(r.event0) ?? 0;

  const burpeeDeadliftPoints =
    num(r.burpeeDeadliftPoints) ??
    num(r.event1) ??
    num(r.burpeePoints) ??
    num(r.burpeesDeadlift) ??
    0;

  const lungeRelayPoints =
    num(r.lungeRelayPoints) ??
    num(r.event2) ??
    num(r.lungePoints) ??
    0;

  const pullSprintPoints =
    num(r.pullSprintPoints) ??
    num(r.event3) ??
    num(r.pullupSprintPoints) ??
    0;

  const pushTirePoints =
    num(r.pushTirePoints) ??
    num(r.event4) ??
    num(r.pushTirePointsAlt) ??
    0;

  // Times (accept multiple keys)
  const burpeeDeadliftTime =
    strOrNull(r.burpeeDeadliftTime) ??
    strOrNull(r.event1Time) ??
    strOrNull(r.burpeeTime) ??
    null;

  const lungeRelayTime =
    strOrNull(r.lungeRelayTime) ??
    strOrNull(r.event2Time) ??
    null;

  const pullSprintTime =
    strOrNull(r.pullSprintTime) ??
    strOrNull(r.event3Time) ??
    null;

  const pushTireTime =
    strOrNull(r.pushTireTime) ??
    strOrNull(r.event4Time) ??
    null;

  // totals and meta
  const trainers = numOr0(r.trainers);
  const members = numOr0(r.members);

  const totalFromEvents =
    buyInPoints +
    burpeeDeadliftPoints +
    lungeRelayPoints +
    pullSprintPoints +
    pushTirePoints;

  const totalScore =
    num(r.totalScore) ?? num(r.score) ?? totalFromEvents;

  return {
    id,
    name,
    city: city ?? undefined,
    state: state ?? undefined,
    buyInPoints,
    burpeeDeadliftPoints,
    lungeRelayPoints,
    pullSprintPoints,
    pushTirePoints,
    burpeeDeadliftTime,
    lungeRelayTime,
    pullSprintTime,
    pushTireTime,
    trainers,
    members,
    totalScore,
  };
}

function cryptoRand() {
  try {
    const a = Math.random().toString(36).slice(2, 8);
    return `row-${a}`;
  } catch {
    return `row-${Date.now()}`;
  }
}

function Cell({ points, time }: { points?: number; time?: string | null }) {
  const showTime = time && String(time).trim();
  return (
    <td className="px-3 py-2">
      <div className="font-semibold">
        {(points ?? 0)} pts{" "}
        <span className="text-xs">{showTime ? `(${time})` : "–"}</span>
      </div>
    </td>
  );
}
