import {
  getMatchesForTournament,
  getTournamentFromId,
  isUserAnAdmin,
} from "@/db/tournament";
import { getTeamsForTournament } from "@/db/teams";
import { Suspense } from "react";
import Spinner from "@/components/Spinner";
import Link from "next/link";
import ScheduleButton from "@/components/ScheduleButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

  const session = await getServerSession(authOptions);
  let isAdmin = false;
  if (session?.user?.email) {
    const email = session.user.email;
    isAdmin = await isUserAnAdmin(email, params.id);
  }
  console.log({ isAdmin });

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8">
      <div className="flex gap-4">
        {isAdmin ? (
          <Link href={`/tournament/${tournament.id}/signup`}>Add Teams</Link>
        ) : null}
        {games.length ? (
          <Link href={`/tournament/${tournament.id}/schedule`}>Schedule</Link>
        ) : (
          <ScheduleButton id={params.id} />
        )}
      </div>
      <Suspense fallback={<Spinner />}>
        <h1>{tournament.name}</h1>
        <p>{`starts at ${start.toLocaleTimeString()}`}</p>
        <p>{`on ${start.toLocaleDateString()}`}</p>
        {teams.length ? (
          <p>{`${teams.length} team${teams.length !== 1 ? "s" : ""}`}</p>
        ) : null}
      </Suspense>
    </main>
  );
}
