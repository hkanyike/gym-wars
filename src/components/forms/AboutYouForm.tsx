"use client";

import { useEffect, useState } from "react";

type Gym = { id: string; name: string; location: string };

type Vals = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "Trainer" | "Member" | "";
  emergencyName: string;
  emergencyPhone: string;
  gymId: string;
  state?: string; // optional here if you also want it
};

type Errors = Partial<Record<keyof Vals, string>>;

const INITIAL: Vals = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "",
  emergencyName: "",
  emergencyPhone: "",
  gymId: "",
  state: "",
};

const STATES = [
  { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" }, { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" },
  { code: "DC", name: "District of Columbia" }, { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" }, { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" }, { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" }, { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" }, { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" }, { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" }, { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" }, { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" }, { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" }, { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" }, { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" }, { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" }, { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" }, { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" }, { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" }, { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" }, { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" }, { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" }, { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" }, { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" }, { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

export default function AboutYouForm() {
  const [vals, setVals] = useState<Vals>({ ...INITIAL });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [serverErr, setServerErr] = useState<string | null>(null);

  const [gyms, setGyms] = useState<Gym[]>([]);
  const [showRequest, setShowRequest] = useState(false);
  const [req, setReq] = useState({ gymName: "", city: "", state: "", contactEmail: "" });
  const [reqMsg, setReqMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/gyms", { cache: "no-store" });
        const ct = res.headers.get("content-type") || "";
        const data = ct.includes("application/json") ? await res.json() : { ok: false };
        if (data.ok) setGyms(data.data as Gym[]);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    const g = url.searchParams.get("gym");
    if (g && !vals.gymId) setVals((v) => ({ ...v, gymId: g }));
  }, [vals.gymId]);

  function validate(v: Vals): Errors {
    const e: Errors = {};
    if (!v.firstName.trim()) e.firstName = "First name is required";
    if (!v.lastName.trim()) e.lastName = "Last name is required";
    if (!v.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(v.email)) e.email = "Enter a valid email";
    if (!v.phone.trim()) e.phone = "Phone is required";
    if (!v.role) e.role = "Select a role";
    if (!v.emergencyName.trim()) e.emergencyName = "Emergency contact is required";
    if (!v.emergencyPhone.trim()) e.emergencyPhone = "Emergency contact phone is required";
    if (!v.gymId) e.gymId = "Select your gym (or request it below)";
    return e;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(null);
    setServerErr(null);

    const eMap = validate(vals);
    setErrors(eMap);
    if (Object.keys(eMap).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vals),
      });
      const ct = res.headers.get("content-type") || "";
      const data = ct.includes("application/json") ? await res.json() : { ok: false, error: await res.text() };
      if (!res.ok || !data.ok) throw new Error(data.error || "Server error");

      setSuccess("Thanks! You’re registered. Your gym rep will see you on the roster.");
      setVals({ ...INITIAL });
    } catch (err: any) {
      setServerErr(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitGymRequest() {
    setReqMsg(null);
    const { gymName, city, state, contactEmail } = req;
    if (!gymName || !city || !state || !contactEmail) {
      setReqMsg("Please fill all fields.");
      return;
    }
    try {
      const res = await fetch("/api/gym-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });
      const ct = res.headers.get("content-type") || "";
      const data = ct.includes("application/json") ? await res.json() : { ok: false, error: await res.text() };
      if (!res.ok || !data.ok) throw new Error(data.error || "Request failed");

      setReqMsg("Thanks! We’ve notified the event team to invite your gym.");
      setReq({ gymName: "", city: "", state: "", contactEmail: "" });
      setShowRequest(false);
    } catch (err: any) {
      setReqMsg(err?.message || "Something went wrong. Try again.");
    }
  }

  const inputCls = (bad?: boolean) =>
    `rounded-md border px-3 py-2 ${bad ? "border-red-500" : "border-border"} bg-bg`;

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {success && <div className="rounded-md bg-emerald-600/20 px-3 py-2 text-emerald-300 text-sm">{success}</div>}
      {serverErr && <div className="rounded-md bg-red-600/20 px-3 py-2 text-red-300 text-sm">{serverErr}</div>}

      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span className="font-medium">First name</span>
          <input className={inputCls(!!errors.firstName)} value={vals.firstName}
            onChange={(e) => setVals((v) => ({ ...v, firstName: e.target.value }))} />
          {errors.firstName && <span className="text-xs text-red-400">{errors.firstName}</span>}
        </label>

        <label className="grid gap-1 text-sm">
          <span className="font-medium">Last name</span>
          <input className={inputCls(!!errors.lastName)} value={vals.lastName}
            onChange={(e) => setVals((v) => ({ ...v, lastName: e.target.value }))} />
          {errors.lastName && <span className="text-xs text-red-400">{errors.lastName}</span>}
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Email</span>
          <input type="email" className={inputCls(!!errors.email)} value={vals.email}
            onChange={(e) => setVals((v) => ({ ...v, email: e.target.value }))} />
          {errors.email && <span className="text-xs text-red-400">{errors.email}</span>}
        </label>

        <label className="grid gap-1 text-sm">
          <span className="font-medium">Phone</span>
          <input className={inputCls(!!errors.phone)} value={vals.phone}
            onChange={(e) => setVals((v) => ({ ...v, phone: e.target.value }))} placeholder="###-###-####" />
          {errors.phone && <span className="text-xs text-red-400">{errors.phone}</span>}
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Role</span>
          <select
            className="rounded-md border border-border bg-white text-black px-3 py-2"
            value={vals.role}
            onChange={(e) => setVals((v) => ({ ...v, role: e.target.value as Vals["role"] }))}
          >
            <option value="">Select role</option>
            <option value="Trainer">Trainer</option>
            <option value="Member">Member</option>
          </select>
          {errors.role && <span className="text-xs text-red-400">{errors.role}</span>}
        </label>

        <label className="grid gap-1 text-sm">
          <span className="font-medium">Gym</span>
          <select
            className="rounded-md border border-border bg-white text-black px-3 py-2"
            value={vals.gymId}
            onChange={(e) => setVals((v) => ({ ...v, gymId: e.target.value }))}
          >
            <option value="">Select your gym</option>
            {gyms.map((g) => (
              <option key={g.id} value={g.id}>{g.name} — {g.location}</option>
            ))}
          </select>
          {errors.gymId && <span className="text-xs text-red-400">{errors.gymId}</span>}
          <button type="button" onClick={() => setShowRequest((s) => !s)} className="mt-1 w-fit text-xs text-accent underline">
            Can’t find your gym?
          </button>
        </label>
      </div>

      {/* Optional: participant state, with datalist */}
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span className="font-medium">State (optional)</span>
          <input
            list="us-states"
            className={inputCls(false)}
            placeholder="Start typing (e.g., N → NJ, NY, NM...)"
            value={vals.state || ""}
            onChange={(e) => setVals((v) => ({ ...v, state: e.target.value }))}
          />
          <datalist id="us-states">
            {STATES.map((s) => (
              <option key={s.code} value={s.code}>{s.name}</option>
            ))}
          </datalist>
        </label>
      </div>

      {/* Request missing gym */}
      {showRequest && (
        <div className="rounded-md border border-accent/30 bg-card p-4 text-sm">
          <div className="grid gap-2 md:grid-cols-2">
            <input className="rounded-md border border-border bg-bg px-3 py-2" placeholder="Gym name"
              value={req.gymName} onChange={(e) => setReq({ ...req, gymName: e.target.value })} />
            <input className="rounded-md border border-border bg-bg px-3 py-2" placeholder="Contact email"
              value={req.contactEmail} onChange={(e) => setReq({ ...req, contactEmail: e.target.value })} />
            <input className="rounded-md border border-border bg-bg px-3 py-2" placeholder="City"
              value={req.city} onChange={(e) => setReq({ ...req, city: e.target.value })} />
            <input className="rounded-md border border-border bg-bg px-3 py-2" placeholder="State"
              value={req.state} onChange={(e) => setReq({ ...req, state: e.target.value })} list="us-states" />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <button type="button" onClick={submitGymRequest} className="rounded-md bg-white px-3 py-1.5 text-black">
              Submit request
            </button>
            {reqMsg && <span className="text-xs text-muted">{reqMsg}</span>}
          </div>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Emergency contact name</span>
          <input className={inputCls(!!errors.emergencyName)} value={vals.emergencyName}
            onChange={(e) => setVals((v) => ({ ...v, emergencyName: e.target.value }))} />
          {errors.emergencyName && <span className="text-xs text-red-400">{errors.emergencyName}</span>}
        </label>

        <label className="grid gap-1 text-sm">
          <span className="font-medium">Emergency contact phone</span>
          <input className={inputCls(!!errors.emergencyPhone)} value={vals.emergencyPhone}
            onChange={(e) => setVals((v) => ({ ...v, emergencyPhone: e.target.value }))} placeholder="###-###-####" />
          {errors.emergencyPhone && <span className="text-xs text-red-400">{errors.emergencyPhone}</span>}
        </label>
      </div>

      <button type="submit" disabled={submitting} className="mt-1 w-fit rounded-md bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50">
        {submitting ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}
