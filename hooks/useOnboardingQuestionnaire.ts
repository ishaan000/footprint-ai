'use client';

import { useCallback, useState } from 'react';

import type {
  OnboardingAnswer,
  OnboardingQuestion,
  OnboardingState,
} from '../types/Onboarding';

export const useOnboardingQuestionnaire = (questions: OnboardingQuestion[]) => {
  const [state, setState] = useState<OnboardingState>({
    currentQuestionIndex: 0,
    answers: [],
    isComplete: false,
  });

  const handleAnswer = useCallback(
    (selectedOptionId: string) => {
      setState((prev: OnboardingState) => {
        const currentQuestion = questions[prev.currentQuestionIndex];
        const newAnswers = [...prev.answers];

        // Update or add the answer for the current question
        const answerIndex = newAnswers.findIndex(
          (a: OnboardingAnswer) => a.questionId === currentQuestion.id
        );

        if (answerIndex >= 0) {
          newAnswers[answerIndex] = {
            questionId: currentQuestion.id,
            selectedOptionId,
          };
        } else {
          newAnswers.push({
            questionId: currentQuestion.id,
            selectedOptionId,
          });
        }

        const isLastQuestion =
          prev.currentQuestionIndex === questions.length - 1;

        return {
          ...prev,
          answers: newAnswers,
          currentQuestionIndex: isLastQuestion
            ? prev.currentQuestionIndex
            : prev.currentQuestionIndex + 1,
          isComplete: isLastQuestion,
        };
      });
    },
    [questions]
  );

  const goToPreviousQuestion = useCallback(() => {
    setState((prev: OnboardingState) => ({
      ...prev,
      currentQuestionIndex: Math.max(0, prev.currentQuestionIndex - 1),
      isComplete: false,
    }));
  }, []);

  const resetQuestionnaire = useCallback(() => {
    setState({
      currentQuestionIndex: 0,
      answers: [],
      isComplete: false,
    });
  }, []);

  const currentAnswer = state.answers.find(
    (a: OnboardingAnswer) =>
      a.questionId === questions[state.currentQuestionIndex]?.id
  );

  return {
    currentQuestionIndex: state.currentQuestionIndex,
    currentQuestion: questions[state.currentQuestionIndex],
    currentAnswer,
    answers: state.answers,
    isComplete: state.isComplete,
    handleAnswer,
    goToPreviousQuestion,
    resetQuestionnaire,
    totalQuestions: questions.length,
  };
};
