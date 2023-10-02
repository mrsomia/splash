import { getMatchesForTournament, getTournamentFromId } from "@/db/tournament";
import { getTeamsForTournament } from "@/db/teams";
import { Suspense } from "react";
import Spinner from "@/components/Spinner";
import Link from "next/link";
import ScheduleButton from "@/components/ScheduleButton";

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
  const games = await getMatchesForTournament(params.id);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8">
      <div className="flex gap-4">
        <Link href={`/tournament/${tournament.id}/signup`}>signup</Link>
        {games.length ? (
          <Link href={`/tournament/${tournament.id}/schedule`}>Schedule</Link>
        ) : (
          <ScheduleButton id={params.id} />
        )}
      </div>
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
