import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { LeaderboardUpdateSchema } from "@/lib/validation";

const DATA_PATH = path.join(process.cwd(), "data", "leaderboard.json");

// Raw row shape (rank is computed)
type Row = {
  id: string;
  name: string;
  location: string;
  totalScore: number;
  wins: number;
  trainers: number;
  members: number;
  rank?: number;
};

const DEFAULT_ROWS: Row[] = [
  { id: "striiv", name: "Striive", location: "Hoboken, NJ", totalScore: 865, wins: 3, trainers: 5, members: 42 },
  { id: "tbt", name: "TBT Fitness", location: "Jersey City, NJ", totalScore: 822, wins: 2, trainers: 4, members: 36 },
  { id: "basecamp", name: "Basecamp", location: "Newark, NJ", totalScore: 791, wins: 1, trainers: 3, members: 28 }
];

async function readAll(): Promise<Row[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as Row[] : [];
  } catch (err: any) {
    if (err.code === "ENOENT") {
      await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
      await fs.writeFile(DATA_PATH, JSON.stringify(DEFAULT_ROWS, null, 2), "utf8");
      return DEFAULT_ROWS;
    }
    throw err;
  }
}

async function writeAll(rows: Row[]) {
  await fs.writeFile(DATA_PATH, JSON.stringify(rows, null, 2), "utf8");
}

function computeRanks(rows: Row[]): Row[] {
  const sorted = [...rows].sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore; // score desc
    if (b.wins !== a.wins) return b.wins - a.wins;                         // wins desc
    return a.name.localeCompare(b.name);                                    // name asc (stable-ish)
  });

  let lastKey = "";
  let lastRank = 0;
  for (let i = 0; i < sorted.length; i++) {
    const k = `${sorted[i].totalScore}::${sorted[i].wins}`;
    if (k !== lastKey) {
      lastRank = i + 1; // 1-based rank
      lastKey = k;
    }
    sorted[i].rank = lastRank;
  }
  return sorted;
}

export async function GET() {
  try {
    const rows = await readAll();
    const ranked = computeRanks(rows);
    return NextResponse.json({ ok: true, data: ranked });
  } catch (err) {
    console.error("Leaderboard GET error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Simple dev-only auth via header token
    const token = req.headers.get("x-admin-token");
    if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = LeaderboardUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid data", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const update = parsed.data;
    const rows = await readAll();
    const idx = rows.findIndex((r) => r.id === update.id);

    if (idx === -1) {
      // create new row (missing fields default to 0 or "")
      const newRow: Row = {
        id: update.id,
        name: update.name ?? "Unnamed Gym",
        location: update.location ?? "Unknown",
        totalScore: update.totalScore ?? 0,
        wins: update.wins ?? 0,
        trainers: update.trainers ?? 0,
        members: update.members ?? 0,
      };
      rows.push(newRow);
    } else {
      // patch existing
      rows[idx] = {
        ...rows[idx],
        ...("name" in update ? { name: update.name! } : {}),
        ...("location" in update ? { location: update.location! } : {}),
        ...("totalScore" in update ? { totalScore: update.totalScore! } : {}),
        ...("wins" in update ? { wins: update.wins! } : {}),
        ...("trainers" in update ? { trainers: update.trainers! } : {}),
        ...("members" in update ? { members: update.members! } : {}),
      };
    }

    const ranked = computeRanks(rows);
    await writeAll(ranked.map(({ rank, ...rest }) => rest)); // persist WITHOUT rank; we compute on read

    return NextResponse.json({ ok: true, data: computeRanks(await readAll()) });
  } catch (err) {
    console.error("Leaderboard POST error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
