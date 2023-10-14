"use server";
import { deleteScheduleForTournament, updateMatchWinner } from "@/db/match";
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
  await updateMatchWinner({ matchId, teamId });
  revalidatePath(`/tournament/${tournamentId}/schedule`);
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
