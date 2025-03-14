'use client';

import { useEffect, useState } from 'react';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

import { saveOnboardingAnswers } from '@/db';
import { ChevronLeft } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Typography,
} from '@mui/material';

import { useOnboardingQuestionnaire } from '@/hooks/useOnboardingQuestionnaire';

import type { OnboardingAnswer, OnboardingQuestion } from '@/types/Onboarding';

// Dynamically import Framer Motion components with ssr disabled
const MotionDiv = dynamic(
  async () => {
    const { motion } = await import('framer-motion');
    return motion.div;
  },
  { ssr: false }
);

const handleOnboardingComplete = (
  answers: OnboardingAnswer[],
  stackUserId: string
) => {
  saveOnboardingAnswers(stackUserId, answers);
  console.log('Onboarding completed!', answers);
};

export const OnboardingQuestionnaire = ({
  questions,
  stackUserId,
}: {
  questions: OnboardingQuestion[];
  stackUserId: string;
}) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const {
    currentQuestion,
    currentQuestionIndex,
    currentAnswer,
    answers,
    isComplete,
    handleAnswer,
    goToPreviousQuestion,
    totalQuestions,
  } = useOnboardingQuestionnaire(questions);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isComplete) {
      handleOnboardingComplete(answers, stackUserId);
      router.push('/dashboard');
    }
  }, [isComplete, answers, stackUserId, router]);

  if (!isMounted || !currentQuestion) return null;

  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <Box className='mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-8'>
      {/* Progress bar */}
      <Box className='mb-8'>
        <LinearProgress
          variant='determinate'
          value={progress}
          sx={{ height: 8, borderRadius: 4 }}
        />
        <Typography variant='body2' className='mt-2 text-gray-600'>
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </Typography>
      </Box>

      {/* Back button */}
      {currentQuestionIndex > 0 && (
        <Button
          variant='text'
          onClick={goToPreviousQuestion}
          startIcon={<ChevronLeft />}
          className='mb-4 self-start'
        >
          Back
        </Button>
      )}

      <MotionDiv
        key={currentQuestion.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className='space-y-6'
      >
        {/* Question */}
        <Box className='space-y-2'>
          <Typography variant='h4' component='h2'>
            {currentQuestion.question}
          </Typography>
          {currentQuestion.description && (
            <Typography variant='body1' color='text.secondary'>
              {currentQuestion.description}
            </Typography>
          )}
        </Box>

        {/* Options */}
        <Box className='grid gap-4'>
          {currentQuestion.options.map((option) => (
            <Card
              key={option.id}
              onClick={() => handleAnswer(option.id)}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                },
                border: currentAnswer?.selectedOptionId === option.id ? 2 : 1,
                borderColor:
                  currentAnswer?.selectedOptionId === option.id
                    ? 'primary.main'
                    : 'divider',
              }}
            >
              <CardContent className='p-4'>
                <Box className='flex items-center gap-3'>
                  {option.icon && (
                    <Typography variant='h5' className='text-xl'>
                      {option.icon}
                    </Typography>
                  )}
                  <Typography variant='body1' className='flex-grow font-medium'>
                    {option.label}
                  </Typography>
                  <Box
                    className='h-5 w-5 rounded-full border-2'
                    sx={{
                      borderColor:
                        currentAnswer?.selectedOptionId === option.id
                          ? 'primary.main'
                          : 'grey.300',
                      bgcolor:
                        currentAnswer?.selectedOptionId === option.id
                          ? 'primary.main'
                          : 'transparent',
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </MotionDiv>
    </Box>
  );
};
