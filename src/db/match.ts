import { db } from "@/db/index";
import { matches, teams, tournaments } from "@/db/schema";
import { eq, and, isNotNull, isNull } from "drizzle-orm";
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
      startedAt: matches.startedAt,
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
      if (match.matchNumber % 2 == 1) {
        // Left child
        await tx
          .update(matches)
          .set({ teamAId: teamId })
          .where(eq(matches.id, parent.id));
      } else {
        await tx
          .update(matches)
          .set({ teamBId: teamId })
          .where(eq(matches.id, parent.id));
      }
    } else {
      tx.update(tournaments)
        .set({ winner: teamId, completedAt: new Date() })
        .where(eq(tournaments.id, match.tournamentId));
    }
  });
}

export async function deleteScheduleForTournament(tournamentId: string) {
  await db.delete(matches).where(eq(matches.tournamentId, tournamentId));
}

export async function setMatchToStarted({ matchId }: { matchId: string }) {
  await db
    .update(matches)
    .set({ startedAt: new Date() })
    .where(eq(matches.id, matchId));
}

export async function getCurrentMatches(tournamentId: string) {
  const teamA = alias(teams, "teamA");
  const teamB = alias(teams, "teamB");
  const currentMatches = await db
    .select({
      id: matches.id,
      teamAId: matches.teamAId,
      teamBId: matches.teamBId,
      winner: matches.winner,
      round: matches.round,
      matchNumber: matches.matchNumber,
      startedAt: matches.startedAt,
      tournamentId: matches.tournamentId,
      parent: matches.parentId,
      teamA: teamA.name,
      teamB: teamB.name,
    })
    .from(matches)
    .where(
      and(
        isNotNull(matches.startedAt),
        isNull(matches.completedAt),
        eq(matches.tournamentId, tournamentId),
      ),
    )
    .leftJoin(teamA, eq(teamA.id, matches.teamAId))
    .leftJoin(teamB, eq(teamB.id, matches.teamBId));
  return currentMatches;
}
