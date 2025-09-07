// src/lib/db.ts
import { promises as fs } from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

type Participant = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: "Trainer" | "Member";
  emergencyContact?: string;
  emergencyContactPhone?: string;
  gymId?: string | null;
  gymName?: string | null;
  events: string[];
  createdAt: string;
  updatedAt: string;
};

type DB = {
  participants: Participant[];
};

async function readDB(): Promise<DB> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    return JSON.parse(raw) as DB;
  } catch {
    const fresh: DB = { participants: [] };
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(fresh, null, 2), "utf8");
    return fresh;
  }
}

async function writeDB(db: DB): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

function nowISO() {
  return new Date().toISOString();
}

function uuid() {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

export async function findParticipantByEmail(email: string) {
  const db = await readDB();
  const e = email.trim().toLowerCase();
  return db.participants.find(p => p.email.toLowerCase() === e) || null;
}

export async function createParticipant(input: Omit<Participant, "id" | "createdAt" | "updatedAt">) {
  const db = await readDB();
  const exists = db.participants.find(p => p.email.toLowerCase() === input.email.toLowerCase());
  if (exists) {
    return { ok: false as const, code: "DUPLICATE_EMAIL", message: "This email is already registered." };
  }
  const p: Participant = { ...input, id: uuid(), createdAt: nowISO(), updatedAt: nowISO() };
  db.participants.push(p);
  await writeDB(db);
  return { ok: true as const, participant: p };
}

export async function updateParticipantByEmail(email: string, updates: Partial<Participant>) {
  const db = await readDB();
  const e = email.trim().toLowerCase();
  const idx = db.participants.findIndex(p => p.email.toLowerCase() === e);
  if (idx === -1) {
    return { ok: false as const, code: "NOT_FOUND", message: "No participant with that email." };
  }
  const current = db.participants[idx];
  const merged: Participant = {
    ...current,
    ...updates,
    email: current.email,
    events: Array.from(new Set([...(current.events || []), ...((updates.events as string[]) || [])])),
    updatedAt: nowISO(),
  };
  db.participants[idx] = merged;
  await writeDB(db);
  return { ok: true as const, participant: merged };
}

export async function joinEvent(email: string, eventId: string) {
  const db = await readDB();
  const e = email.trim().toLowerCase();
  const idx = db.participants.findIndex(p => p.email.toLowerCase() === e);
  if (idx === -1) return { ok: false as const, code: "NOT_FOUND", message: "No participant with that email." };
  const p = db.participants[idx];
  if (!p.events.includes(eventId)) p.events.push(eventId);
  p.updatedAt = nowISO();
  await writeDB(db);
  return { ok: true as const, participant: p };
}
// Get all participants (for exports/admin lists)
export async function getAllParticipants() {
  const db = await readDB();
  return db.participants;
}
