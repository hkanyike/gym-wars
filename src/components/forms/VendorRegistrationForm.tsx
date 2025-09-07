"use client";

import { useState } from "react";

type FormVals = {
  businessName: string;
  email: string;
  city: string;
  state: string;
  boothSize: string;
  website?: string;
  agree: boolean;
};

type Errors = Partial<Record<keyof FormVals, string>>;

const INITIAL: FormVals = {
  businessName: "",
  email: "",
  city: "",
  state: "",
  boothSize: "",
  website: "",
  agree: false,
};

export default function VendorRegistrationForm() {
  const [vals, setVals] = useState<FormVals>({ ...INITIAL });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [serverErr, setServerErr] = useState<string | null>(null);

  function validate(v: FormVals): Errors {
    const e: Errors = {};
    if (!v.businessName.trim()) e.businessName = "Business name is required";
    if (!v.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(v.email)) e.email = "Enter a valid email";
    if (!v.city.trim()) e.city = "City is required";
    if (!v.state.trim()) e.state = "State is required";
    if (!v.boothSize) e.boothSize = "Select a booth size";
    if (!v.agree) e.agree = "You must agree to the vendor terms";
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
      const res = await fetch("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vals),
      });
      const ct = res.headers.get("content-type") || "";
      const payload = ct.includes("application/json")
        ? await res.json()
        : { ok: false, error: await res.text() };

      if (!res.ok || !payload?.ok) {
        throw new Error(payload?.error || `Request failed (status ${res.status})`);
      }

      setSuccess("Thank you! Your vendor registration has been received.");
      setVals({ ...INITIAL });
    } catch (err: any) {
      setServerErr(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputCls = (bad?: boolean) =>
    `rounded-md border px-3 py-2 bg-bg ${bad ? "border-red-500" : "border-border"}`;

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {success && (
        <div className="rounded-md bg-emerald-600/20 px-3 py-2 text-emerald-300 text-sm">
          {success}
        </div>
      )}
      {serverErr && (
        <div className="rounded-md bg-red-600/20 px-3 py-2 text-red-300 text-sm">
          {serverErr}
        </div>
      )}

      {/* Row 1 */}
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Business name</span>
          <input
            className={inputCls(!!errors.businessName)}
            value={vals.businessName}
            onChange={(e) => setVals((v) => ({ ...v, businessName: e.target.value }))}
            placeholder="e.g., Alpha Nutrition"
          />
          {errors.businessName && (
            <span className="text-xs text-red-400">{errors.businessName}</span>
          )}
        </label>

        <label className="grid gap-1 text-sm">
          <span className="font-medium">Contact email</span>
          <input
            type="email"
            className={inputCls(!!errors.email)}
            value={vals.email}
            onChange={(e) => setVals((v) => ({ ...v, email: e.target.value }))}
            placeholder="name@company.com"
          />
          {errors.email && (
            <span className="text-xs text-red-400">{errors.email}</span>
          )}
        </label>
      </div>

      {/* Row 2 */}
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span className="font-medium">City</span>
          <input
            className={inputCls(!!errors.city)}
            value={vals.city}
            onChange={(e) => setVals((v) => ({ ...v, city: e.target.value }))}
            placeholder="City"
          />
          {errors.city && (
            <span className="text-xs text-red-400">{errors.city}</span>
          )}
        </label>

        <label className="grid gap-1 text-sm">
          <span className="font-medium">State</span>
          <input
            className={inputCls(!!errors.state)}
            value={vals.state}
            onChange={(e) => setVals((v) => ({ ...v, state: e.target.value }))}
            placeholder="State"
          />
          {errors.state && (
            <span className="text-xs text-red-400">{errors.state}</span>
          )}
        </label>
      </div>

      {/* Row 3 */}
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Booth size</span>
          <select
            className="rounded-md border px-3 py-2 bg-white text-black"
            value={vals.boothSize}
            onChange={(e) => setVals((v) => ({ ...v, boothSize: e.target.value }))}
          >
            <option value="">Select a booth</option>
            <option value="10x10">10×10 — $300</option>
            <option value="10x20">10×20 — $550</option>
            <option value="20x20">20×20 — $1000</option>
          </select>
          {errors.boothSize && (
            <span className="text-xs text-red-400">{errors.boothSize}</span>
          )}
        </label>

        <label className="grid gap-1 text-sm">
          <span className="font-medium">Website (optional)</span>
          <input
            className={inputCls(false)}
            value={vals.website}
            onChange={(e) => setVals((v) => ({ ...v, website: e.target.value }))}
            placeholder="https://yourbrand.com"
          />
        </label>
      </div>

      {/* Agreement */}
      <label className="mt-1 inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="h-4 w-4"
          checked={vals.agree}
          onChange={(e) => setVals((v) => ({ ...v, agree: e.target.checked }))}
        />
        I agree to the vendor terms
      </label>
      {errors.agree && (
        <span className="text-xs text-red-400">{errors.agree}</span>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-1 w-fit rounded-md bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
      >
        {submitting ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}
