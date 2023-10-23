CREATE TABLE IF NOT EXISTS "push_subs" (
	"id" text PRIMARY KEY NOT NULL,
	"team_id" text NOT NULL,
	"sub_data" text NOT NULL,
	CONSTRAINT "push_subs_team_id_sub_data_unique" UNIQUE("team_id","sub_data")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "push_subs" ADD CONSTRAINT "push_subs_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
