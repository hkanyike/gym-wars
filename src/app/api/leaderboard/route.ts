// src/app/api/leaderboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { LeaderboardUpsertSchema } from "@/lib/validation";

const DATA_PATH = path.join(process.cwd(), "data", "leaderboard.json");

type Row = {
  id: string;
  name: string;
  city?: string;
  state?: string;

  buyInPoints?: number;
  burpeeDeadliftPoints?: number;
  lungeRelayPoints?: number;
  pullSprintPoints?: number;
  pushTirePoints?: number;

  burpeeDeadliftTime?: string;
  lungeRelayTime?: string;
  pullSprintTime?: string;
  pushTireTime?: string;

  trainers?: number;
  members?: number;

  totalScore?: number;
};

async function readList(): Promise<Row[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    return JSON.parse(raw) as Row[];
  } catch {
    return [];
  }
}

async function writeList(rows: Row[]) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(rows, null, 2), "utf8");
}

function sumPoints(r: Row) {
  const a = r.buyInPoints ?? 0;
  const b = r.burpeeDeadliftPoints ?? 0;
  const c = r.lungeRelayPoints ?? 0;
  const d = r.pullSprintPoints ?? 0;
  const e = r.pushTirePoints ?? 0;
  return a + b + c + d + e;
}

export async function GET() {
  const list = await readList();
  return NextResponse.json({ ok: true, data: list }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  // Simple admin auth via header
  const adminHeader = req.headers.get("x-admin-token") || "";
  const secret = process.env.ADMIN_TOKEN || "";
  if (!secret || adminHeader !== secret) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  // Allow either a single object or { item: {...} }
  const payload = (body?.item ?? body) as unknown;

  const parsed = LeaderboardUpsertSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const item = parsed.data;
  let list = await readList();

  const idx = list.findIndex((r) => r.id === item.id);
  const merged: Row = {
    ...(idx >= 0 ? list[idx] : {}),
    ...item,
  };

  // Compute totalScore if not provided
  if (merged.totalScore == null) {
    merged.totalScore = sumPoints(merged);
  }

  if (idx >= 0) {
    list[idx] = merged;
  } else {
    list.push(merged);
  }

  await writeList(list);

  return NextResponse.json({ ok: true, item: merged });
}
