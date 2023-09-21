"use server";
import { createTeam } from "@/db/teams";
import { revalidatePath } from "next/cache";

export async function addTeamToTournament({
  tournamentId,
  teamName,
}: {
  tournamentId: string;
  teamName: string;
}) {
  console.log({ tournamentId, teamName });
  await createTeam({ tournamentId, teamName });
  revalidatePath(`/tournament/${tournamentId}`);
}
