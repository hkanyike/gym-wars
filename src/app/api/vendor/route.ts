import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const FILE_PATH = path.join(process.cwd(), "data", "vendor-registrations.json");

async function ensureFile() {
  try {
    await fs.access(FILE_PATH);
  } catch {
    await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
    await fs.writeFile(FILE_PATH, "[]", "utf8");
  }
}

export async function GET() {
  // 👈 Helpful for quick checks in a browser; always JSON
  try {
    await ensureFile();
    const raw = await fs.readFile(FILE_PATH, "utf8");
    const rows = JSON.parse(raw);
    return NextResponse.json({ ok: true, count: rows.length, hint: "POST to /api/vendors to register." });
  } catch (err) {
    console.error("GET /api/vendors error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Basic server-side checks
    const required = ["businessName", "email", "city", "state", "boothSize", "agree"];
    for (const key of required) {
      if (body[key] === undefined || body[key] === null || body[key] === "") {
        return NextResponse.json({ ok: false, error: `Missing field: ${key}` }, { status: 400 });
      }
    }
    if (!/^\S+@\S+\.\S+$/.test(String(body.email))) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }
    if (body.agree !== true) {
      return NextResponse.json({ ok: false, error: "You must agree to the vendor terms" }, { status: 400 });
    }

    await ensureFile();
    const raw = await fs.readFile(FILE_PATH, "utf8");
    const rows = JSON.parse(raw) as any[];

    const record = {
      id: crypto.randomUUID(),
      ...body,
      createdAt: new Date().toISOString(),
    };

    rows.push(record);
    await fs.writeFile(FILE_PATH, JSON.stringify(rows, null, 2), "utf8");

    return NextResponse.json({ ok: true, id: record.id });
  } catch (err) {
    console.error("POST /api/vendors error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
