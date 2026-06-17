enum QuizState {
  NotStarted,
  InProgress,
  Finished,
}

interface Question {
  id: number;
  category: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
}

interface AnswerRecord {
  questionId: number;
  selectedIndex: number | null;
  isCorrect: boolean;
  timeTakenMs: number;
}

interface QuizResult {
  total: number;
  correct: number;
  answers: AnswerRecord[];
}
