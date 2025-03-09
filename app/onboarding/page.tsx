import { fetchQuestionsWithOptions } from '@/db';
import { stackServerApp } from '@/stack';
import { Container, Typography } from '@mui/material';

import { OnboardingQuestionnaire } from '@/components/OnboardingQuestionnaire';

export default async function OnboardingPage() {
  const onboardingQuestions = await fetchQuestionsWithOptions();
  const user = await stackServerApp.getUser();
  const userId = user?.id ?? '';
  if (!userId) {
    throw new Error('User not found');
  }
  return (
    <Container maxWidth='lg' className='py-8'>
      <Typography variant='h3' component='h1' align='center' gutterBottom>
        Welcome to Footprint AI
      </Typography>
      <Typography variant='h6' align='center' color='text.secondary'>
        {"Let's get to know you better to help reduce your carbon footprint"}
      </Typography>

      <OnboardingQuestionnaire
        questions={onboardingQuestions}
        stackUserId={userId}
      />
    </Container>
  );
}
