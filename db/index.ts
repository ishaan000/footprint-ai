import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';

import { OnboardingQuestion } from '@/types/Onboarding';

import { initialQuestionOptionsTable, initialQuestionsTable } from './schema';

const db = drizzle(process.env.DATABASE_URL!);

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
