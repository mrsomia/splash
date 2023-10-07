import { db } from "@/db/index";
import { teams, matches } from "@/db/schema";
import { match } from "assert";
import { and, eq, or } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

export async function getTeamsForTournament(id: string) {
  const foundTeams = await db
    .select()
    .from(teams)
    .where(eq(teams.tournamentId, id));
  return foundTeams;
}

export async function getTeamInfoForTournament(
  teamId: string,
  tournamentId: string,
) {
  const teamA = alias(teams, "teamA");
  const teamB = alias(teams, "teamB");

  const teamData = await db.transaction(async (tx) => {
    const [team] = await tx.select().from(teams).where(eq(teams.id, teamId));

    const teamMatches = await tx
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
      .where(
        or(
          and(
            eq(matches.teamAId, teamId),
            eq(matches.tournamentId, tournamentId),
          ),
          and(
            eq(matches.teamBId, teamId),
            eq(matches.tournamentId, tournamentId),
          ),
        ),
      )
      .leftJoin(teamA, eq(teamA.id, matches.teamAId))
      .leftJoin(teamB, eq(teamB.id, matches.teamBId));
    return { team, matches: teamMatches };
  });
  return teamData;
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
