"use client";

import { useEffect, useMemo, useState } from "react";

type Row = {
  id: string;
  name: string;
  location: string; // "City, ST"
  rank: number;     // computed on server (read-only here)
  totalScore: number;
  wins: number;
  trainers: number;
  members: number;
};

export default function AdminLeaderboardPage() {
  const [token, setToken] = useState<string>("");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // New gym draft
  const [draft, setDraft] = useState({
    id: "",
    name: "",
    location: "",
    totalScore: "",
    wins: "",
    trainers: "",
    members: "",
  });

  // load token from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("adminToken") || "";
    if (saved) setToken(saved);
  }, []);

  // load leaderboard
  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/leaderboard", { cache: "no-store" });
      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Non-JSON from API: ${text.slice(0, 100)}`);
      }
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to load");
      setRows(data.data as Row[]);
    } catch (e: any) {
      setError(e?.message || "Load error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function saveToken() {
    localStorage.setItem("adminToken", token.trim());
    setMsg("Token saved.");
    setTimeout(() => setMsg(null), 1500);
  }

  async function saveRow(id: string, patch: Partial<Row>) {
    setMsg(null);
    setError(null);
    try {
      const payload: any = { id };
      // only include fields present in patch
      if (patch.name !== undefined) payload.name = patch.name;
      if (patch.location !== undefined) payload.location = patch.location;
      if (patch.totalScore !== undefined) payload.totalScore = Number(patch.totalScore);
      if (patch.wins !== undefined) payload.wins = Number(patch.wins);
      if (patch.trainers !== undefined) payload.trainers = Number(patch.trainers);
      if (patch.members !== undefined) payload.members = Number(patch.members);

      const res = await fetch("/api/leaderboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token.trim(),
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data?.error || "Save failed");
      }
      setMsg("Saved.");
      setRows(data.data as Row[]);
      setTimeout(() => setMsg(null), 1500);
    } catch (e: any) {
      setError(e?.message || "Save error");
    }
  }

  async function addGym() {
    setMsg(null);
    setError(null);

    const cleanedId = draft.id.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    if (!cleanedId) {
      setError("Please enter an ID (e.g., 'ironhouse').");
      return;
    }
    if (!draft.name.trim()) {
      setError("Please enter a gym name.");
      return;
    }
    if (!draft.location.trim()) {
      setError("Please enter a location (e.g., 'Edgewater, NJ').");
      return;
    }

    try {
      const res = await fetch("/api/leaderboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token.trim(),
        },
        body: JSON.stringify({
          id: cleanedId,
          name: draft.name.trim(),
          location: draft.location.trim(),
          totalScore: Number(draft.totalScore || 0),
          wins: Number(draft.wins || 0),
          trainers: Number(draft.trainers || 0),
          members: Number(draft.members || 0),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data?.error || "Create failed");
      setMsg("Gym added.");
      setRows(data.data as Row[]);
      setDraft({ id: "", name: "", location: "", totalScore: "", wins: "", trainers: "", members: "" });
      setTimeout(() => setMsg(null), 1500);
    } catch (e: any) {
      setError(e?.message || "Create error");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">Admin · Leaderboard</h1>
      <p className="text-muted mt-1">Update scores, wins, rosters. Ranks recompute automatically.</p>

      {/* Token */}
      <div className="mt-6 rounded-lg border border-accent/30 bg-card p-4">
        <label className="text-sm font-medium">Admin token</label>
        <div className="mt-2 flex gap-2">
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter your ADMIN_TOKEN"
            className="w-80 rounded-md border border-border bg-bg px-3 py-2 text-sm"
          />
          <button onClick={saveToken} className="rounded-md bg-white px-3 py-2 text-sm font-medium text-black">
            Save Token
          </button>
          <button onClick={load} className="rounded-md border border-border px-3 py-2 text-sm">
            Refresh Data
          </button>
        </div>
        <p className="mt-2 text-xs text-muted">
          Set in <code>.env.local</code> as <code>ADMIN_TOKEN=…</code> (you already did this).
        </p>
      </div>

      {/* Alerts */}
      {msg && <div className="mt-4 rounded-md bg-emerald-600/20 px-3 py-2 text-sm text-emerald-300">{msg}</div>}
      {error && <div className="mt-4 rounded-md bg-red-600/20 px-3 py-2 text-sm text-red-300">{error}</div>}

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-accent/30 bg-card">
        <table className="min-w-full text-sm">
          <thead className="bg-bg/50">
            <tr>
              <Th>Rank</Th>
              <Th>ID</Th>
              <Th>Gym</Th>
              <Th>Location</Th>
              <Th className="text-right">Score</Th>
              <Th className="text-right">Wins</Th>
              <Th className="text-right">Trainers</Th>
              <Th className="text-right">Members</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-3 py-3" colSpan={9}>Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td className="px-3 py-3" colSpan={9}>No data</td></tr>
            ) : (
              rows.map((r) => <EditableRow key={r.id} row={r} onSave={saveRow} />)
            )}
          </tbody>
        </table>
      </div>

      {/* Add new */}
      <div className="mt-8 rounded-lg border border-accent/30 bg-card p-4">
        <h2 className="text-lg font-bold">Add New Gym</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Input label="ID (slug)" value={draft.id} onChange={(v) => setDraft({ ...draft, id: v })} placeholder="ironhouse" />
          <Input label="Gym name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} placeholder="Iron House" />
          <Input label="Location" value={draft.location} onChange={(v) => setDraft({ ...draft, location: v })} placeholder="Edgewater, NJ" />
          <Input label="Total score" value={draft.totalScore} onChange={(v) => setDraft({ ...draft, totalScore: v })} type="number" />
          <Input label="Wins" value={draft.wins} onChange={(v) => setDraft({ ...draft, wins: v })} type="number" />
          <Input label="Trainers" value={draft.trainers} onChange={(v) => setDraft({ ...draft, trainers: v })} type="number" />
          <Input label="Members" value={draft.members} onChange={(v) => setDraft({ ...draft, members: v })} type="number" />
        </div>
        <div className="mt-3">
          <button onClick={addGym} className="rounded-md bg-white px-3 py-2 text-sm font-medium text-black">
            Add Gym
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- small helper components ---------- */

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-3 py-2 text-left text-xs uppercase tracking-wide text-muted ${className}`}>{children}</th>;
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <label className={`grid gap-1 text-sm ${className}`}>
      <span className="font-medium">{label}</span>
      <input
        type={type}
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-md border border-border bg-bg px-3 py-2"
      />
    </label>
  );
}

