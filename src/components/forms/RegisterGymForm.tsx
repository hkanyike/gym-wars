"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

type GymRegisterValues = {
  gymName: string;
  website?: string;
  city: string;
  state: string;      // will use datalist
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  agree: boolean;
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

export default function RegisterGymForm() {
  const form = useForm<GymRegisterValues>({
    defaultValues: {
      gymName: "",
      website: "",
      city: "",
      state: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      agree: false,
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [serverErr, setServerErr] = useState<string | null>(null);

  async function onSubmit(values: GymRegisterValues) {
    try {
      setSubmitting(true);
      setSuccess(null);
      setServerErr(null);

      const res = await fetch("/api/register-gym", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const ct = res.headers.get("content-type") || "";
      const payload = ct.includes("application/json")
        ? await res.json()
        : { ok: false, error: await res.text() };

      if (!res.ok || !payload?.ok) {
        throw new Error(payload?.error || "Server error");
      }

      setSuccess("Thanks! Your gym has been registered. We’ve sent you the roster link for trainers & members.");
      form.reset();
    } catch (err: any) {
      setServerErr(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputCls = "rounded-md border border-border bg-bg px-3 py-2";

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
      {/* Alerts */}
      {success && (
        <div className="rounded-md bg-emerald-600/20 px-3 py-2 text-emerald-300 text-sm">{success}</div>
      )}
      {serverErr && (
        <div className="rounded-md bg-red-600/20 px-3 py-2 text-red-300 text-sm">{serverErr}</div>
      )}

      {/* Gym details */}
      <section className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Gym name</span>
          <input className={inputCls} {...form.register("gymName", { required: true })} />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Website (optional)</span>
          <input className={inputCls} placeholder="https://yourgym.com" {...form.register("website")} />
        </label>

        <label className="grid gap-1 text-sm">
          <span className="font-medium">City</span>
          <input className={inputCls} {...form.register("city", { required: true })} />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium">State</span>
          <input
            list="us-states"
            className={inputCls}
            placeholder="Start typing (e.g., N → NJ, NY, NM...)"
            {...form.register("state", { required: true })}
          />
          <datalist id="us-states">
            {STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </datalist>
        </label>
      </section>

      {/* Contact (no “rep” wording) */}
      <section className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span className="font-medium">First name</span>
          <input className={inputCls} {...form.register("firstName", { required: true })} />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Last name</span>
          <input className={inputCls} {...form.register("lastName", { required: true })} />
        </label>

        <label className="grid gap-1 text-sm">
          <span className="font-medium">Email</span>
          <input type="email" className={inputCls} {...form.register("email", { required: true })} />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Phone</span>
          <input className={inputCls} placeholder="###-###-####" {...form.register("phone", { required: true })} />
        </label>
      </section>

      {/* Agreement */}
      <label className="mt-1 inline-flex items-center gap-2 text-sm">
        <input type="checkbox" className="h-4 w-4" {...form.register("agree", { required: true })} />
        I agree to the participation agreement
      </label>

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
