import { NextResponse } from "next/server";
import { getAllParticipants } from "@/lib/db";

function csvEscape(v: any) {
  let s = String(v ?? "");
  if (s.includes('"') || s.includes(",") || s.includes("\n")) {
    s = '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

export async function GET() {
  const rows = await getAllParticipants();

  const headers = [
    "id",
    "email",
    "firstName",
    "lastName",
    "role",
    "phone",
    "gymName",
    "gymId",
    "emergencyContact",
    "emergencyContactPhone",
    "events",
    "createdAt",
    "updatedAt",
  ];

  const lines = [
    headers.join(","), // header row
    ...rows.map((p: any) =>
      [
        p.id,
        p.email,
        p.firstName,
        p.lastName,
        p.role,
        p.phone,
        p.gymName,
        p.gymId,
        p.emergencyContact,
        p.emergencyContactPhone,
        Array.isArray(p.events) ? p.events.join("|") : "",
        p.createdAt,
        p.updatedAt,
      ].map(csvEscape).join(",")
    ),
  ];

  const csv = lines.join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="participants.csv"',
      "Cache-Control": "no-store",
    },
  });
}
