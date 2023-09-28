"use server";

import { createTournamentFromEmail } from "@/db/tournament";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
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
  redirect(`/tournament/${id}/schedule`);
  //TODO: Write schedule algorithm
}
