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

  getProgressDots(): boolean[] {
    return this.questions.map((_, i) => i < this.answers.length);
  }
}
