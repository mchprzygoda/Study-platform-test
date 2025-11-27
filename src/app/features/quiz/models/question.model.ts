export interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuestionModel {
  id?: string;
  subjectId: string;
  question: string;
  answers: AnswerOption[];
  type: 'single' | 'multiple'; // single = radio, multiple = checkbox
  createdAt?: any;
  updatedAt?: any;
}

