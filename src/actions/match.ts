"use server";
import {
  deleteScheduleForTournament,
  setMatchToStarted,
  updateMatchWinner,
} from "@/db/match";
import { revalidatePath } from "next/cache";

export async function setMatchWinner({
  matchId,
  teamId,
  tournamentId,
}: {
  matchId: string;
  teamId: string;
  tournamentId: string;
}) {
  console.log({ matchId, teamId, tournamentId });
  // TODO: add override handling/remove team for matches
  try {
    await updateMatchWinner({ matchId, teamId });
    revalidatePath(`/tournament/${tournamentId}/schedule`);
  } catch (e) {
    console.error("Error updating match winner", {
      matchId,
      teamId,
      tournamentId,
    });
    return "Error updating match winner";
  }
}

export async function deleteSchedule({
  tournamentId,
}: {
  tournamentId: string;
}) {
  console.info(`Deleting schedule for ${tournamentId}`);
  await deleteScheduleForTournament(tournamentId);
  revalidatePath(`/tournament/${tournamentId}`);
}

export async function startMatch({
  matchId,
  tournamentId,
}: {
  matchId: string;
  tournamentId: string;
}) {
  try {
    await setMatchToStarted({ matchId });
    revalidatePath(`/tournament/${tournamentId}`);
  } catch (e) {
    console.error(`Error starting match: ${matchId}`);
    console.error(e);
    return "Error starting match";
  }
}
