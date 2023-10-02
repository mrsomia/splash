import { db } from "@/db/index";
import { tournamentAdmins, tournaments, users, matches, teams } from "./schema";
import { eq, asc } from "drizzle-orm";
import {
  createRandomeScheduleForTeams,
  getNumberOfRounds,
  getUpperFactorOf2,
} from "@/lib/tournament";
import { alias } from "drizzle-orm/pg-core";

export async function createTournamentFromEmail({
  userEmail,
  tournamentName,
  startTime,
}: {
  userEmail: string;
  tournamentName: string;
  startTime: Date;
}) {
  const tournament = await db.transaction(async (tx) => {
    const [user] = await tx
      .select()
      .from(users)
      .where(eq(users.email, userEmail));

    const [tourney] = await tx
      .insert(tournaments)
      .values({ name: tournamentName, startTime })
      .returning();

    await tx
      .insert(tournamentAdmins)
      .values({ userId: user.id, tournamentId: tourney.id, accepted: true })
      .returning();
    return tourney;
  });
  return tournament;
}

export async function getTournamentFromId(id: string) {
  const [tournament] = await db
    .select()
    .from(tournaments)
    .where(eq(tournaments.id, id));
  return tournament;
}

export async function getTournamentsFromEmail(email: string, limit = 0) {
  const tournamentsWhereUserIsAdmin = await db
    .select({
      id: tournaments.id,
      name: tournaments.name,
      winner: tournaments.winner,
      createdAt: tournaments.createdAt,
      startTime: tournaments.startTime,
      completedAt: tournaments.completedAt,
    })
    .from(users)
    .where(eq(users.email, email))
    .leftJoin(tournamentAdmins, eq(users.id, tournamentAdmins.userId))
    .leftJoin(tournaments, eq(tournaments.id, tournamentAdmins.tournamentId))
    .orderBy(tournaments.startTime)
    .limit(limit);

  return tournamentsWhereUserIsAdmin;
}

export async function isUserAnAdmin(email: string, tournamentId: string) {
  const tournaments = await getTournamentsFromEmail(email);
  const tIds = tournaments.map((t) => t.id);
  return tIds.some((id) => id == tournamentId);
}

export async function storeTeamSchedule(
  randomSchedule: ReturnType<typeof createRandomeScheduleForTeams>,
  tournamentId: string,
) {
  // const expectedTeams = randomSchedule.length + 1;
  // const numberOfRounds = getNumberOfRounds(expectedTeams);
  await db.transaction(async (tx) => {
    let round = 1;
    // Last game of the round
    let endIdx = getUpperFactorOf2(2 ** round) - 1;
    const createdMatches: (typeof matches.$inferSelect)[] = [];
    for (let i = 0; i < randomSchedule.length; i++) {
      if (i == endIdx) {
        round = round + 1;
        endIdx = getUpperFactorOf2(2 ** round) - 1;
      }
      const [match] = await tx
        .insert(matches)
        .values({
          tournamentId,
          teamAId: randomSchedule[i][0],
          teamBId: randomSchedule[i][1],
          round,
          matchNumber: randomSchedule.length - i,
        })
        .returning();
      createdMatches.push(match);
    }

    for (let i = 1; i < createdMatches.length; i++) {
      const parentMatchIdx = Math.floor((i + 1) / 2) - 1;
      const parentId = createdMatches[parentMatchIdx].id;
      const [updatedMatch] = await tx
        .update(matches)
        .set({
          parentId,
        })
        .where(eq(matches.id, createdMatches[i].id))
        .returning();

      createdMatches[i] = updatedMatch;
    }

    return createdMatches;
  });
}

export async function updateAllMatchWinners(tournamentId: string) {
  const tourneyMatches = await db
    .select()
    .from(matches)
    .where(eq(matches.tournamentId, tournamentId));

  await db.transaction(async (tx) => {
    for (const match of tourneyMatches) {
      if (match.teamAId == null && match.teamBId !== null) {
        await tx
          .update(matches)
          .set({ winner: "teamB", completedAt: new Date() })
          .where(eq(matches.id, match.id));
        if (!match.parentId) continue;
        const [parent] = await tx
          .select()
          .from(matches)
          .where(eq(matches.id, match.parentId));

        if (parent.teamAId == null) {
          await tx
            .update(matches)
            .set({ teamAId: match.teamBId })
            .where(eq(matches.id, parent.id));
        } else if (parent.teamBId == null) {
          await tx
            .update(matches)
            .set({ teamBId: match.teamBId })
            .where(eq(matches.id, parent.id));
        } else {
          throw new Error("parent already has 2 teams");
        }
      }

      if (match.teamBId == null && match.teamAId !== null) {
        await tx
          .update(matches)
          .set({ winner: "teamA", completedAt: new Date() })
          .where(eq(matches.id, match.id));
        if (!match.parentId) continue;
        const [parent] = await tx
          .select()
          .from(matches)
          .where(eq(matches.id, match.parentId));

        if (parent.teamAId == null) {
          await tx
            .update(matches)
            .set({ teamAId: match.teamAId })
            .where(eq(matches.id, parent.id));
        } else if (parent.teamBId == null) {
          await tx
            .update(matches)
            .set({ teamBId: match.teamAId })
            .where(eq(matches.id, parent.id));
        } else {
          throw new Error("parent already has 2 teams");
        }
      }
    }
  });
}

export async function getMatchesForTournament(id: string) {
  const teamA = alias(teams, "teamA");
  const teamB = alias(teams, "teamB");
  const games = await db
    .select({
      id: matches.id,
      teamAId: matches.teamAId,
      teamBId: matches.teamBId,
      winner: matches.winner,
      round: matches.round,
      tournamentId: matches.tournamentId,
      matchNumber: matches.matchNumber,
      parent: matches.parentId,
      teamA: teamA.name,
      teamB: teamB.name,
    })
    .from(matches)
    .where(eq(matches.tournamentId, id))
    .fullJoin(teamA, eq(matches.teamAId, teamA.id))
    .fullJoin(teamB, eq(matches.teamBId, teamB.id))
    .orderBy(asc(matches.matchNumber));
  return games;
}

export async function getMatchesForTournamentByRounds(id: string) {
  const games = await getMatchesForTournament(id);
  const rounds = [];
  const totalRounds = getNumberOfRounds(games.length + 1);
  for (let i = 1; i <= totalRounds; i++) {
    const roundOfGames = games.filter((game) => game.round == i);
    rounds.push(roundOfGames);
  }
  return rounds;
}
