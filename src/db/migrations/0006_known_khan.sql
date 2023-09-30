DROP TABLE "schedule";--> statement-breakpoint
DROP TABLE "schedule_to_matches";--> statement-breakpoint
ALTER TABLE "match" ADD COLUMN "round" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "match" ADD COLUMN "teamA_id" text;--> statement-breakpoint
ALTER TABLE "match" ADD COLUMN "teamB_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "match" ADD CONSTRAINT "match_teamA_id_teams_id_fk" FOREIGN KEY ("teamA_id") REFERENCES "teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "match" ADD CONSTRAINT "match_teamB_id_teams_id_fk" FOREIGN KEY ("teamB_id") REFERENCES "teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "match" ADD CONSTRAINT "match_round_tournament_id_teamA_id_unique" UNIQUE("round","tournament_id","teamA_id");--> statement-breakpoint
ALTER TABLE "match" ADD CONSTRAINT "match_round_tournament_id_teamB_id_unique" UNIQUE("round","tournament_id","teamB_id");