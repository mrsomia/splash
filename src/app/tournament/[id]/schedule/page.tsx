import { getTournamentFromId } from "@/db/tournament";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function TournamentPage({ params }: PageProps) {
  const tournament = await getTournamentFromId(params.id);
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8">
      <h1>{`Schedule for ${tournament.name}`}</h1>
    </main>
  );
}
