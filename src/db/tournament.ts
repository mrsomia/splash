import { db } from "@/db/index";
import { tournamentAdmins, tournaments, users } from "./schema";
import { eq } from "drizzle-orm";

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