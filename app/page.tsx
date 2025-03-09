'use client';

import { Container, Typography } from '@mui/material';
import { OnboardingQuestionnaire } from './components/OnboardingQuestionnaire';
import type { OnboardingQuestion, OnboardingAnswer } from './types/onboarding';

const onboardingQuestions: OnboardingQuestion[] = [
  {
    id: '1',
    question: 'What is your primary goal?',
    description: 'Choose the main reason you want to use our app',
    options: [
      {
        id: 'goal-1',
        label: 'Track my carbon footprint',
        icon: '🌱'
      },
      {
        id: 'goal-2',
        label: 'Reduce energy consumption',
        icon: '⚡'
      },
      {
        id: 'goal-3',
        label: 'Learn about sustainability',
        icon: '📚'
      }
    ]
  },
  {
    id: '2',
    question: 'What type of transportation do you use most often?',
    options: [
      {
        id: 'transport-1',
        label: 'Public Transit',
        icon: '🚌'
      },
      {
        id: 'transport-2',
        label: 'Personal Vehicle',
        icon: '🚗'
      },
      {
        id: 'transport-3',
        label: 'Bicycle',
        icon: '🚲'
      },
      {
        id: 'transport-4',
        label: 'Walking',
        icon: '🚶'
      }
    ]
  },
  {
    id: '3',
    question: 'How would you describe your diet?',
    description: 'This helps us calculate your food-related carbon footprint',
    options: [
      {
        id: 'diet-1',
        label: 'Plant-based',
        icon: '🥬'
      },
      {
        id: 'diet-2',
        label: 'Vegetarian',
        icon: '🥗'
      },
      {
        id: 'diet-3',
        label: 'Flexitarian',
        icon: '🥩'
      },
      {
        id: 'diet-4',
        label: 'No dietary restrictions',
        icon: '🍽️'
      }
    ]
  }
];

export default function Home() {
  const handleOnboardingComplete = (answers: OnboardingAnswer[]) => {
    console.log('Onboarding completed!', answers);
    // Here you would typically:
    // 1. Save the answers to your database
    // 2. Update the user's profile
    // 3. Navigate to the next step or dashboard
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        Welcome to Footprint AI
      </Typography>
      <Typography variant="h6" align="center" color="text.secondary" paragraph>
        Let's get to know you better to help reduce your carbon footprint
      </Typography>
      
      <OnboardingQuestionnaire
        questions={onboardingQuestions}
        onComplete={handleOnboardingComplete}
      />
    </Container>
  );
}
