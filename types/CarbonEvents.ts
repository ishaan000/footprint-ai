export interface CarbonEvent {
  id: number;
  type: CarbonEventType;
  date: string; // ISO string
  description?: string;
  carbonScore: number; // in kg CO2
  category: CarbonEventCategory;
}

export type CarbonEventCategory =
  | 'transport'
  | 'food'
  | 'energy'
  | 'shopping'
  | 'other';

export interface CarbonEventType {
  id: string;
  name: string;
  category: CarbonEventCategory;
  baseScore: number; // Base carbon score in kg CO2
  icon: string; // Emoji or icon name
}

// Predefined event types
export const CARBON_EVENT_TYPES: CarbonEventType[] = [
  {
    id: 'flight-short',
    name: 'Short-haul Flight',
    category: 'transport',
    baseScore: 180, // Average per flight under 3 hours
    icon: '✈️',
  },
  {
    id: 'flight-long',
    name: 'Long-haul Flight',
    category: 'transport',
    baseScore: 900, // Average per long flight
    icon: '✈️',
  },
  {
    id: 'car-commute',
    name: 'Car Commute',
    category: 'transport',
    baseScore: 3, // Average per 10km
    icon: '🚗',
  },
  {
    id: 'public-transport',
    name: 'Public Transport',
    category: 'transport',
    baseScore: 1, // Average per 10km
    icon: '🚌',
  },
  {
    id: 'meat-meal',
    name: 'Meat-based Meal',
    category: 'food',
    baseScore: 4,
    icon: '🥩',
  },
  {
    id: 'vegetarian-meal',
    name: 'Vegetarian Meal',
    category: 'food',
    baseScore: 1,
    icon: '🥗',
  },
  {
    id: 'vegan-meal',
    name: 'Vegan Meal',
    category: 'food',
    baseScore: 1,
    icon: '🥬',
  },
];

export interface DailyCarbon {
  date: string;
  totalScore: number;
  events: CarbonEvent[];
}
