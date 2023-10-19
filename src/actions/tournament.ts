"use server";

import { getTeamsForTournament } from "@/db/teams";
import {
  createTournamentFromEmail,
  isUserAnAdmin,
  storeTeamSchedule,
  updateAllMatchWinners,
} from "@/db/tournament";
import { authOptions } from "@/lib/auth";
import { createRandomeScheduleForTeams } from "@/lib/tournament";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function isUserATournamentAdmin(id: string, throws = true) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) {
    console.error(
      "Unable to validate session, please ensure you are signed in",
    );
    throw new Error(
      "Unable to validate session, please ensure you are signed in",
    );
  }
  const isAdmin = await isUserAnAdmin(email, id);
  if (!isAdmin) {
    console.error("Unauthorised, user is not an admin");
    if (throws) {
      throw new Error("Unauthorised, user is not an admin");
    }
  }
  return { isAdmin, email, session };
}

export async function createTournament(
  tournamentName: string,
  epochStart: number,
) {
  let startTime;
  try {
    z.number().parse(epochStart);
    startTime = new Date(epochStart);
  } catch (err) {
    const e = "Error getting date from provided value";
    console.error(e);
    console.error(err);
    return e;
  }
  console.log({ tournamentName, startTime });
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) {
    console.info(
      "Unable to find email for user session when createing new tournament",
      { session },
    );
    throw new Error("Unable to find email for logged in user");
  }
  try {
  } catch (err) {
    z.string().parse(tournamentName);
    console.error("tournamentName value provided is not a string");
    console.error(err);
    return "tournamentName value provided is not a string";
  }

  try {
    const tournament = await createTournamentFromEmail({
      userEmail: email,
      startTime,
      tournamentName,
    });
    console.log("created tournament", {
      tournamentName,
      startTime,
      id: tournament.id,
    });
    redirect(`/tournament/${tournament.id}`);
  } catch (e) {
    console.error("Error Creating tournament", { tournamentName, startTime });
    console.error(e);
    return "Error Creating tournament";
  }
}
export async function scheduleTournament(id: string) {
  await isUserATournamentAdmin(id);
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
