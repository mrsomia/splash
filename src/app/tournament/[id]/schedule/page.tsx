import {
  getMatchesForTournament,
  getMatchesForTournamentByRounds,
  getTournamentFromId,
} from "@/db/tournament";
import Game from "@/components/Game";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function TournamentPage({ params }: PageProps) {
  const tournament = await getTournamentFromId(params.id);
  const rounds = await getMatchesForTournamentByRounds(params.id);
  console.log(rounds);
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8">
      <h1 className="p-4">{`Schedule for ${tournament.name}`}</h1>
      <div className={`flex items-center gap-4 px-4`}>
        {rounds.reverse().map((round, idx) => (
          <div key={idx} className="flex flex-col justify-center">
            <h3>{`Round ${round[0].round ?? "unknown"}`}</h3>
            {round.map((game) => (
              <Game key={game.id} match={game} />
            ))}
          </div>
        ))}
        {}
      </div>
    </main>
  );
}
