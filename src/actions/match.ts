"use server";
import {
  deleteScheduleForTournament,
  setMatchToStarted,
  updateMatchWinner,
} from "@/db/match";
import { revalidatePath } from "next/cache";
import { isUserATournamentAdmin } from "./tournament";
import { deleteSubscription, getMatchNotificaitons } from "@/db/notifications";
import { push } from "@/lib/notifications";

export async function setMatchWinner({
  matchId,
  teamId,
  tournamentId,
}: {
  matchId: string;
  teamId: string;
  tournamentId: string;
}) {
  await isUserATournamentAdmin(tournamentId);
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
  await isUserATournamentAdmin(tournamentId);
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
  await isUserATournamentAdmin(tournamentId);
  try {
    await setMatchToStarted({ matchId });
    revalidatePath(`/tournament/${tournamentId}`);
  } catch (e) {
    console.error(`Error starting match: ${matchId}`);
    console.error(e);
    return "Error starting match";
  }

  // Rest of function handles notifications
  let subs;
  try {
    subs = await getMatchNotificaitons(matchId);

    console.log(subs);
  } catch (e) {
    console.error(
      `Error getting match notifications subscriptions: ${matchId}`,
    );
    console.error(e);
    return "Error notifying teams for match - could not get subscriptions";
  }

  try {
    subs.forEach(async (subObj) => {
      if (!subObj.sub) return;
      const sub = JSON.parse(subObj.sub);
      const title = `Team ${subObj.team} have a game starting`;
      const message = `Game ${subObj.matchNumber} is starting, ${subObj.teamA} vs ${subObj.teamB}`;
      const link = `http${process.env.NODE_ENV == "production" ? "s" : ""}://${
        process.env.VERCEL_URL
      }/tournament/${tournamentId}`;
      const payload = { title, message, link };
      console.log(
        "sending push notification to: ",
        sub,
        JSON.stringify(payload),
      );
      await push.sendNotification(sub, JSON.stringify(payload)).catch((e) => {
        if (e.statusCode === 404 || e.statusCode === 410) {
          console.log("Subscription has expired or is no longer valid: ", e);
          return deleteSubscription(sub.id);
        } else {
          throw e;
        }
      });
    });
  } catch (e) {
    console.error(e);
    return "Error sending notification to subscriptions";
  }
}
