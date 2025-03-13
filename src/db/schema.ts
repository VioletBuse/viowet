import { relations } from "drizzle-orm";
import { index, pgTable, serial, text, vector } from "drizzle-orm/pg-core";

export const projects_table = pgTable("projects", {
    url: text('url').primaryKey()
})

export const projects_relations = relations(projects_table, ({ many }) => ({
    tasks: many(tasks_table),
    docs: many(documentation_table)
}))

export const tasks_table = pgTable("tasks", {
    id: serial('id').primaryKey(),
    project_url: text('project_url').notNull().references(() => projects_table.url),
    description: text('description').notNull()
})

export const tasks_relations = relations(tasks_table, ({ one }) => ({
    project: one(projects_table, {
        fields: [tasks_table.project_url],
        references: [projects_table.url]
    })
}))

export const documentation_table = pgTable("documentation", {
    id: serial('id').primaryKey(),
    project_url: text('project_url').notNull().references(() => projects_table.url),
    name: text('name').notNull(),
    description: text('name').notNull(),
    content: text('content'),
    embedding: vector('embedding', { dimensions: 1536 })
}, table => [
    index('documentation_embedding_index').using('hnsw', table.embedding.op('vector_cosine_ops'))
])

export const documentation_relations = relations(documentation_table, ({ one }) => ({
    project: one(projects_table, {
        fields: [documentation_table.project_url],
        references: [projects_table.url]
    })
}))
