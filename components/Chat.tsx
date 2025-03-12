'use client';

import { FormEvent, useState } from 'react';

import Link from 'next/link';

import { useChat } from '../hooks/useChat';

interface ChatProps {
  userStackAuthId: string;
}

export function Chat({ userStackAuthId }: ChatProps) {
  const [input, setInput] = useState('');
  const { messages, isLoading, error, sendMessage, points } = useChat({
    userStackAuthId,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      await sendMessage(input);
      setInput('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className='mx-auto flex h-[600px] w-full max-w-2xl flex-col rounded-lg border border-gray-200 bg-white shadow-lg'>
      {/* Points Display */}
      <div className='bg-[#00e5bf] p-4 text-center font-medium text-black'>
        <span role='img' aria-label='earth'>
          🌍
        </span>{' '}
        Total Points Earned: {points} Points{' '}
        <span role='img' aria-label='leaf'>
          🌱
        </span>
      </div>

      {/* Messages Container */}
      <div className='flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4'>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-[#00e5bf] text-black'
                  : 'border border-gray-200 bg-white text-black'
              }`}
              dangerouslySetInnerHTML={{ __html: message.content }}
            ></div>
          </div>
        ))}
        {isLoading && (
          <div className='flex justify-start'>
            <div className='rounded-lg border border-gray-200 bg-white p-3 text-black'>
              <div className='flex items-center gap-2'>
                <div className='h-2 w-2 animate-bounce rounded-full bg-[#00e5bf] [animation-delay:-0.3s]'></div>
                <div className='h-2 w-2 animate-bounce rounded-full bg-[#00e5bf] [animation-delay:-0.15s]'></div>
                <div className='h-2 w-2 animate-bounce rounded-full bg-[#00e5bf]'></div>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className='rounded-lg bg-red-50 p-3 text-center text-red-500'>
            Error: {error}
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className='border-t border-gray-200 bg-white p-4'
      >
        <div className='flex gap-2'>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Enter a sustainable action...'
            className='focus:ring-opacity-50 flex-1 rounded-lg border border-gray-200 p-2 focus:border-[#00e5bf] focus:ring-2 focus:ring-[#00e5bf] focus:outline-none'
            disabled={isLoading}
          />
          <button
            type='submit'
            disabled={isLoading}
            className='rounded-lg bg-[#00e5bf] px-6 py-2 font-medium text-black transition-colors hover:bg-[#00d1ae] disabled:opacity-50'
          >
            Send
          </button>
        </div>
        <div className='mt-4 text-center'>
          <Link
            href='/dashboard'
            className='font-medium text-[#00e5bf] hover:text-[#00d1ae]'
          >
            View your sustainability dashboard →
          </Link>
        </div>
      </form>
    </div>
  );
}
