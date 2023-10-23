"use server";
import { createTeam } from "@/db/teams";
import { revalidatePath } from "next/cache";
import { isUserATournamentAdmin } from "./tournament";
import { z } from "zod";
import { addTeamNotification } from "@/db/notifications";

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
  console.log({ tournamentId, teamId, sub });
  const subscription = z.object({
    endpoint: z.string().url(),
    keys: z.object({
      p256dh: z.string(),
      auth: z.string(),
    }),
  });
  try {
    if (!sub) {
      throw new Error("No subscription data found");
    }
    subscription.passthrough().parse(JSON.parse(sub));
    await addTeamNotification(teamId, sub);
  } catch (error) {
    // Handle parsing error, e.g., invalid input format
    console.error("Error saving notification data", error);
    return "Error saving notification data";
  }
  // add test notification ?
}
