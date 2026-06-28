ALTER TABLE "public"."matches" ADD COLUMN "score_a" integer DEFAULT null;
ALTER TABLE "public"."matches" ADD COLUMN "score_b" integer DEFAULT null;

ALTER TABLE "public"."picks" ADD COLUMN "predicted_score_a" integer DEFAULT null;
ALTER TABLE "public"."picks" ADD COLUMN "predicted_score_b" integer DEFAULT null;

ALTER TABLE "public"."scoring_settings" ADD COLUMN "correct_score_points" integer DEFAULT 1;
