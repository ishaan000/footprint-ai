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
  // Chat Actions
  {
    id: 'chat-sustainable-action',
    name: 'Sustainable Action Discussion',
    category: 'other',
    baseScore: 2,
    icon: '💬',
  },
  // Transport
  {
    id: 'flight-short',
    name: 'Short-haul Flight',
    category: 'transport',
    baseScore: -50,
    icon: '✈️',
  },
  {
    id: 'flight-long',
    name: 'Long-haul Flight',
    category: 'transport',
    baseScore: -150,
    icon: '✈️',
  },
  {
    id: 'car-commute',
    name: 'Car Commute',
    category: 'transport',
    baseScore: -5,
    icon: '🚗',
  },
  {
    id: 'public-transport',
    name: 'Public Transport',
    category: 'transport',
    baseScore: 3,
    icon: '🚌',
  },
  {
    id: 'bike-commute',
    name: 'Bicycle/Walk Commute',
    category: 'transport',
    baseScore: 8,
    icon: '🚲',
  },

  // Food
  {
    id: 'meat-meal',
    name: 'Meat-based Meal',
    category: 'food',
    baseScore: -8,
    icon: '🥩',
  },
  {
    id: 'vegetarian-meal',
    name: 'Vegetarian Meal',
    category: 'food',
    baseScore: 4,
    icon: '🥗',
  },
  {
    id: 'vegan-meal',
    name: 'Vegan Meal',
    category: 'food',
    baseScore: 8,
    icon: '🥬',
  },
  {
    id: 'local-food',
    name: 'Local Food Purchase',
    category: 'food',
    baseScore: 5,
    icon: '🏡',
  },
  {
    id: 'food-waste',
    name: 'Food Waste Prevention',
    category: 'food',
    baseScore: 6,
    icon: '🗑️',
  },

  // Energy
  {
    id: 'electricity-renewable',
    name: 'Renewable Electricity Usage',
    category: 'energy',
    baseScore: 10,
    icon: '⚡',
  },
  {
    id: 'energy-efficiency',
    name: 'Energy Efficiency Improvement',
    category: 'energy',
    baseScore: 8,
    icon: '💡',
  },
  {
    id: 'heating-reduction',
    name: 'Heating/Cooling Reduction',
    category: 'energy',
    baseScore: 5,
    icon: '🌡️',
  },

  // Shopping
  {
    id: 'secondhand-purchase',
    name: 'Secondhand Purchase',
    category: 'shopping',
    baseScore: 6,
    icon: '🔄',
  },
  {
    id: 'eco-product',
    name: 'Eco-friendly Product',
    category: 'shopping',
    baseScore: 4,
    icon: '🌱',
  },
  {
    id: 'clothes-shopping',
    name: 'New Clothes Purchase',
    category: 'shopping',
    baseScore: -15,
    icon: '👕',
  },
  {
    id: 'electronics-purchase',
    name: 'Electronics Purchase',
    category: 'shopping',
    baseScore: -25,
    icon: '📱',
  },

  // Waste
  {
    id: 'recycling',
    name: 'Recycling',
    category: 'waste',
    baseScore: 4,
    icon: '♻️',
  },
  {
    id: 'composting',
    name: 'Composting',
    category: 'waste',
    baseScore: 5,
    icon: '🌱',
  },
  {
    id: 'zero-waste',
    name: 'Zero Waste Shopping',
    category: 'waste',
    baseScore: 7,
    icon: '🛍️',
  },
  {
    id: 'plastic-reduction',
    name: 'Single-use Plastic Reduction',
    category: 'waste',
    baseScore: 6,
    icon: '🚫',
  },

  // Water
  {
    id: 'water-conservation',
    name: 'Water Conservation',
    category: 'other',
    baseScore: 4,
    icon: '💧',
  },
  {
    id: 'rainwater-collection',
    name: 'Rainwater Collection',
    category: 'other',
    baseScore: 6,
    icon: '🌧️',
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
