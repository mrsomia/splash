import { getMatchesForTournament } from "@/db/tournament";
import Link from "next/link";

type GameProps = {
  match: Awaited<ReturnType<typeof getMatchesForTournament>>[number];
  totalRounds: number;
};

export default function Game({ match, totalRounds }: GameProps) {
  return (
    <Link href={`/tournament/${match.tournamentId}/match/${match.id}`}>
      <div className="py-4">
        <p>{`Game ${match.matchNumber}`}</p>
        <div className="flex flex-col gap-4">
          {match.round == totalRounds && match.winner && !match.teamBId ? (
            <span>{`By for ${match.teamA}`}</span>
          ) : (
            <span>{`${match.teamA ?? "TBD"} vs ${match.teamB ?? "TBD"}`}</span>
          )}
          {/* <p>{`Winner goes to game ${match.parentNumber}`}</p> */}
        </div>
        {match.teamBId && match.winner ? (
          <p>{`${match.winner == "teamA" ? match.teamA : match.teamB} won`}</p>
        ) : null}
      </div>
    </Link>
  );
}
