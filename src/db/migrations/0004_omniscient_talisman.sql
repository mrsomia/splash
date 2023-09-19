ALTER TABLE "tournament_admins" ADD COLUMN "invited_by" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tournament_admins" ADD CONSTRAINT "tournament_admins_invited_by_user_id_fk" FOREIGN KEY ("invited_by") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
