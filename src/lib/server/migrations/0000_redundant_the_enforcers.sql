CREATE TABLE "refresh_log" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cluster_name" varchar(255) NOT NULL,
	"outcome" varchar(20) NOT NULL,
	"repo_count" integer,
	"error_message" text,
	"rate_limit_remaining" integer,
	"rate_limit_reset" timestamp with time zone,
	"duration_ms" integer,
	"attempted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "repository_cache" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cluster_name" varchar(255) NOT NULL,
	"repo_names" json NOT NULL,
	"raw_data" json NOT NULL,
	"fetched_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"status" varchar(20) DEFAULT 'ok' NOT NULL,
	"last_error" text,
	"error_count" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_cluster_name" ON "refresh_log" USING btree ("cluster_name");--> statement-breakpoint
CREATE INDEX "idx_attempted_at" ON "refresh_log" USING btree ("attempted_at");--> statement-breakpoint
CREATE INDEX "idx_outcome" ON "refresh_log" USING btree ("outcome");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_cluster_name_unique" ON "repository_cache" USING btree ("cluster_name");--> statement-breakpoint
CREATE INDEX "idx_fetched_at" ON "repository_cache" USING btree ("fetched_at");--> statement-breakpoint
CREATE INDEX "idx_status" ON "repository_cache" USING btree ("status");