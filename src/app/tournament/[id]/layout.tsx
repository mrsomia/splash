import {
  getMatchesForTournament,
  getTournamentFromId,
  isUserAnAdmin,
} from "@/db/tournament";
import { getTeamsForTournament } from "@/db/teams";
import { Suspense } from "react";
import Spinner from "@/components/Spinner";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import TournamentHeader from "@/components/TournamentHeader";
import TournamentNav from "@/components/TournamentNav";

type PageProps = {
  params: {
    id: string;
  };
  children: JSX.Element[] | JSX.Element;
};

export default async function TournamentPage({ params, children }: PageProps) {
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

  console.info({ isAdmin });

  return (
    <main className="min-h-screen mx-6 my-4 md:my-20 md:max-w-4xl md:mx-auto">
      <Suspense fallback={<Spinner />}>
        <TournamentHeader
          name={tournament.name}
          totalTeams={teams.length}
          start={start}
        />
        <TournamentNav
          id={params.id}
          isAdmin={isAdmin}
          started={games.length > 0}
        />
        {children}
      </Suspense>
    </main>
  );
}
