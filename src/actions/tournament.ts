"use server";

import { getTeamsForTournament } from "@/db/teams";
import {
  createTournamentFromEmail,
  storeTeamSchedule,
  updateAllMatchWinners,
} from "@/db/tournament";
import { authOptions } from "@/lib/auth";
import { createRandomeScheduleForTeams } from "@/lib/tournament";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTournament(
  tournamentName: string,
  epochStart: number,
) {
  const startTime = new Date(epochStart);
  console.log({ tournamentName, startTime });
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) {
    console.info(
      "Unable to find email for user session when createing new tournament",
      { session },
    );
    throw new Error("Unable to find email for user session");
  }
  //TODO: validate arguments

  const tournament = await createTournamentFromEmail({
    userEmail: email,
    startTime,
    tournamentName,
  });
  redirect(`/tournament/${tournament.id}`);
}
export async function scheduleTournament(id: string) {
  console.log(`scheduling ${id}`);
  const tournamentTeams = await getTeamsForTournament(id);
  const teamIds = tournamentTeams.map((t) => t.id);
  const schedule = createRandomeScheduleForTeams(teamIds);
  console.log(schedule);
  await storeTeamSchedule(schedule, id);
  await updateAllMatchWinners(id);
  // TODO : update torunament to have number of rounds

  revalidatePath(`/tournament/${id}`);
  redirect(`/tournament/${id}/schedule`);
}
