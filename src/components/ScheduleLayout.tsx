import {
  getMatchesForTournament,
  getMatchesForTournamentByRounds,
} from "@/db/tournament";
import { cn } from "@/lib/utils";
import Link from "next/link";

type ScheduleLayoutProps = {
  rounds: Awaited<ReturnType<typeof getMatchesForTournamentByRounds>>;
};
export default function ScheduleLayout({ rounds }: ScheduleLayoutProps) {
  return (
    <div className={cn(`py-8 overflow-x-scroll snap-x min-w-full`)}>
      <div className="flex px-8 md:mx-auto">
        {rounds.map((round, idx) => (
          <div
            key={idx}
            className="snap-center text-center flex flex-col justify-center px-10"
          >
            {/* <h2 className="hidden md:block">{round[0].round}</h2> */}
            <div className="flex flex-col gap-2 justify-center">
              {round.map((game) => (
                <Game key={game.id} match={game} totalRounds={rounds.length} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type GameProps = {
  match: Awaited<ReturnType<typeof getMatchesForTournament>>[number];
  totalRounds: number;
};

export function Game({ match, totalRounds }: GameProps) {
  return (
    <Link href={`/tournament/${match.tournamentId}/match/${match.id}`}>
      <div className="w-60 bg-grey-200 flex items-center py-1 px-4">
        <p className="w-8 px-2 py-4 bg-gray-400">{match.matchNumber}</p>
        <div
          className={cn("w-5/6 px-2 flex flex-col flex-grow gap-1 md:gap-2")}
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
