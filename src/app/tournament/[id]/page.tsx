import { isUserAnAdmin } from "@/db/tournament";
import { getTeamsForTournament } from "@/db/teams";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCurrentMatches } from "@/db/match";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function TournamentPage({ params }: PageProps) {
  const teams = await getTeamsForTournament(params.id);
  const currentMatches = await getCurrentMatches(params.id);

  const session = await getServerSession(authOptions);
  let isAdmin = false;
  if (session?.user?.email) {
    const email = session.user.email;
    isAdmin = await isUserAnAdmin(email, params.id);
  }
  console.log({ isAdmin });

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between py-4 gap-2">
        <h2 className="text-lg md:text-2xl font-medium">
          Current Active Games
        </h2>
        {currentMatches.length > 0 ? (
          <ul className="flex flex-col gap-4 justify-center items-center py-2">
            {currentMatches.map((match) => (
              <li key={match.id}>
                <Link href={`/tournament/${params.id}/match/${match.id}`}>
                  {`${match.teamA} vs ${match.teamB}`}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex justify-center">
            <p className="text-gray-300 italic">
              There are no active games currently
            </p>
          </div>
        )}
      </div>
      {teams.length ? (
        <>
          <div className="flex py-2 items-end w-full">
            <h2 className="text-lg md:text-2xl font-medium">Teams</h2>
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
    </>
  );
}
