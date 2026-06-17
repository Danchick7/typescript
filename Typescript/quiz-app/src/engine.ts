// ─────────────────────────────────────────────────────────
// engine.ts
// All quiz state and scoring logic lives here, with zero
// knowledge of the DOM. That separation means this class
// could power a console quiz, a test suite, or a different
// UI entirely without any changes.
// ─────────────────────────────────────────────────────────

/** Fisher–Yates shuffle. Generic so it works for any array type. */
function shuffle<T>(items: T[]): T[] {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

class QuizEngine {
  private readonly questions: Question[];
  private currentIndex = 0;
  private answers: AnswerRecord[] = [];
  private state: QuizState = QuizState.NotStarted;

  constructor(questions: Question[]) {
    this.questions = shuffle(questions);
  }

  start(): void {
    this.state = QuizState.InProgress;
    this.currentIndex = 0;
    this.answers = [];
  }

  get current(): Question {
    return this.questions[this.currentIndex];
  }

  get total(): number {
    return this.questions.length;
  }

  get currentNumber(): number {
    return this.currentIndex + 1;
  }

  get isFinished(): boolean {
    return this.state === QuizState.Finished;
  }

  /** Records an answer for the current question and returns the resulting record. */
  submitAnswer(selectedIndex: number | null, timeTakenMs: number): AnswerRecord {
    const question = this.current;
    const isCorrect = selectedIndex !== null && selectedIndex === question.correctIndex;
    const record: AnswerRecord = {
      questionId: question.id,
      selectedIndex,
      isCorrect,
      timeTakenMs,
    };
    this.answers.push(record);
    return record;
  }

  /** Moves to the next question. Returns false (and marks the quiz finished) if there isn't one. */
  advance(): boolean {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      return true;
    }
    this.state = QuizState.Finished;
    return false;
  }

  getResult(): QuizResult {
    const correct = this.answers.filter((a) => a.isCorrect).length;
    return {
      total: this.questions.length,
      correct,
      answers: this.answers,
    };
  }

  /** One boolean per question: true if it's already been answered. Used for the progress dots. */
  getProgressDots(): boolean[] {
    return this.questions.map((_, i) => i < this.answers.length);
  }
}
