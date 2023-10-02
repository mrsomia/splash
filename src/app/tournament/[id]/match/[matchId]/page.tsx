import { getMatchDetails } from "@/db/match";
import WinnerForm from "@/components/WinnerForm";

type PageProps = {
  params: {
    id: string;
    matchId: string;
  };
};

export default async function TournamentPage({ params }: PageProps) {
  console.log("loading match details");
  console.log(params);
  // const tournament = await getTournamentFromId(params.id);
  const matchDetails = await getMatchDetails(params.matchId);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8">
      <h2>{`Game ${matchDetails.matchNumber}`}</h2>
      <p>{`${matchDetails.teamA} vs ${matchDetails.teamB}`}</p>
      {matchDetails.winner ? (
        <p>
          {matchDetails.winner == "teamA"
            ? `${matchDetails.teamA} won`
            : `${matchDetails.teamB} won`}
        </p>
      ) : (
        <WinnerForm match={matchDetails} />
      )}
    </main>
  );
}
