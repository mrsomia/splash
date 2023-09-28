import { getTournamentFromId } from "@/db/tournament";
import { getTeamsForTournament } from "@/db/teams";
import { Suspense } from "react";
import Spinner from "@/components/Spinner";
import Link from "next/link";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function TournamentPage({ params }: PageProps) {
  console.log(params);
  const tournament = await getTournamentFromId(params.id);
  const teams = await getTeamsForTournament(params.id);
  const start = new Date(tournament.startTime);
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8">
      <Link href={`/tournament/${tournament.id}/signup`}>signup</Link>
      <Suspense fallback={<Spinner />}>
        <h1>{tournament.name}</h1>
        <span>{`starts at ${start.toLocaleTimeString()} on ${start.toLocaleDateString()}`}</span>
        {teams.length ? (
          <p>{`${teams.length} team${teams.length !== 1 ? "s" : ""}`}</p>
        ) : null}
      </Suspense>
    </main>
  );
}
