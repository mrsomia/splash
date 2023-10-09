import {
  getMatchesForTournament,
  getTournamentFromId,
  isUserAnAdmin,
} from "@/db/tournament";
import { getTeamsForTournament } from "@/db/teams";
import { Suspense } from "react";
import Spinner from "@/components/Spinner";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import TournamentHeader from "@/components/TournamentHeader";
import TournamentNav from "@/components/TournamentNav";

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
    <main className="min-h-screen mx-8 my-4 md:my-20 md:max-w-4xl md:mx-auto">
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
        <div className="flex justify-between py-4">
          {/* TODO: Make this interactive */}
          <h2 className="text-2xl font-medium">Current Active Games</h2>
          <ul className="flex gap-8 justify-center">
            <li>12 vs 2</li>
            <li>15 vs 18</li>
            <li>16 vs 9</li>
            <li>17 vs 28</li>
          </ul>
        </div>
        {teams.length ? (
          <>
            <div className="flex py-4 items-end w-full">
              <h2 className="text-2xl font-medium">Teams</h2>
            </div>
            <div className="py-2 grid grid-cols-2 md:grid-cols-3 m-auto">
              {teams.map((team) => (
                <Link
                  href={`/tournament/${params.id}/teams/${team.id}`}
                  key={team.id}
                >
                  <p className="px-2 py-1 text-center">{team.name}</p>
                </Link>
              ))}
            </div>
          </>
        ) : null}
      </Suspense>
    </main>
  );
}
