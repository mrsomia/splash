import { getTeamsForTournament } from "@/db/teams";
import NewTeamForm from "./NewTeamForm";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function SignUpPage({ params }: PageProps) {
  const teams = await getTeamsForTournament(params.id);
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8">
      <h1>Signup Page</h1>
      <p>{`${teams.length} team${teams.length !== 1 ? "s" : ""}`}</p>
      <NewTeamForm tournamentId={params.id} />
    </main>
  );
}
