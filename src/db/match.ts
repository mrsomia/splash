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
    .leftJoin(teamA, eq(teamA.id, matches.teamAId))
    .leftJoin(teamB, eq(teamB.id, matches.teamBId));
  return match;
}

export async function updateMatchWinner({
  matchId,
  teamId,
}: {
  matchId: string;
  teamId: string;
}) {
  await db.transaction(async (tx) => {
    const [match] = await tx
      .select()
      .from(matches)
      .where(eq(matches.id, matchId));
    if (match.teamAId == teamId) {
      await tx
        .update(matches)
        .set({
          winner: "teamA",
          completedAt: new Date(),
        })
        .where(eq(matches.id, matchId));
    } else if (match.teamBId == teamId) {
      await tx
        .update(matches)
        .set({
          winner: "teamB",
          completedAt: new Date(),
        })
        .where(eq(matches.id, matchId));
    }

    if (match.parentId) {
      // Not the Final
      const [parent] = await tx
        .select()
        .from(matches)
        .where(eq(matches.id, match.parentId));
      if (parent.teamAId == null) {
        await tx
          .update(matches)
          .set({ teamAId: teamId })
          .where(eq(matches.id, parent.id));
      } else if (parent.teamBId == null) {
        await tx
          .update(matches)
          .set({ teamBId: teamId })
          .where(eq(matches.id, parent.id));
      } else {
        throw new Error("parent already has 2 teams");
      }
    } else {
      tx.update(tournaments)
        .set({ winner: teamId, completedAt: new Date() })
        .where(eq(tournaments.id, match.tournamentId));
    }
  });
}