function EditableRow({ row, onSave }: { row: Row; onSave: (id: string, patch: Partial<Row>) => void }) {
  const [vals, setVals] = useState({
    name: row.name,
    location: row.location,
    totalScore: String(row.totalScore),
    wins: String(row.wins),
    trainers: String(row.trainers),
    members: String(row.members),
  });

  const changed = useMemo(() => {
    const diff: Partial<Row> = {};
    if (vals.name !== row.name) diff.name = vals.name;
    if (vals.location !== row.location) diff.location = vals.location;
    if (Number(vals.totalScore) !== row.totalScore) diff.totalScore = Number(vals.totalScore);
    if (Number(vals.wins) !== row.wins) diff.wins = Number(vals.wins);
    if (Number(vals.trainers) !== row.trainers) diff.trainers = Number(vals.trainers);
    if (Number(vals.members) !== row.members) diff.members = Number(vals.members);
    return diff;
  }, [vals, row]);

  return (
    <tr className="hover:bg-accent/5">
      <td className="px-3 py-3">{row.rank}</td>
      <td className="px-3 py-3 text-xs text-muted">{row.id}</td>
      <td className="px-3 py-3">
        <input
          className="w-56 rounded-md border border-border bg-bg px-2 py-1"
          value={vals.name}
          onChange={(e) => setVals((v) => ({ ...v, name: e.target.value }))}
        />
      </td>
      <td className="px-3 py-3">
        <input
          className="w-44 rounded-md border border-border bg-bg px-2 py-1"
          value={vals.location}
          onChange={(e) => setVals((v) => ({ ...v, location: e.target.value }))}
          placeholder="City, ST"
        />
      </td>
      <td className="px-3 py-3 text-right">
        <input
          type="number"
          className="w-24 rounded-md border border-border bg-bg px-2 py-1 text-right"
          value={vals.totalScore}
          onChange={(e) => setVals((v) => ({ ...v, totalScore: e.target.value }))}
        />
      </td>
      <td className="px-3 py-3 text-right">
        <input
          type="number"
          className="w-16 rounded-md border border-border bg-bg px-2 py-1 text-right"
          value={vals.wins}
          onChange={(e) => setVals((v) => ({ ...v, wins: e.target.value }))}
        />
      </td>
      <td className="px-3 py-3 text-right">
        <input
          type="number"
          className="w-16 rounded-md border border-border bg-bg px-2 py-1 text-right"
          value={vals.trainers}
          onChange={(e) => setVals((v) => ({ ...v, trainers: e.target.value }))}
        />
      </td>
      <td className="px-3 py-3 text-right">
        <input
          type="number"
          className="w-20 rounded-md border border-border bg-bg px-2 py-1 text-right"
          value={vals.members}
          onChange={(e) => setVals((v) => ({ ...v, members: e.target.value }))}
        />
      </td>
      <td className="px-3 py-3">
        <button
          disabled={Object.keys(changed).length === 0}
          onClick={() => onSave(row.id, changed)}
          className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-black disabled:cursor-not-allowed disabled:opacity-50"
          title={Object.keys(changed).length === 0 ? "No changes" : "Save changes"}
        >
          Save
        </button>
      </td>
    </tr>
  );
}
