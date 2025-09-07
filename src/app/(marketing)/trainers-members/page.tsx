import AboutYouForm from "@/components/forms/AboutYouForm";

export const metadata = {
  title: "Trainers & Members | Gym Wars",
  description: "Register yourself and join your gym’s roster.",
};

export default function TrainersMembersPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <p className="text-sm text-muted">Roster</p>
        <h1 className="text-3xl font-extrabold">Trainers & Members</h1>
        <p className="mt-2 text-muted">
          Tell us about you, choose your gym, and you’re on the roster.
          If your gym isn’t registered yet, you can request an invite.
        </p>
      </header>

      <AboutYouForm />
    </div>
  );
}
