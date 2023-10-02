"use server";
import { updateMatchWinner } from "@/db/match";
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
  await updateMatchWinner({ matchId, teamId });
  revalidatePath(`/tournament/${tournamentId}/schedule`);
}
