import { getTeamInfoForTournament } from "@/db/teams";

type PageProps = {
  params: {
    id: string;
    teamId: string;
  };
};

export default async function TeamPage({ params }: PageProps) {
  const teamData = await getTeamInfoForTournament(params.teamId, params.id);
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8">
      <h1>{`Team ${teamData.team.name}`}</h1>
      {teamData.matches.map((match) => (
        <div key={match.id} className="py-4">
          <p>{`Game ${match.matchNumber}`}</p>
          <div className="flex flex-col gap-4">
            <span>{`${match.teamA ?? "TBD"} vs ${match.teamB ?? "TBD"}`}</span>
            {/* <p>{`Winner goes to game ${match.parentNumber}`}</p> */}
          </div>
          {match.teamBId && match.winner ? (
            <p>{`${
              match.winner == "teamA" ? match.teamA : match.teamB
            } won`}</p>
          ) : null}
        </div>
      ))}
    </main>
  );
}
