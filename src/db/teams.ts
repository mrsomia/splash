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

export async function createTeam({
  tournamentId,
  teamName,
}: {
  tournamentId: string;
  teamName: string;
}) {
  const [team] = await db
    .insert(teams)
    .values({ tournamentId, name: teamName })
    .returning();
  return team;
}
