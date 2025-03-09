export interface OnboardingQuestion {
  id: number;
  question: string;
  options: OnboardingOption[];
  description?: string;
}

export interface OnboardingOption {
  id: string;
  label: string;
  icon?: string;
}

export interface OnboardingAnswer {
  questionId: string;
  selectedOptionId: string;
}

export interface OnboardingState {
  currentQuestionIndex: number;
  answers: OnboardingAnswer[];
  isComplete: boolean;
}
