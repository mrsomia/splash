import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  varchar,
  boolean,
  unique,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "@auth/core/adapters";
import { nanoid } from "nanoid";

export const users = pgTable("user", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  }),
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);

export const tournaments = pgTable("tournament", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  winner: text("winner"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  startTime: timestamp("start_time").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const schedule = pgTable("schedule", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => nanoid()),
  tournamentId: text("tournament_id")
    .notNull()
    .references(() => tournaments.id, {
      onDelete: "cascade",
    }),
  currentRound: integer("current_round"),
  totalRounds: integer("total_rounds"),
});

export const scheduleToMatches = pgTable(
  "schedule_to_matches",
  {
    scheduleId: text("schedule_id")
      .notNull()
      .references(() => schedule.id),
    matchId: text("match_id")
      .notNull()
      .references(() => matches.id),
    round: integer("round").notNull(),
    teamAId: text("team_a_id").references(() => teams.id),
    teamBId: text("team_b_id").references(() => teams.id),
    parentMatchId: text("parent_match_id").references(() => matches.id),
  },
  (stm) => ({
    pk: primaryKey(stm.scheduleId, stm.matchId),
    unq1: unique().on(stm.round, stm.scheduleId, stm.teamAId),
    unq2: unique().on(stm.round, stm.scheduleId, stm.teamBId),
  }),
);

export const teams = pgTable("teams", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  tournamentId: text("tournament_id")
    .notNull()
    .references(() => tournaments.id, {
      onDelete: "cascade",
    }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  eliminated: boolean("eliminated").notNull().default(false),
});

export const userToTeams = pgTable(
  "users_to_teams",
  {
    teamId: text("team_id")
      .notNull()
      .references(() => teams.id),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    tournamentId: text("tournament_id")
      .notNull()
      .references(() => tournaments.id),
  },
  (utt) => ({
    pk: primaryKey(utt.teamId, utt.userId, utt.tournamentId),
  }),
);

export const matches = pgTable("match", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => nanoid()),
  teamAScore: integer("team_a_score").default(0),
  teamBScore: integer("team_b_score").default(0),
  tournamentId: text("tournament_id")
    .notNull()
    .references(() => tournaments.id, {
      onDelete: "cascade",
    }),
  winner: varchar("winner", { enum: ["team1", "team2"] }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});
