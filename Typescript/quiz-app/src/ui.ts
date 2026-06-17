// ─────────────────────────────────────────────────────────
// ui.ts
// Everything that touches the DOM lives here. It reads state
// from QuizEngine and renders it; the engine never reaches
// back into the UI.
// ─────────────────────────────────────────────────────────

class QuizUI {
  private readonly engine: QuizEngine;
  private timer: Timer | null = null;
  private questionStartTime = 0;
  private readonly questionDurationMs = 15000;
  private readonly ringCircumference = 2 * Math.PI * 26;
  private locked = false;

  private readonly startScreen = document.getElementById("start-screen") as HTMLElement;
  private readonly quizScreen = document.getElementById("quiz-screen") as HTMLElement;
  private readonly resultScreen = document.getElementById("result-screen") as HTMLElement;

  private readonly startButton = document.getElementById("start-button") as HTMLButtonElement;
  private readonly retryButton = document.getElementById("retry-button") as HTMLButtonElement;

  private readonly categoryLabel = document.getElementById("category-label") as HTMLElement;
  private readonly questionCounter = document.getElementById("question-counter") as HTMLElement;
  private readonly questionPrompt = document.getElementById("question-prompt") as HTMLElement;
  private readonly choicesContainer = document.getElementById("choices") as HTMLElement;
  private readonly progressDots = document.getElementById("progress-dots") as HTMLElement;

  private readonly timerRing = document.getElementById("timer-ring-progress") as unknown as SVGCircleElement;
  private readonly timerLabel = document.getElementById("timer-label") as HTMLElement;

  private readonly scoreStamp = document.getElementById("score-stamp") as HTMLElement;
  private readonly scoreMessage = document.getElementById("score-message") as HTMLElement;

  constructor(engine: QuizEngine) {
    this.engine = engine;
    this.timerRing.style.strokeDasharray = String(this.ringCircumference);
    this.startButton.addEventListener("click", () => this.beginQuiz());
    this.retryButton.addEventListener("click", () => this.beginQuiz());
  }

  private beginQuiz(): void {
    this.engine.start();
    this.startScreen.classList.add("hidden");
    this.resultScreen.classList.add("hidden");
    this.quizScreen.classList.remove("hidden");
    this.renderQuestion();
  }

  private renderQuestion(): void {
    this.locked = false;
    const question = this.engine.current;

    this.categoryLabel.textContent = question.category;
    this.questionCounter.textContent = `Question ${this.engine.currentNumber} of ${this.engine.total}`;
    this.questionPrompt.textContent = question.prompt;

    this.renderProgressDots();
    this.renderChoices(question);
    this.startTimer();
  }

  private renderProgressDots(): void {
    this.progressDots.innerHTML = "";
    const dots = this.engine.getProgressDots();
    dots.forEach((answered, i) => {
      const dot = document.createElement("span");
      dot.className = "dot";
      if (answered) dot.classList.add("answered");
      if (i === this.engine.currentNumber - 1) dot.classList.add("current");
      this.progressDots.appendChild(dot);
    });
  }

  private renderChoices(question: Question): void {
    this.choicesContainer.innerHTML = "";
    const letters = ["A", "B", "C", "D"];

    question.choices.forEach((choiceText, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice";
      button.dataset.index = String(index);
      button.innerHTML = `
        <span class="bubble">
          <span class="bubble-fill"></span>
          <span class="bubble-letter">${letters[index]}</span>
        </span>
        <span class="choice-text"></span>
      `;
      (button.querySelector(".choice-text") as HTMLElement).textContent = choiceText;
      button.addEventListener("click", () => this.handleAnswer(index));
      this.choicesContainer.appendChild(button);
    });
  }

  private startTimer(): void {
    this.questionStartTime = performance.now();
    this.timer = new Timer(
      this.questionDurationMs,
      (remaining, duration) => this.updateTimerDisplay(remaining, duration),
      () => this.handleAnswer(null)
    );
    this.timer.start();
  }

  private updateTimerDisplay(remainingMs: number, durationMs: number): void {
    const fraction = remainingMs / durationMs;
    const offset = this.ringCircumference * (1 - fraction);
    this.timerRing.style.strokeDashoffset = String(offset);
    this.timerLabel.textContent = String(Math.ceil(remainingMs / 1000));
    this.timerRing.classList.toggle("urgent", remainingMs <= 5000);
  }

  private handleAnswer(selectedIndex: number | null): void {
    if (this.locked) return;
    this.locked = true;
    this.timer?.stop();

    const timeTakenMs = performance.now() - this.questionStartTime;
    const record = this.engine.submitAnswer(selectedIndex, timeTakenMs);
    this.markChoices(record);

    window.setTimeout(() => this.goNext(), 900);
  }

  private markChoices(record: AnswerRecord): void {
    const question = this.engine.current;
    const buttons = Array.from(this.choicesContainer.querySelectorAll<HTMLButtonElement>(".choice"));

    buttons.forEach((button, index) => {
      button.disabled = true;
      if (index === question.correctIndex) {
        button.classList.add("correct");
      }
      if (index === record.selectedIndex && !record.isCorrect) {
        button.classList.add("incorrect");
      }
      if (index === record.selectedIndex) {
        button.querySelector(".bubble")?.classList.add("selected");
      }
    });
  }

  private goNext(): void {
    const hasNext = this.engine.advance();
    if (hasNext) {
      this.renderQuestion();
    } else {
      this.showResults();
    }
  }

  private showResults(): void {
    this.quizScreen.classList.add("hidden");
    this.resultScreen.classList.remove("hidden");

    const result = this.engine.getResult();
    this.scoreStamp.textContent = `${result.correct}/${result.total}`;
    this.scoreMessage.textContent = this.getMessage(result.correct, result.total);
  }

  private getMessage(correct: number, total: number): string {
    const pct = correct / total;
    if (pct >= 0.9) return "Excellent! A+ work.";
    if (pct >= 0.7) return "Nice work — solid grasp!";
    if (pct >= 0.5) return "Not bad. Review and try again?";
    return "Keep practicing — you've got this.";
  }
}
