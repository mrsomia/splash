import { db } from "@/db/index";
import { teams } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getTeamsForTournament(id: string) {
  const foundTeams = await db
    .select()
    .from(teams)
    .where(eq(teams.tournamentId, id));
  return foundTeams;
}
