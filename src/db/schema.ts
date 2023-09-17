import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  varchar,
  boolean,
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
});

export const teams = pgTable("teams", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  tournamentId: text("tournament_id").references(() => tournaments.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  eliminated: boolean("eliminated").notNull().default(false),
});

export const matches = pgTable("match", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => nanoid()),
  teamA: text("team_a"),
  teamB: text("team_b"),
  teamAScore: integer("team_a_score").default(0),
  teamBScore: integer("team_b_score").default(0),
  tournamentId: text("tournament_id").references(() => tournaments.id, {
    onDelete: "cascade",
  }),
  // NOTE: may need a previous game references
  // previousMatchAId: text("previous_game_2_id"),
  // previousMatchBId: text("previous_game_2_id"),
  winner: varchar("winner", { enum: ["team1", "team2"] }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});
