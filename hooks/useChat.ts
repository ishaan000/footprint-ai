'use client';

import { useEffect, useState } from 'react';

import { createCarbonEvent, fetchUserCarbonEvents } from '@/db';

import { CARBON_EVENT_TYPES, CarbonEvent } from '@/types/CarbonEvents';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatOptions {
  userStackAuthId: string;
}

export function useChat(options: ChatOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [points, setPoints] = useState<number>(0);

  // Initialize points from user's events
  useEffect(() => {
    const initializePoints = async () => {
      try {
        const userEvents = await fetchUserCarbonEvents(options.userStackAuthId);
        const totalPoints = userEvents.reduce(
          (sum, event) => sum + event.carbon_score,
          0
        );
        setPoints(totalPoints);
      } catch (error) {
        console.error('Failed to fetch user events:', error);
      }
    };

    initializePoints();
  }, [options.userStackAuthId]);

  // Map keywords to event types for consistent scoring
  const keywordToEventType: Record<string, string> = {
    // Transport
    'public transport': 'public-transport',
    'public transportation': 'public-transport',
    bus: 'public-transport',
    train: 'public-transport',
    subway: 'public-transport',
    metro: 'public-transport',
    bike: 'bike-commute',
    bicycle: 'bike-commute',
    walk: 'bike-commute',
    walking: 'bike-commute',
    carpool: 'public-transport',
    rideshare: 'public-transport',

    // Food
    vegan: 'vegan-meal',
    'plant-based': 'vegan-meal',
    vegetarian: 'vegetarian-meal',
    meatless: 'vegetarian-meal',
    'local food': 'local-food',
    'farmers market': 'local-food',
    'food waste': 'food-waste',
    'composting food': 'food-waste',
    leftovers: 'food-waste',

    // Energy
    solar: 'electricity-renewable',
    'wind power': 'electricity-renewable',
    renewable: 'electricity-renewable',
    led: 'energy-efficiency',
    'energy efficient': 'energy-efficiency',
    'smart thermostat': 'energy-efficiency',
    insulation: 'energy-efficiency',
    'temperature adjustment': 'heating-reduction',
    thermostat: 'heating-reduction',

    // Shopping
    secondhand: 'secondhand-purchase',
    thrift: 'secondhand-purchase',
    used: 'secondhand-purchase',
    'eco-friendly': 'eco-product',
    'sustainable product': 'eco-product',
    'green product': 'eco-product',

    // Waste
    recycle: 'recycling',
    recycling: 'recycling',
    compost: 'composting',
    composting: 'composting',
    'zero waste': 'zero-waste',
    'bulk shopping': 'zero-waste',
    reusable: 'plastic-reduction',
    'plastic free': 'plastic-reduction',
    'single-use': 'plastic-reduction',

    // Water
    'water saving': 'water-conservation',
    'low-flow': 'water-conservation',
    'fix leak': 'water-conservation',
    'shorter shower': 'water-conservation',
    rainwater: 'rainwater-collection',
    'rain barrel': 'rainwater-collection',
    'water collection': 'rainwater-collection',
  };

  // Check if the user's message contains a sustainability-related action
  const findMatchingEventType = (userMessage: string): string | null => {
    const lowercaseMessage = userMessage.toLowerCase();

    // First, try exact phrase matches
    for (const [keyword, eventTypeId] of Object.entries(keywordToEventType)) {
      if (lowercaseMessage.includes(keyword)) {
        return eventTypeId;
      }
    }

    // Then try to match parts of compound keywords
    const words = lowercaseMessage.split(/\s+/);
    for (const word of words) {
      for (const [keyword, eventTypeId] of Object.entries(keywordToEventType)) {
        if (keyword.split(/\s+/).includes(word)) {
          return eventTypeId;
        }
      }
    }

    return null;
  };

  // Calculate points based on event type base scores
  const calculatePoints = (userMessage: string): number => {
    const eventTypeId = findMatchingEventType(userMessage);
    if (!eventTypeId) {
      console.log(`❌ No points awarded: "${userMessage}" is not measurable.`);
      return 0;
    }

    const eventType = CARBON_EVENT_TYPES.find(
      (type) => type.id === eventTypeId
    );
    if (!eventType) {
      console.log(`❌ No event type found for: "${eventTypeId}"`);
      return 0;
    }

    console.log(
      `✅ Earned ${eventType.baseScore} points for: "${userMessage}" (${eventType.name})`
    );
    return eventType.baseScore;
  };

  // Log chat points as carbon events
  const logChatPoints = async (userMessage: string, pointsAwarded: number) => {
    try {
      const eventTypeId = findMatchingEventType(userMessage);
      if (!eventTypeId) return;

      const eventType = CARBON_EVENT_TYPES.find(
        (type) => type.id === eventTypeId
      );
      if (!eventType) return;

      const event: CarbonEvent = {
        id: 0,
        type: eventType,
        date: new Date().toISOString(),
        description: `Chat: ${userMessage}`,
        carbonScore: pointsAwarded,
        category: eventType.category,
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

      // Calculate points for the user action
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

      // Append points message ONLY if the action was valid
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
