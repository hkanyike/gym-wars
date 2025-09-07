import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const REG_PATH = path.join(process.cwd(), "data", "gym-registrations.json");

async function ensureFile(p: string) {
  try {
    await fs.access(p);
  } catch {
    await fs.mkdir(path.dirname(p), { recursive: true });
    await fs.writeFile(p, "[]", "utf8");
  }
}

export async function GET() {
  try {
    await ensureFile(REG_PATH);
    const raw = await fs.readFile(REG_PATH, "utf8");
    const rows = JSON.parse(raw) as any[];

    // Map to dropdown-friendly shape
    const data = rows.map((r) => ({
      id: (String(r.gymName) || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
      name: r.gymName,
      location: `${r.city}, ${r.state}`,
    }));

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    console.error("GET /api/gyms error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
