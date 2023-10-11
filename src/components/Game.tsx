import { getMatchesForTournament } from "@/db/tournament";
import { cn } from "@/lib/utils";
import Link from "next/link";

type GameProps = {
  match: Awaited<ReturnType<typeof getMatchesForTournament>>[number];
  totalRounds: number;
};

export default function Game({ match, totalRounds }: GameProps) {
  return (
    <Link href={`/tournament/${match.tournamentId}/match/${match.id}`}>
      <div className="w-60 bg-grey-200 flex items-center py-1 px-4">
        <p className="w-8 px-2 py-4 bg-gray-400">{match.matchNumber}</p>
        <div
          className={cn("w-[5/6] px-2 flex flex-col flex-grow gap-1 md:gap-2")}
        >
          <div
            className={cn(
              match.winner === "teamA"
                ? "bg-green-300 text-medium text-black"
                : "bg-gray-500",
            )}
          >
            <span>{match.teamA ?? "TBD"}</span>
          </div>
          <div
            className={cn(
              match.winner === "teamB"
                ? "bg-green-300 text-medium text-black"
                : "bg-gray-500",
            )}
          >
            <span>{match.teamB ?? "TBD"}</span>
          </div>
        </div>
        {/* {match.teamBId && match.winner ? ( */}
        {/*   <p>{`${match.winner == "teamA" ? match.teamA : match.teamB} won`}</p> */}
        {/* ) : null} */}
      </div>
    </Link>
  );
}
