import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

// Users table definition
export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  stack_auth_id: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
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
  icon: varchar({ length: 255 }).notNull(),
  option: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  carbon_footprint: integer().notNull(),
});

// Answers table definition
export const onboardingAnswersTable = pgTable('onboarding_answers', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  question_id: integer()
    .notNull()
    .references(() => initialQuestionsTable.id, { onDelete: 'cascade' }),
  option_id: integer()
    .notNull()
    .references(() => initialQuestionOptionsTable.id, { onDelete: 'cascade' }),
  answered_at: timestamp().defaultNow(),
});

// Events table definition
export const carbonEventsTable = pgTable('carbon_events', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  date: timestamp().notNull(),
  type: varchar({ length: 255 }).notNull(),
  carbon_score: integer().notNull(),
  description: varchar({ length: 255 }).notNull(),
  category: varchar({ length: 255 }).notNull(),
});
