import { relations } from "drizzle-orm";
import { index, pgTable, serial, text, unique, vector } from "drizzle-orm/pg-core";

export const users_table = pgTable("users", {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  password_hash: text('password_hash').notNull()
})

export const users_relations = relations(users_table, ({ many }) => ({
  login_sessions: many(login_sessions_table)
}))

export const login_sessions_table = pgTable("login_sessions", {
  id: text('id').primaryKey(),
  user_id: text('user_id').notNull().references(() => users_table.id)
})

export const login_sessions_relations = relations(login_sessions_table, ({ one }) => ({
  user: one(users_table, {
    fields: [login_sessions_table.user_id],
    references: [users_table.id]
  })
}))

export const projects_table = pgTable("projects", {
  id: text('id').primaryKey(),
  gh_username: text('github_username').notNull(),
  gh_repo: text("github_repo").notNull()
}, t => [
  unique('gh_username_repo_unique').on(t.gh_username, t.gh_repo)
]);

export const projects_relations = relations(projects_table, ({ many }) => ({
  tasks: many(tasks_table),
  docs: many(documentation_table),
}));

export const tasks_table = pgTable("tasks", {
  id: serial("id").primaryKey(),
  project_id: text("project_id")
    .notNull()
    .references(() => projects_table.id),
  description: text("description").notNull(),
});

export const tasks_relations = relations(tasks_table, ({ one }) => ({
  project: one(projects_table, {
    fields: [tasks_table.project_id],
    references: [projects_table.id],
  }),
}));

export const documentation_table = pgTable(
  "documentation",
  {
    id: serial("id").primaryKey(),
    project_id: text("project_id")
      .notNull()
      .references(() => projects_table.id),
    name: text("name").notNull(),
    description: text("name").notNull(),
    content: text("content"),
    embedding: vector("embedding", { dimensions: 1536 }),
  },
  (table) => [
    index("documentation_embedding_index").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  ],
);

export const documentation_relations = relations(
  documentation_table,
  ({ one }) => ({
    project: one(projects_table, {
      fields: [documentation_table.project_id],
      references: [projects_table.id],
    }),
  }),
);
