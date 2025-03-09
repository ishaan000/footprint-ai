export interface CarbonEvent {
  id: number;
  type: CarbonEventType;
  date: string; // ISO string
  description?: string;
  carbonScore: number;
  category: CarbonEventCategory;
}

export type CarbonEventCategory =
  | 'transport'
  | 'food'
  | 'energy'
  | 'shopping'
  | 'waste'
  | 'digital'
  | 'other';

export interface CarbonEventType {
  id: string;
  name: string;
  category: CarbonEventCategory;
  baseScore: number;
  icon: string; // Emoji or icon name
}

export const CARBON_EVENT_TYPES: CarbonEventType[] = [
  // Transport
  {
    id: 'flight-short',
    name: 'Short-haul Flight',
    category: 'transport',
    baseScore: -180,
    icon: '✈️',
  },
  {
    id: 'flight-long',
    name: 'Long-haul Flight',
    category: 'transport',
    baseScore: -900,
    icon: '✈️',
  },
  {
    id: 'car-commute',
    name: 'Car Commute',
    category: 'transport',
    baseScore: -3,
    icon: '🚗',
  },
  {
    id: 'public-transport',
    name: 'Public Transport',
    category: 'transport',
    baseScore: 1,
    icon: '🚌',
  },
  {
    id: 'bike-commute',
    name: 'Bicycle Commute',
    category: 'transport',
    baseScore: 5,
    icon: '🚲',
  },

  // Food
  {
    id: 'meat-meal',
    name: 'Meat-based Meal',
    category: 'food',
    baseScore: -4,
    icon: '🥩',
  },
  {
    id: 'vegetarian-meal',
    name: 'Vegetarian Meal',
    category: 'food',
    baseScore: 2,
    icon: '🥗',
  },
  {
    id: 'vegan-meal',
    name: 'Vegan Meal',
    category: 'food',
    baseScore: 3,
    icon: '🥬',
  },
  {
    id: 'dairy-consumption',
    name: 'Dairy Product Consumption',
    category: 'food',
    baseScore: -2,
    icon: '🥛',
  },

  // Energy
  {
    id: 'electricity-renewable',
    name: 'Renewable Electricity Usage',
    category: 'energy',
    baseScore: 5,
    icon: '⚡',
  },
  {
    id: 'electricity-nonrenewable',
    name: 'Non-renewable Electricity Usage',
    category: 'energy',
    baseScore: -5,
    icon: '🔌',
  },
  {
    id: 'heating',
    name: 'Home Heating',
    category: 'energy',
    baseScore: -10,
    icon: '🔥',
  },

  // Shopping
  {
    id: 'clothes-shopping',
    name: 'Clothes Shopping',
    category: 'shopping',
    baseScore: -50,
    icon: '👕',
  },
  {
    id: 'electronics-purchase',
    name: 'Electronics Purchase',
    category: 'shopping',
    baseScore: -200,
    icon: '📱',
  },

  // Waste
  {
    id: 'recycling',
    name: 'Recycling Waste',
    category: 'waste',
    baseScore: 5,
    icon: '♻️',
  },
  {
    id: 'general-waste',
    name: 'General Waste',
    category: 'waste',
    baseScore: -10,
    icon: '🗑️',
  },

  // Digital
  {
    id: 'video-streaming',
    name: 'Video Streaming',
    category: 'digital',
    baseScore: -2,
    icon: '📺',
  },
  {
    id: 'cloud-storage',
    name: 'Cloud Storage Usage',
    category: 'digital',
    baseScore: -1,
    icon: '☁️',
  },

  // Other
  {
    id: 'hotel-stay',
    name: 'Hotel Stay',
    category: 'other',
    baseScore: -30,
    icon: '🏨',
  },
  {
    id: 'event-attendance',
    name: 'Event Attendance',
    category: 'other',
    baseScore: -15,
    icon: '🎫',
  },
];

export interface DailyCarbon {
  date: string;
  totalScore: number;
  events: CarbonEvent[];
}
