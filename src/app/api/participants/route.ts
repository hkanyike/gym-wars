import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  findParticipantByEmail,
  createParticipant,
  updateParticipantByEmail,
  joinEvent,
} from "@/lib/db";
import { EVENT_DATE_ISO } from "@/config/site";

// ───────────────── Zod validation ─────────────────
const CreateSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  role: z.enum(["Trainer", "Member"]),
  emergencyContact: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  gymId: z.string().nullable().optional(),
  gymName: z.string().nullable().optional(),
  // If true, also add them to the current event
  joinCurrentEvent: z.boolean().optional(),
});

const UpdateSchema = z.object({
  email: z.string().email(), // used as the key to find existing record
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(["Trainer", "Member"]).optional(),
  emergencyContact: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  gymId: z.string().nullable().optional(),
  gymName: z.string().nullable().optional(),
  // If true, also add them to the current event
  joinCurrentEvent: z.boolean().optional(),
});

// ───────────────── GET /api/participants?email=... ─────────────────
// Look up a participant by email (for returning users)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  if (!email) {
    return NextResponse.json({ ok: false, error: "Missing email" }, { status: 400 });
  }
  const participant = await findParticipantByEmail(email);
  return NextResponse.json({ ok: true, participant: participant || null });
}

// ───────────────── POST /api/participants ─────────────────
// Create a new participant. Rejects duplicate email with 409.
// Optionally joins the current event if joinCurrentEvent is true.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const input = parsed.data;
  const res = await createParticipant({
    ...input,
    events: input.joinCurrentEvent ? [EVENT_DATE_ISO] : [],
  } as any);

  if (!res.ok) {
    const code = res.code === "DUPLICATE_EMAIL" ? 409 : 400;
    return NextResponse.json({ ok: false, error: res.message, code: res.code }, { status: code });
  }

  return NextResponse.json({ ok: true, participant: res.participant });
}

// ───────────────── PUT /api/participants ─────────────────
// Update existing participant by email (returning users).
// Optionally joins the current event if joinCurrentEvent is true.
export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const input = parsed.data;

  // Update profile fields
  const upd = await updateParticipantByEmail(input.email, {
    ...input,
    // events merging handled in db helper; we pass none here
    events: [],
  } as any);

  if (!upd.ok) {
    const code = upd.code === "NOT_FOUND" ? 404 : 400;
    return NextResponse.json({ ok: false, error: upd.message, code: upd.code }, { status: code });
  }

  // Join current event (optional)
  if (input.joinCurrentEvent) {
    const joined = await joinEvent(input.email, EVENT_DATE_ISO);
    if (!joined.ok) {
      return NextResponse.json({ ok: false, error: joined.message }, { status: 400 });
    }
    return NextResponse.json({ ok: true, participant: joined.participant });
  }

  return NextResponse.json({ ok: true, participant: upd.participant });
}
