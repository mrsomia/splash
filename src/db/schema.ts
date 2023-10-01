import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  varchar,
  boolean,
  unique,
  AnyPgColumn,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "@auth/core/adapters";
import { nanoid } from "nanoid";
import { relations } from "drizzle-orm";

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

export const userRealtions = relations(users, ({ one, many }) => ({
  tournamentAdmins: many(tournamentAdmins),
  userToTeams: many(userToTeams),
}));

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

// TODO: Add Drizzle relations - https://orm.drizzle.team/docs/rqb

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

export const tournamentRelations = relations(tournaments, ({ one, many }) => ({
  matches: many(matches),
  teams: many(teams),
  tournamentAdmins: many(tournamentAdmins),
}));

export const tournamentAdmins = pgTable(
  "tournament_admins",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    tournamentId: text("tournament_id")
      .notNull()
      .references(() => tournaments.id),
    accepted: boolean("accepted").notNull().default(false),
    invitedAt: timestamp("invited_at").defaultNow(),
    invitedBy: text("invited_by").references(() => users.id),
  },
  (utt) => ({
    pk: primaryKey(utt.userId, utt.tournamentId),
  }),
);

export const tournamentAdminRelations = relations(
  tournamentAdmins,
  ({ one, many }) => ({
    tournaments: one(tournaments, {
      fields: [tournamentAdmins.tournamentId],
      references: [tournaments.id],
    }),
    users: one(users, {
      fields: [tournamentAdmins.userId],
      references: [users.id],
    }),
  }),
);

export type teamsSelect = typeof teams.$inferSelect;

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
  totalRounds: integer("total_rounds"),
  current_round: integer("current_round"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  eliminated: boolean("eliminated").notNull().default(false),
});

export const teamRelations = relations(teams, ({ one, many }) => ({
  tournaments: one(tournaments, {
    fields: [teams.tournamentId],
    references: [tournaments.id],
  }),
  userToTeams: many(userToTeams),
}));

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

export const userToTeamsRelations = relations(userToTeams, ({ one }) => ({
  teams: one(teams, {
    fields: [userToTeams.teamId],
    references: [teams.id],
  }),
  users: one(users, {
    fields: [userToTeams.userId],
    references: [users.id],
  }),
  tournaments: one(tournaments, {
    fields: [userToTeams.tournamentId],
    references: [tournaments.id],
  }),
}));

export const matches = pgTable(
  "match",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => nanoid()),
    round: integer("round").notNull(),
    teamAId: text("teamA_id").references(() => teams.id),
    teamBId: text("teamB_id").references(() => teams.id),
    tournamentId: text("tournament_id")
      .notNull()
      .references(() => tournaments.id, {
        onDelete: "cascade",
      }),
    winner: varchar("winner", { enum: ["teamA", "teamB"] }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    completedAt: timestamp("completed_at"),
    parentId: text("parent_id").references((): AnyPgColumn => matches.id),
  },
  (matches) => ({
    unq1: unique().on(matches.round, matches.tournamentId, matches.teamAId),
    unq2: unique().on(matches.round, matches.tournamentId, matches.teamBId),
  }),
);

export const matchRelations = relations(matches, ({ one, many }) => ({
  tournament: one(tournaments, {
    fields: [matches.tournamentId],
    references: [tournaments.id],
  }),
}));
