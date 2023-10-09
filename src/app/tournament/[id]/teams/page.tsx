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
    <main className="min-h-screen mx-8 my-4 md:my-20 md:max-w-4xl md:mx-auto">
      <Suspense fallback={<Spinner />}>
        <div className="flex items-center py-4">
          <h1 className="text-3xl capitalize font-semibold py-6 mr-auto">
            {tournament.name}
          </h1>
          <div>
            <p>{`on ${start.toLocaleDateString()}`}</p>
            <p>{`starts at ${start.toLocaleTimeString()}`}</p>
          </div>
        </div>
        {teams.length ? (
          <>
            <div className="flex py-4 items-end w-full">
              <h2 className="text-2xl font-medium mr-16">Teams</h2>
              <span className="block">{`${teams.length} team${
                teams.length !== 1 ? "s" : ""
              }`}</span>
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
