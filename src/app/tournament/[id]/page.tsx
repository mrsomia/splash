import { getTournamentFromId } from "@/db/tournament";
import { Suspense } from "react";
import Spinner from "@/components/Spinner";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function TournamentPage({ params }: PageProps) {
  console.log(params);
  const tournament = await getTournamentFromId(params.id);
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8">
      <Suspense fallback={<Spinner />}>
        <h1>{tournament.name}</h1>
        <span>{`starts at ${new Date(
          tournament.startTime,
        ).toLocaleTimeString()}`}</span>
      </Suspense>
    </main>
  );
}
