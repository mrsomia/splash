"use client";

import {
  getMatchesForTournament,
  getMatchesForTournamentByRounds,
} from "@/db/tournament";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

type ScheduleLayoutProps = {
  rounds: Awaited<ReturnType<typeof getMatchesForTournamentByRounds>>;
};
export default function ScheduleLayout({ rounds }: ScheduleLayoutProps) {
  const [round, setRound] = useState(1);

  useEffect(() => {
    const rootElem = document.querySelector(".rounds-container");
    console.log(rootElem);
    console.log(window.innerWidth);
    const observer = new IntersectionObserver(
      (entries, observer) => {
        const currentEntries: number[] = [];
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            currentEntries.push(Number(entry.target.id[5]));
          }
        });
        console.log({ currentEntries });
        setRound(currentEntries[Math.floor(currentEntries.length / 2)]);
      },
      {
        rootMargin: "0% -25%",
      },
    );
    const roundContainers = document.querySelectorAll(".round-container");
    roundContainers.forEach((container) => observer.observe(container));

    return () => observer.disconnect();
  }, []);

  console.log(round);
  const handleRoundClick = (roundNumber: number) => {
    const idString = `#round${roundNumber}Container`;
    const el = document.querySelector(idString);
    if (!el) {
      console.error(`Unable to find item with id: ${idString}`);
      return;
    }
    el.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };
  return (
    <>
      <div className="min-w-full flex justify-center">
        <ul className="flex gap-2 px-2 bg-white rounded-full">
          {rounds.map((_, idx) => (
            <li
              key={idx}
              className={cn(
                "p-2 rounded-full",
                round === idx + 1 ? "bg-slate-800" : "text-black",
              )}
            >
              <button onClick={(_) => handleRoundClick(idx + 1)}>
                {idx + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className={cn(`py-8 overflow-x-scroll snap-x min-w-full`)}>
        <div className="flex px-8 gap-16 md:mx-auto">
          {rounds.map((round, idx) => (
            <div
              key={idx}
              id={`round${idx + 1}Container`}
              className="snap-center text-center flex flex-col justify-center round-container"
            >
              {/* <h2 className="hidden md:block">{round[0].round}</h2> */}
              <div className="flex flex-col gap-2 h-full justify-evenly">
                {round.map((game) => (
                  <Game
                    key={game.id}
                    match={game}
                    totalRounds={rounds.length}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

type GameProps = {
  match: Awaited<ReturnType<typeof getMatchesForTournament>>[number];
  totalRounds: number;
};

export function Game({ match, totalRounds }: GameProps) {
  return (
    <Link href={`/tournament/${match.tournamentId}/match/${match.id}`}>
      <div className={cn("w-60 bg-grey-200 flex items-center px-4 py-2")}>
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
