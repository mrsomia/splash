import { getMatchDetails } from "@/db/match";
import WinnerForm from "@/components/WinnerForm";
import { isUserAnAdmin } from "@/db/tournament";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cn } from "@/lib/utils";
import StartMatchButton from "@/components/StartMatchButton";

type PageProps = {
  params: {
    id: string;
    matchId: string;
  };
};

export default async function TournamentPage({ params }: PageProps) {
  console.info("loading match details:", params);
  const matchDetails = await getMatchDetails(params.matchId);

  const session = await getServerSession(authOptions);
  let isAdmin = false;
  if (session?.user?.email) {
    const email = session.user.email;
    isAdmin = await isUserAnAdmin(email, params.id);
  }

  return (
    <main className="py-2 md:py-4">
      <h2 className="text-lg md:text-xl font-semibold">{`Game ${matchDetails.matchNumber}`}</h2>
      <div className="flex justify-center py-4">
        <div className="flex flex-col gap-2">
          <div
            className={cn(
              matchDetails.winner === "teamA"
                ? "bg-green-300 text-medium text-black"
                : "bg-gray-500",
            )}
          >
            <p className="text-center w-48">{matchDetails.teamA ?? "TBD"}</p>
          </div>
          <div
            className={cn(
              matchDetails.winner === "teamB"
                ? "bg-green-300 text-medium text-black"
                : "bg-gray-500",
            )}
          >
            <p className="text-center w-48">
              {matchDetails.round === 1 && !matchDetails.teamBId
                ? "Bye"
                : matchDetails.teamB ?? "TBD"}
            </p>
          </div>
          {matchDetails.winner ? (
            <p className="py-4 text-center">
              {matchDetails.winner == "teamA"
                ? `${matchDetails.teamA} won`
                : `${matchDetails.teamB} won`}
            </p>
          ) : (
            <p className="py-4 text-center">Winner TBD</p>
          )}
          {isAdmin && !matchDetails.startedAt ? (
            <StartMatchButton
              matchId={matchDetails.id}
              tournamentId={matchDetails.tournamentId}
            />
          ) : null}
          {isAdmin ? <WinnerForm match={matchDetails} /> : null}
        </div>
      </div>
    </main>
  );
}
