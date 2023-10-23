import { db } from "@/db";
import {
  matches,
  tournamentAdmins,
  userToTeams,
  teams,
  users,
  accounts,
  sessions,
  tournaments,
} from "@/db/schema";

const testTournament: typeof tournaments.$inferInsert = {
  id: "HeMoGU5Usq6Nl9t-BtYZh",
  name: "Beer Pong",
  startTime: new Date("2023-09-15T19:00:00"),
};

export async function resetDB() {
  await db.transaction(async (tx) => {
    await tx.delete(matches);
    await tx.delete(tournamentAdmins);
    await tx.delete(userToTeams);
    await tx.delete(teams);
    await tx.delete(tournaments);
    // await tx.delete(sessions)
    // await tx.delete(accounts)
    // await tx.delete(users)
  });
}

async function main() {
  await db.insert(tournaments).values(testTournament);
}

async function a() {
  const dBusers = await db.select().from(users);
  const dbAccounts = await db.select().from(accounts);
  const dbSessions = await db.select().from(accounts);
  console.log({ dBusers, dbAccounts, dbSessions });
  process.exit(0);
}

a();
