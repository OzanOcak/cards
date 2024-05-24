import { sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const language = sqliteTable("language",{
	id:integer("id").primaryKey({ autoIncrement: true }),
	title:text('title')
})

export const category = sqliteTable("category",{
	id:integer("id").primaryKey({ autoIncrement: true }),
	title:text("title",{ enum: ["nouns", "verbs","idioms"] }),
})

export const words = sqliteTable("words", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	title: text("title"),
	definition: text("definition"),
	sentence:text("sentence"),
	level:text("level",{ enum: ["basic", "intermadiate","advanced"] }),
	inGame: integer('inGame', { mode: 'boolean'}).default(true),
	languageId: integer('language_id').references(() => language.id),
	languageName: text('language_id'),
	categoryId: integer('category_id').references(() => category.id),
	categoryName: text('category_id'),
	createdAt: text("created_at")
	    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`)
		.notNull(),
})

export type SelectWord = typeof words.$inferSelect
export type SelectLanguage = typeof language.$inferSelect
export type SelectCategory = typeof category.$inferSelect
