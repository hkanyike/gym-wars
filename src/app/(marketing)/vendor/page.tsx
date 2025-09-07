import { VendorRegistrationForm } from "@/components/forms/VendorRegistrationForm";

export default function VendorsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">Vendor Registration</h1>
      <p className="text-muted mt-1">Book your booth and join the next Gym Wars event.</p>

      <section className="mt-8 rounded-lg border border-accent/30 bg-card p-6">
        <VendorRegistrationForm />
      </section>
    </div>
  );
}
