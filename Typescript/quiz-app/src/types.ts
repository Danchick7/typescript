// ─────────────────────────────────────────────────────────
// types.ts
// Shared shapes used across the quiz app. Kept in its own
// file so the data model is easy to find and easy to grade.
// ─────────────────────────────────────────────────────────

/** Lifecycle states the quiz can be in. */
enum QuizState {
  NotStarted,
  InProgress,
  Finished,
}

/** A single multiple-choice question. */
interface Question {
  id: number;
  category: string;
  prompt: string;
  choices: string[];
  /** Index into `choices` that is the correct answer. */
  correctIndex: number;
}

/** What we record once a question has been answered (or timed out). */
interface AnswerRecord {
  questionId: number;
  /** null means the timer ran out before the user picked an answer. */
  selectedIndex: number | null;
  isCorrect: boolean;
  timeTakenMs: number;
}

/** Final tally shown on the results screen. */
interface QuizResult {
  total: number;
  correct: number;
  answers: AnswerRecord[];
}
