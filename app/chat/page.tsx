import { stackServerApp } from '@/stack';
import { Container } from '@mui/material';

import { Chat } from '@/components/Chat';

export default async function ChatPage() {
  const user = await stackServerApp.getUser();
  const userId = user?.id ?? '';
  if (!userId) {
    throw new Error('User not found');
  }
  return (
    <Container maxWidth='lg' className='py-8'>
      <Chat />
    </Container>
  );
}
