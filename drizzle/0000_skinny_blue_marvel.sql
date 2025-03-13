CREATE TABLE "projects" (
	"url" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_url" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_url_projects_url_fk" FOREIGN KEY ("project_url") REFERENCES "public"."projects"("url") ON DELETE no action ON UPDATE no action;