CREATE TABLE "documentation" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_url" text NOT NULL,
	"name" text NOT NULL,
	"content" text,
	"embedding" vector(1536)
);
--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "documentation" ADD CONSTRAINT "documentation_project_url_projects_url_fk" FOREIGN KEY ("project_url") REFERENCES "public"."projects"("url") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "documentation_embedding_index" ON "documentation" USING hnsw ("embedding" vector_cosine_ops);