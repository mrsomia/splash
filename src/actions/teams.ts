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
  try {
    await createTeam({ tournamentId, teamName });
  } catch (e) {
    console.error("Error creating new team", { tournamentId, teamName });
    console.error(e);
    return "Error creating new team";
  }
  revalidatePath(`/tournament/${tournamentId}`);
}
