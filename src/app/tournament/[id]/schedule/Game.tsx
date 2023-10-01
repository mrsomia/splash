import { getMatchesForTournament } from "@/db/tournament";
import Link from "next/link";

type GameProps = {
  match: Awaited<ReturnType<typeof getMatchesForTournament>>[number];
};

export default function Game({ match }: GameProps) {
  return (
    <Link href={`/tournament/${match.tournamentId}/match/${match.id}`}>
      <div className="py-4">
        <h5>{`Game ${match.matchNumber}`}</h5>
        <div className="flex gap-4">
          <span>{`${match.teamA ?? "TBD"} vs ${match.teamB ?? "TBD"}`}</span>
        </div>
        {match.winner ? (
          <p>{`${match.winner == "teamA" ? match.teamA : match.teamB} won`}</p>
        ) : null}
      </div>
    </Link>
  );
}
