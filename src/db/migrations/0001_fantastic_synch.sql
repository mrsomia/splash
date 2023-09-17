CREATE TABLE IF NOT EXISTS "match" (
	"id" text PRIMARY KEY NOT NULL,
	"team_a" text,
	"team_b" text,
	"team_a_score" integer DEFAULT 0,
	"team_b_score" integer DEFAULT 0,
	"tournament_id" text,
	"winner" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teams" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"tournament_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"eliminated" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tournament" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"winner" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"start_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "match" ADD CONSTRAINT "match_tournament_id_tournament_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "tournament"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teams" ADD CONSTRAINT "teams_tournament_id_tournament_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "tournament"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
