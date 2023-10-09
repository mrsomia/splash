import { getMatchesForTournamentByRounds } from "@/db/tournament";
import Game from "@/components/Game";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function SchedulePage({ params }: PageProps) {
  const rounds = await getMatchesForTournamentByRounds(params.id);

  return (
    <div className={`flex items-center gap-4 px-4 py-8`}>
      {rounds.reverse().map((round, idx) => (
        <div key={idx} className="flex flex-col justify-center">
          <h3>{`Round ${round[0].round ?? "unknown"}`}</h3>
          {round.map((game) => (
            <Game key={game.id} match={game} totalRounds={rounds.length} />
          ))}
        </div>
      ))}
      {}
    </div>
  );
}
