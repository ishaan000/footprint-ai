'use server';

import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';

import { CarbonEvent } from '@/types/CarbonEvents';
import { OnboardingAnswer, OnboardingQuestion } from '@/types/Onboarding';

import {
  carbonEventsTable,
  initialQuestionOptionsTable,
  initialQuestionsTable,
  onboardingAnswersTable,
  usersTable,
} from './schema';

const db = drizzle(process.env.DATABASE_URL!);

// Server action to fetch questions with options for onboarding
export async function fetchQuestionsWithOptions(): Promise<
  OnboardingQuestion[]
> {
  const questions = await db.select().from(initialQuestionsTable);
  const options = await db.select().from(initialQuestionOptionsTable);

  return questions.map((question) => ({
    id: question.id,
    question: question.question,
    description: question.description,
    options: options
      .filter((option) => option.question_id === question.id)
      .map((opt) => ({
        id: opt.id.toString(),
        icon: opt.icon,
        label: opt.option,
      })),
  }));
}

// Server action to save questionnaire answers using Stack Auth ID
export async function saveOnboardingAnswers(
  userStackAuthId: string,
  answers: OnboardingAnswer[]
) {
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.stack_auth_id, userStackAuthId))
    .limit(1)
    .execute();

  if (!user.length) {
    throw new Error('User not found');
  }

  const userId = user[0].id;

  // First delete existing answers for the user to allow redoing questionnaire
  await db
    .delete(onboardingAnswersTable)
    .where(eq(onboardingAnswersTable.user_id, userId));

  // Insert new answers
  await Promise.all(
    answers.map((answer) =>
      db.insert(onboardingAnswersTable).values({
        user_id: userId,
        question_id: parseInt(answer.questionId),
        option_id: parseInt(answer.selectedOptionId),
      })
    )
  );

  console.log('Answers saved successfully');
}

// Server action to create or update user using Stack Auth ID
export async function createOrUpdateUser(
  stackAuthId: string,
  name: string,
  email: string
) {
  const existingUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.stack_auth_id, stackAuthId))
    .limit(1)
    .execute();

  if (existingUser.length > 0) {
    console.log('User already exists:', existingUser[0]);
    return existingUser[0];
  }

  const newUser = await db
    .insert(usersTable)
    .values({ stack_auth_id: stackAuthId, name, email })
    .returning();

  console.log('User created:', newUser[0]);
  return newUser[0];
}

// Server action to fetch user's carbon events
export async function fetchUserCarbonEvents(userStackAuthId: string) {
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.stack_auth_id, userStackAuthId))
    .limit(1)
    .execute();

  if (!user.length) {
    throw new Error('User not found');
  }

  const userId = user[0].id;

  return db
    .select()
    .from(carbonEventsTable)
    .where(eq(carbonEventsTable.user_id, userId))
    .execute();
}

// Server action to create a new carbon event
export async function createCarbonEvent(
  userStackAuthId: string,
  event: CarbonEvent
) {
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.stack_auth_id, userStackAuthId))
    .limit(1)
    .execute();

  if (!user.length) {
    throw new Error('User not found');
  }

  const userId = user[0].id;

  return db
    .insert(carbonEventsTable)
    .values({
      user_id: userId,
      type: event.type?.name ?? '',
      date: new Date(event.date),
      description: event.description ?? '',
      carbon_score: event.carbonScore ?? 0,
      category: event.category ?? '',
    })
    .returning();
}

// Server action to delete a carbon event
export async function deleteCarbonEvent(eventId: number) {
  await db
    .delete(carbonEventsTable)
    .where(eq(carbonEventsTable.id, eventId))
    .execute();
}

// Server action to fetch user's initial question answers
export async function fetchUserInitialQuestionAnswers(userStackAuthId: string) {
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.stack_auth_id, userStackAuthId))
    .limit(1)
    .execute();

  if (!user.length) {
    throw new Error('User not found');
  }

  const userId = user[0].id;

  return db
    .select()
    .from(onboardingAnswersTable)
    .where(eq(onboardingAnswersTable.user_id, userId))
    .execute();
}
