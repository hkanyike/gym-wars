import VendorRegistrationForm from "@/components/forms/VendorRegistrationForm";

export const metadata = {
  title: "Vendors | Gym Wars",
  description: "Vendor booths, pricing, and registration for Gym Wars events.",
};

const BOOTHS = [
  {
    size: "10×10",
    price: 300,
    includes: ["1 table, 2 chairs", "Standard placement", "2 vendor passes"],
  },
  {
    size: "10×20",
    price: 550,
    includes: ["2 tables, 4 chairs", "Premium placement", "4 vendor passes"],
  },
  {
    size: "20×20",
    price: 1000,
    includes: ["Custom layout", "Prime placement", "6 vendor passes"],
  },
];

export default function VendorsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <p className="text-muted text-sm">Partner With Us</p>
        <h1 className="text-3xl font-extrabold">Vendors</h1>
        <p className="mt-2 text-muted">
          Reach highly engaged athletes, trainers, and gym communities. Choose a
          booth size, review disclaimers, agree to terms, and register below.
        </p>
      </header>

      {/* Booth options */}
      <section className="mb-10">
        <h2 className="text-xl font-bold">Booth Options</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {BOOTHS.map((b) => (
            <div
              key={b.size}
              className="rounded-xl border border-white/10 bg-card p-5"
            >
              <h3 className="text-lg font-semibold">{b.size}</h3>
              <p className="mt-1 text-2xl font-extrabold">${b.price}</p>
              <ul className="mt-3 list-disc pl-5 text-sm text-muted">
                {b.includes.map((i, idx) => (
                  <li key={idx}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted">
          *Electric, Wi-Fi, and special placement available on request (fees may
          apply).
        </p>
      </section>

      {/* Disclaimers / terms summary */}
      <section className="mb-10 rounded-xl border border-white/10 bg-card p-5">
        <h2 className="text-lg font-bold">Vendor Terms (Summary)</h2>
        <ul className="mt-3 list-disc pl-5 text-sm text-muted">
          <li>Setup opens 2 hours before doors; teardown after final heat.</li>
          <li>Liability insurance required for product demos; COI naming host.</li>
          <li>No hazardous materials or amplified audio without approval.</li>
          <li>All sales handled by vendor; comply with local tax rules.</li>
        </ul>
      </section>

      {/* Registration form */}
      <section>
        <h2 className="mb-3 text-xl font-bold">Register as a Vendor</h2>
        <VendorRegistrationForm />
      </section>
    </div>
  );
}
