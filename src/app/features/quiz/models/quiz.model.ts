export interface QuizConfig {
  subjectId: string;
  numberOfQuestions: number;
  duration: number; // in minutes
}

export interface QuizSession {
  id?: string;
  subjectId: string;
  questions: string[]; // question IDs
  startTime: Date;
  endTime?: Date;
  answers: { [questionId: string]: string[] }; // selected answer IDs
}

