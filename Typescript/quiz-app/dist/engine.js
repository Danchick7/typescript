"use strict";
// ─────────────────────────────────────────────────────────
// engine.ts
// All quiz state and scoring logic lives here, with zero
// knowledge of the DOM. That separation means this class
// could power a console quiz, a test suite, or a different
// UI entirely without any changes.
// ─────────────────────────────────────────────────────────
/** Fisher–Yates shuffle. Generic so it works for any array type. */
function shuffle(items) {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}
class QuizEngine {
    constructor(questions) {
        this.currentIndex = 0;
        this.answers = [];
        this.state = QuizState.NotStarted;
        this.questions = shuffle(questions);
    }
    start() {
        this.state = QuizState.InProgress;
        this.currentIndex = 0;
        this.answers = [];
    }
    get current() {
        return this.questions[this.currentIndex];
    }
    get total() {
        return this.questions.length;
    }
    get currentNumber() {
        return this.currentIndex + 1;
    }
    get isFinished() {
        return this.state === QuizState.Finished;
    }
    /** Records an answer for the current question and returns the resulting record. */
    submitAnswer(selectedIndex, timeTakenMs) {
        const question = this.current;
        const isCorrect = selectedIndex !== null && selectedIndex === question.correctIndex;
        const record = {
            questionId: question.id,
            selectedIndex,
            isCorrect,
            timeTakenMs,
        };
        this.answers.push(record);
        return record;
    }
    /** Moves to the next question. Returns false (and marks the quiz finished) if there isn't one. */
    advance() {
        if (this.currentIndex < this.questions.length - 1) {
            this.currentIndex++;
            return true;
        }
        this.state = QuizState.Finished;
        return false;
    }
    getResult() {
        const correct = this.answers.filter((a) => a.isCorrect).length;
        return {
            total: this.questions.length,
            correct,
            answers: this.answers,
        };
    }
    /** One boolean per question: true if it's already been answered. Used for the progress dots. */
    getProgressDots() {
        return this.questions.map((_, i) => i < this.answers.length);
    }
}
//# sourceMappingURL=engine.js.map