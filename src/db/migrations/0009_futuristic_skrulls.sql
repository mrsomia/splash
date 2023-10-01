ALTER TABLE "match" ADD COLUMN "match_number" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "match" DROP COLUMN IF EXISTS "team_a_score";--> statement-breakpoint
ALTER TABLE "match" DROP COLUMN IF EXISTS "team_b_score";--> statement-breakpoint
ALTER TABLE "match" ADD CONSTRAINT "match_tournament_id_match_number_unique" UNIQUE("tournament_id","match_number");