import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const FILE_PATH = path.join(process.cwd(), "data", "gym-requests.json");

async function ensureFile() {
  try {
    await fs.access(FILE_PATH);
  } catch {
    await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
    await fs.writeFile(FILE_PATH, "[]", "utf8");
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const required = ["gymName", "city", "state", "contactEmail"];
    for (const k of required) {
      if (!body[k]) {
        return NextResponse.json({ ok: false, error: `Missing field: ${k}` }, { status: 400 });
      }
    }
    if (!/^\S+@\S+\.\S+$/.test(String(body.contactEmail))) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    await ensureFile();
    const raw = await fs.readFile(FILE_PATH, "utf8");
    const rows = JSON.parse(raw) as any[];

    const rec = {
      id: crypto.randomUUID(),
      ...body,
      createdAt: new Date().toISOString(),
    };

    rows.push(rec);
    await fs.writeFile(FILE_PATH, JSON.stringify(rows, null, 2), "utf8");

    return NextResponse.json({ ok: true, id: rec.id });
  } catch (err) {
    console.error("POST /api/gym-requests error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
