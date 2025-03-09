export interface OnboardingQuestion {
  id: string;
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

// Props interface for the component
export interface OnboardingQuestionnaireProps {
  questions: OnboardingQuestion[];
  onComplete: (answers: OnboardingAnswer[]) => void;
}
