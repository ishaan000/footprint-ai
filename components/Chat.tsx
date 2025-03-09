'use client';

import { FormEvent, useState } from 'react';

import { useChat } from '../hooks/useChat';

export function Chat() {
  const [input, setInput] = useState('');
  const { messages, isLoading, error, sendMessage } = useChat();

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
    <div className='mx-auto flex h-[600px] w-full max-w-2xl flex-col'>
      {/* Messages Container */}
      <div className='flex-1 space-y-4 overflow-y-auto p-4'>
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
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className='flex justify-start'>
            <div className='rounded-lg bg-gray-200 p-3 text-gray-800'>
              Thinking...
            </div>
          </div>
        )}
        {error && (
          <div className='p-2 text-center text-red-500'>Error: {error}</div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className='border-t p-4'>
        <div className='flex gap-2'>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Type your message...'
            className='flex-1 rounded-lg border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
            disabled={isLoading}
          />
          <button
            type='submit'
            disabled={isLoading}
            className='rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50'
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
