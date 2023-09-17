CREATE TABLE IF NOT EXISTS "schedule" (
	"id" text PRIMARY KEY NOT NULL,
	"tournament_id" text NOT NULL,
	"current_round" integer,
	"total_rounds" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "schedule_to_matches" (
	"schedule_id" text NOT NULL,
	"match_id" text NOT NULL,
	"round" integer NOT NULL,
	"team_a_id" text,
	"team_b_id" text,
	"parent_match_id" text,
	CONSTRAINT schedule_to_matches_schedule_id_match_id PRIMARY KEY("schedule_id","match_id"),
	CONSTRAINT "schedule_to_matches_round_schedule_id_team_a_id_unique" UNIQUE("round","schedule_id","team_a_id"),
	CONSTRAINT "schedule_to_matches_round_schedule_id_team_b_id_unique" UNIQUE("round","schedule_id","team_b_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_to_teams" (
	"team_id" text NOT NULL,
	"user_id" text NOT NULL,
	"tournament_id" text NOT NULL,
	CONSTRAINT users_to_teams_team_id_user_id_tournament_id PRIMARY KEY("team_id","user_id","tournament_id")
);
--> statement-breakpoint
ALTER TABLE "match" ALTER COLUMN "tournament_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "teams" ALTER COLUMN "tournament_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tournament" ADD COLUMN "completed_at" timestamp;--> statement-breakpoint
ALTER TABLE "match" DROP COLUMN IF EXISTS "team_a";--> statement-breakpoint
ALTER TABLE "match" DROP COLUMN IF EXISTS "team_b";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "schedule" ADD CONSTRAINT "schedule_tournament_id_tournament_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "tournament"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "schedule_to_matches" ADD CONSTRAINT "schedule_to_matches_schedule_id_schedule_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "schedule"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "schedule_to_matches" ADD CONSTRAINT "schedule_to_matches_match_id_match_id_fk" FOREIGN KEY ("match_id") REFERENCES "match"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "schedule_to_matches" ADD CONSTRAINT "schedule_to_matches_team_a_id_teams_id_fk" FOREIGN KEY ("team_a_id") REFERENCES "teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "schedule_to_matches" ADD CONSTRAINT "schedule_to_matches_team_b_id_teams_id_fk" FOREIGN KEY ("team_b_id") REFERENCES "teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "schedule_to_matches" ADD CONSTRAINT "schedule_to_matches_parent_match_id_match_id_fk" FOREIGN KEY ("parent_match_id") REFERENCES "match"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_teams" ADD CONSTRAINT "users_to_teams_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_teams" ADD CONSTRAINT "users_to_teams_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_teams" ADD CONSTRAINT "users_to_teams_tournament_id_tournament_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "tournament"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
