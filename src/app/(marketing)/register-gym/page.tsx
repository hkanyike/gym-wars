import RegisterGymForm from "@/components/forms/RegisterGymForm";

export const metadata = {
  title: "Register Gym | Gym Wars",
  description: "Register your gym, confirm the participation agreement, and get your roster link.",
};

export default function RegisterGymPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <p className="text-sm text-muted">Event Registration</p>
        <h1 className="text-3xl font-extrabold">Register Your Gym</h1>
        <p className="mt-2 text-muted">
          Register your gym and sign the participation agreement. You’ll receive a roster link for trainers & members to join.
        </p>
      </header>

      <RegisterGymForm />
    </div>
  );
}
