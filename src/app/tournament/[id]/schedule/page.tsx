import { getMatchesForTournamentByRounds } from "@/db/tournament";
import Game from "@/components/Game";
import { cn } from "@/lib/utils";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function SchedulePage({ params }: PageProps) {
  const rounds = await getMatchesForTournamentByRounds(params.id);

  return (
    <div className={cn(`py-8 overflow-x-scroll snap-x min-w-full`)}>
      <div className="flex mx-8 md:mx-auto">
        {rounds.reverse().map((round, idx) => (
          <div
            key={idx}
            className="snap-center text-center flex flex-col justify-center mx-6"
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
