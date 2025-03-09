import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

// Users table definition
export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  stack_auth_id: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

// Questions table definition
export const initialQuestionsTable = pgTable('initial_questions', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  question: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
});

// Options table definition with a foreign key to questions
export const initialQuestionOptionsTable = pgTable('initial_question_options', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  question_id: integer()
    .notNull()
    .references(() => initialQuestionsTable.id, { onDelete: 'cascade' }),
  option: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  carbon_footprint: integer().notNull(),
});
