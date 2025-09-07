import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const FILE_PATH = path.join(process.cwd(), "data", "gym-registrations.json");

async function ensureFile() {
  try {
    await fs.access(FILE_PATH);
  } catch {
    await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
    await fs.writeFile(FILE_PATH, "[]", "utf8");
  }
}

export async function GET() {
  try {
    await ensureFile();
    const raw = await fs.readFile(FILE_PATH, "utf8");
    const rows = JSON.parse(raw);
    return NextResponse.json({ ok: true, count: rows.length, hint: "POST to /api/register-gym to create a registration." });
  } catch (err) {
    console.error("GET /api/register-gym error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Basic validation (server-side)
    const required = ["gymName", "city", "state", "firstName", "lastName", "email", "phone", "agree"];
    for (const key of required) {
      if (body[key] === undefined || body[key] === null || body[key] === "") {
        return NextResponse.json({ ok: false, error: `Missing field: ${key}` }, { status: 400 });
      }
    }
    if (!/^\S+@\S+\.\S+$/.test(String(body.email))) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }
    if (body.agree !== true) {
      return NextResponse.json({ ok: false, error: "You must agree to the participation agreement" }, { status: 400 });
    }

    await ensureFile();
    const raw = await fs.readFile(FILE_PATH, "utf8");
    const rows = JSON.parse(raw) as any[];

    // Create a basic roster link placeholder (slug from gym name)
    const slug = String(body.gymName)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const rosterLink = `/trainers-members?gym=${encodeURIComponent(slug)}`;

    const record = {
      id: crypto.randomUUID(),
      ...body,
      rosterLink,
      createdAt: new Date().toISOString(),
    };

    rows.push(record);
    await fs.writeFile(FILE_PATH, JSON.stringify(rows, null, 2), "utf8");

    // You could email the roster link here in the future.
    return NextResponse.json({ ok: true, id: record.id, rosterLink });
  } catch (err) {
    console.error("POST /api/register-gym error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
