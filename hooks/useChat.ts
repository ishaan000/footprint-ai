'use client';

import { useState } from 'react';

import { createCarbonEvent } from '@/db';

import { CARBON_EVENT_TYPES, CarbonEvent } from '@/types/CarbonEvents';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  userStackAuthId: string;
}

export function useChat(options: ChatOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [points, setPoints] = useState<number>(0);

  // ✅ Improved list of sustainability-related keywords
  const measurableKeywords = [
    'reusable',
    'recycle',
    'carpool',
    'bike',
    'solar',
    'compost',
    'LED',
    'low-flow',
    'fix leaks',
    'plant-based',
    'greywater',
    'public transport',
    'reduce waste',
    'energy-efficient',
    'walk',
    'bus',
  ];

  // ✅ Check if the user's message contains a sustainability-related action
  const isMeasurableAction = (userMessage: string): boolean => {
    return measurableKeywords.some((keyword) =>
      userMessage.toLowerCase().includes(keyword)
    );
  };

  // ✅ Function to assign points for valid sustainable actions
  const calculatePoints = (userMessage: string): number => {
    if (!isMeasurableAction(userMessage)) {
      console.log(`❌ No points awarded: "${userMessage}" is not measurable.`);
      return 0;
    }
    const pointsAwarded = Math.floor(Math.random() * 10) + 5;
    console.log(`✅ Earned ${pointsAwarded} points for: "${userMessage}"`);
    return pointsAwarded;
  };

  // ✅ Function to log chat points as carbon events
  const logChatPoints = async (userMessage: string, pointsAwarded: number) => {
    try {
      const chatEventType = CARBON_EVENT_TYPES.find(
        (t) => t.id === 'chat-sustainable-action'
      );
      if (!chatEventType) return;

      const event: CarbonEvent = {
        id: 0,
        type: chatEventType,
        date: new Date().toISOString(),
        description: `Chat: ${userMessage}`,
        carbonScore: pointsAwarded,
        category: 'other',
      };

      await createCarbonEvent(options.userStackAuthId, event);
    } catch (error) {
      console.error('Failed to log chat points:', error);
    }
  };

  const formatResponse = (text: unknown): string => {
    if (typeof text === 'object' && text !== null && 'content' in text) {
      text = (text as { content: string }).content;
    }

    if (typeof text !== 'string') {
      console.error('Expected a string but received:', text);
      return '⚠️ Error: Invalid AI response format.';
    }

    return text
      .replace(/(^|\n)(\d+)\.(?!\d)/g, '<br><strong>$2.</strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/(\r\n|\r|\n)/g, '<br>');
  };

  const sendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // ✅ Calculate points for the user action
      const pointsForAction = calculatePoints(content);
      if (pointsForAction > 0) {
        setPoints((prev) => prev + pointsForAction);
        // Log the points to the database
        await logChatPoints(content, pointsForAction);
      }

      // Add user message to the chat
      const newMessages = [...messages, { role: 'user' as const, content }];
      setMessages(newMessages);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
          ...options,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const formattedMessage = {
        role: 'assistant' as const,
        content: formatResponse(data.message),
      };

      const updatedMessages = [...newMessages, formattedMessage];

      // ✅ Append points message ONLY if the action was valid
      if (pointsForAction > 0) {
        updatedMessages.push({
          role: 'assistant' as const,
          content: `<div class="text-center">
            <p class="text-lg font-medium mb-1">🌿 Great choice! You earned <span class="text-[#00e5bf]">${pointsForAction} points</span>!</p>
            <p class="text-sm">🌍 Total Points: <span class="font-medium">${points + pointsForAction}</span></p>
          </div>`,
        });
      }

      setMessages(updatedMessages);
      return formattedMessage;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setError(null);
    setPoints(0);
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    points,
  };
}
