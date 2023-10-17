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
  let tournamentTeams;
  try {
    tournamentTeams = await getTeamsForTournament(id);
    if (!tournamentTeams) {
      throw new Error(`Unable to find any teams for tournament`);
    }
  } catch (e) {
    if (e instanceof Error) {
      console.error(`Error fetching teams for tournament ${id}`);
      console.error(e.message);
      return e.message;
    }
    const err = new Error(`An unknown error occurred`);
    console.error(err);
    console.error(e);
    return err;
  }
  const teamIds = tournamentTeams.map((t) => t.id);
  const schedule = createRandomeScheduleForTeams(teamIds);
  console.log(schedule);
  try {
    await storeTeamSchedule(schedule, id);
  } catch (e) {
    const err = `Error storing schedule for tournament ${id}, try again`;
    console.error(err);
    console.error(e);
    return err;
  }
  try {
    await updateAllMatchWinners(id);
  } catch (e) {
    console.error(`Error updating winners of round 1`);
    console.error(e);
    return "Error updating winners of round 1 try updating the bye rounds manually";
  }
  revalidatePath(`/tournament/${id}`);
  redirect(`/tournament/${id}/schedule`);
}
