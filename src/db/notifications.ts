import { db } from "@/db/index";
import { pushSubs, matches, teams } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

export async function addTeamNotification(teamId: string, subData: string) {
  await db.insert(pushSubs).values({ teamId, subData });
}

export async function getMatchNotificaitons(matchId: string) {
  const teamA = alias(teams, "teamA");
  const teamB = alias(teams, "teamB");
  const mtsubs = await db
    .select({
      id: pushSubs.id,
      sub: pushSubs.subData,
      matchNumber: matches.matchNumber,
      teamA: teamA.name,
      teamB: teamB.name,
      team: teams.name,
    })
    .from(matches)
    .where(eq(matches.id, matchId))
    .leftJoin(teamA, eq(teamA.id, matches.teamAId))
    .leftJoin(teamB, eq(teamB.id, matches.teamBId))
    .leftJoin(
      pushSubs,
      or(
        eq(matches.teamAId, pushSubs.teamId),
        eq(matches.teamBId, pushSubs.teamId),
      ),
    )
    .leftJoin(teams, eq(pushSubs.teamId, teams.id));
  return mtsubs;
}

export async function deleteSubscription(id: string) {
  await db.delete(pushSubs).where(eq(pushSubs.id, id));
}
