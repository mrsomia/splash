CREATE TABLE IF NOT EXISTS "tournament_admins" (
	"user_id" text NOT NULL,
	"tournament_id" text NOT NULL,
	"accepted" boolean DEFAULT false NOT NULL,
	"invited_at" timestamp DEFAULT now(),
	CONSTRAINT tournament_admins_user_id_tournament_id PRIMARY KEY("user_id","tournament_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournament_admins" ADD CONSTRAINT "tournament_admins_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournament_admins" ADD CONSTRAINT "tournament_admins_tournament_id_tournament_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "tournament"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
