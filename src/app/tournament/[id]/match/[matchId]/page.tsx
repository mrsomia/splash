import { getMatchDetails } from "@/db/match";
import WinnerForm from "@/components/WinnerForm";
import { getTournamentFromId, isUserAnAdmin } from "@/db/tournament";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type PageProps = {
  params: {
    id: string;
    matchId: string;
  };
};

export default async function TournamentPage({ params }: PageProps) {
  console.log("loading match details");
  console.log(params);
  const tournament = await getTournamentFromId(params.id);
  const matchDetails = await getMatchDetails(params.matchId);

  const session = await getServerSession(authOptions);
  let isAdmin = false;
  if (session?.user?.email) {
    const email = session.user.email;
    isAdmin = await isUserAnAdmin(email, params.id);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8">
      <h1>{tournament.name}</h1>
      <h2>{`Game ${matchDetails.matchNumber}`}</h2>
      <p>{`${matchDetails.teamA} vs ${matchDetails.teamB}`}</p>
      {matchDetails.winner ? (
        <p>
          {matchDetails.winner == "teamA"
            ? `${matchDetails.teamA} won`
            : `${matchDetails.teamB} won`}
        </p>
      ) : (
        <p>Winner TBD</p>
      )}
      {isAdmin ? <WinnerForm match={matchDetails} /> : null}
    </main>
  );
}
