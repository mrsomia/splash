import NewTournamentForm from "@/components/NewTournamentForm";

export default function NewTournament() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8">
      <h1 className="text-lg">Create Tournament</h1>
      <NewTournamentForm />
    </main>
  );
}
