import { db } from "@/db/index";
import { matches, teams, tournaments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

export async function getMatchDetails(id: string) {
  const teamA = alias(teams, "teamA");
  const teamB = alias(teams, "teamB");
  const [match] = await db
    .select({
      id: matches.id,
      teamAId: matches.teamAId,
      teamBId: matches.teamBId,
      winner: matches.winner,
      round: matches.round,
      matchNumber: matches.matchNumber,
      tournamentId: matches.tournamentId,
      parent: matches.parentId,
      teamA: teamA.name,
      teamB: teamB.name,
    })
    .from(matches)
    .where(eq(matches.id, id))
    .fullJoin(teamA, eq(teamA.id, matches.teamAId))
    .fullJoin(teamB, eq(teamB.id, matches.teamBId));
  return match;
}

