import NewTournamentForm from "@/components/NewTournamentForm";

export default function NewTournament() {
  return (
    <main className="min-h-screen">
      <h1 className="text-xl font-semibold mx-auto text-center py-8 px-4">
        Create Tournament
      </h1>
      <div className="w-3/5 sm:max-w-xs mx-auto">
        <NewTournamentForm />
      </div>
    </main>
  );
}
