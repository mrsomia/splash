"use server";
import { createTeam } from "@/db/teams";
import { revalidatePath } from "next/cache";
import { isUserATournamentAdmin } from "./tournament";

export async function addTeamToTournament({
  tournamentId,
  teamName,
}: {
  tournamentId: string;
  teamName: string;
}) {
  console.log({ tournamentId, teamName });
  await isUserATournamentAdmin(tournamentId);
  try {
    await createTeam({ tournamentId, teamName });
  } catch (e) {
    console.error("Error creating new team", { tournamentId, teamName });
    console.error(e);
    return "Error creating new team";
  }
  revalidatePath(`/tournament/${tournamentId}`);
}

export async function subscribeTotTeamNotificaitons({
  tournamentId,
  teamId,
  sub,
}: {
  tournamentId: string;
  teamId: string;
  sub: string;
}) {
  // Store push notification data
  // Send test notification
  console.log({ tournamentId, teamId, sub });
}
