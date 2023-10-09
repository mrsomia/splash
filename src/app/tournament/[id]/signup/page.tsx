import { getTeamsForTournament } from "@/db/teams";
import NewTeamForm from "@/components/NewTeamForm";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function SignUpPage({ params }: PageProps) {
  const teams = await getTeamsForTournament(params.id).catch((err) =>
    console.error(err),
  );
  return (
    <div className="py-8 flex flex-col items-center justify-center gap-8">
      <NewTeamForm
        tournamentId={params.id}
        teamNumber={teams ? teams.length + 1 : 1}
      />
    </div>
  );
}
