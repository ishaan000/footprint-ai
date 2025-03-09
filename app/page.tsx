'use client';

import { Container } from '@mui/material';

import { Chat } from '@/components/Chat';

export default function Home() {
  return (
    <Container maxWidth='lg' className='py-8'>
      <Chat />
    </Container>
  );
}
