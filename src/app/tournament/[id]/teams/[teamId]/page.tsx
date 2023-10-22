import SubscribeButton from "@/components/SubscribeButton";
import { getTeamInfoForTournament } from "@/db/teams";
import { cn } from "@/lib/utils";

type PageProps = {
  params: {
    id: string;
    teamId: string;
  };
};

export default async function TeamPage({ params }: PageProps) {
  const teamData = await getTeamInfoForTournament(params.teamId, params.id);
  return (
    <div className="py-8">
      <h2 className="text-2xl font-medium">{`Team ${teamData.team.name}`}</h2>
      <div className="flex flex-col items-center justify-center gap-4 py-2">
        <SubscribeButton teamId={params.teamId} tournamentId={params.id} />
        {teamData.matches.map((match) => (
          <div key={match.id} className="py-4">
            <div className={cn("w-60 bg-grey-200 flex items-center px-4 py-2")}>
              <p className="w-8 px-2 py-4 bg-gray-400 text-center">
                {match.matchNumber}
              </p>
              <div
                className={cn(
                  "w-5/6 px-2 flex flex-col flex-grow gap-1 md:gap-2",
                )}
              >
                <div
                  className={cn(
                    "text-center",
                    match.winner === "teamA"
                      ? "bg-green-300 text-medium text-black"
                      : "bg-gray-500",
                  )}
                >
                  <span>{match.teamA ?? "TBD"}</span>
                </div>
                <div
                  className={cn(
                    "text-center",
                    match.winner === "teamB"
                      ? "bg-green-300 text-medium text-black"
                      : "bg-gray-500",
                  )}
                >
                  <span>
                    {match.round === 1 && !match.teamBId
                      ? "Bye"
                      : match.teamB ?? "TBD"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
