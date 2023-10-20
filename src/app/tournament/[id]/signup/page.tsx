import { getTeamsForTournament } from "@/db/teams";
import NewTeamForm, { DeleteScheduleForm } from "@/components/NewTeamForm";
import { getMatchesForTournament } from "@/db/tournament";
import QRCode from "react-qr-code";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function SignUpPage({ params }: PageProps) {
  const games = await getMatchesForTournament(params.id);
  const teams = await getTeamsForTournament(params.id).catch((err) =>
    console.error(err),
  );
  return (
    <div className="py-8 flex flex-col items-center justify-center gap-8">
      {games.length > 0 ? (
        <DeleteScheduleForm tournamentId={params.id} />
      ) : (
        <NewTeamForm
          tournamentId={params.id}
          teamNumber={teams ? teams.length + 1 : 1}
        />
      )}
      <div className="max-w-sm md:max-w-lg space-y-2">
        <p className="">Share tournament</p>
        <div className="bg-white p-4">
          <QRCode value={`${process.env.VERCEL_URL}/tournament/${params.id}`} />
        </div>
      </div>
    </div>
  );
}
