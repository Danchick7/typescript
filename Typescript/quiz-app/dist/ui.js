class QuizUI {
    constructor(engine) {
        this.timer = null;
        this.questionStartTime = 0;
        this.questionDurationMs = 15000;
        this.ringCircumference = 2 * Math.PI * 26;
        this.locked = false;
        this.startScreen = document.getElementById("start-screen");
        this.quizScreen = document.getElementById("quiz-screen");
        this.resultScreen = document.getElementById("result-screen");
        this.startButton = document.getElementById("start-button");
        this.retryButton = document.getElementById("retry-button");
        this.categoryLabel = document.getElementById("category-label");
        this.questionCounter = document.getElementById("question-counter");
        this.questionPrompt = document.getElementById("question-prompt");
        this.choicesContainer = document.getElementById("choices");
        this.progressDots = document.getElementById("progress-dots");
        this.timerRing = document.getElementById("timer-ring-progress");
        this.timerLabel = document.getElementById("timer-label");
        this.scoreStamp = document.getElementById("score-stamp");
        this.scoreMessage = document.getElementById("score-message");
        this.engine = engine;
        this.timerRing.style.strokeDasharray = String(this.ringCircumference);
        this.startButton.addEventListener("click", () => this.beginQuiz());
        this.retryButton.addEventListener("click", () => this.beginQuiz());
    }
    beginQuiz() {
        this.engine.start();
        this.startScreen.classList.add("hidden");
        this.resultScreen.classList.add("hidden");
        this.quizScreen.classList.remove("hidden");
        this.renderQuestion();
    }
    renderQuestion() {
        this.locked = false;
        const question = this.engine.current;
        this.categoryLabel.textContent = question.category;
        this.questionCounter.textContent = `Question ${this.engine.currentNumber} of ${this.engine.total}`;
        this.questionPrompt.textContent = question.prompt;
        this.renderProgressDots();
        this.renderChoices(question);
        this.startTimer();
    }
    renderProgressDots() {
        this.progressDots.innerHTML = "";
        const dots = this.engine.getProgressDots();
        dots.forEach((answered, i) => {
            const dot = document.createElement("span");
            dot.className = "dot";
            if (answered)
                dot.classList.add("answered");
            if (i === this.engine.currentNumber - 1)
                dot.classList.add("current");
            this.progressDots.appendChild(dot);
        });
    }
    renderChoices(question) {
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
            button.querySelector(".choice-text").textContent = choiceText;
            button.addEventListener("click", () => this.handleAnswer(index));
            this.choicesContainer.appendChild(button);
        });
    }
    startTimer() {
        this.questionStartTime = performance.now();
        this.timer = new Timer(this.questionDurationMs, (remaining, duration) => this.updateTimerDisplay(remaining, duration), () => this.handleAnswer(null));
        this.timer.start();
    }
    updateTimerDisplay(remainingMs, durationMs) {
        const fraction = remainingMs / durationMs;
        const offset = this.ringCircumference * (1 - fraction);
        this.timerRing.style.strokeDashoffset = String(offset);
        this.timerLabel.textContent = String(Math.ceil(remainingMs / 1000));
        this.timerRing.classList.toggle("urgent", remainingMs <= 5000);
    }
    handleAnswer(selectedIndex) {
        var _a;
        if (this.locked)
            return;
        this.locked = true;
        (_a = this.timer) === null || _a === void 0 ? void 0 : _a.stop();
        const timeTakenMs = performance.now() - this.questionStartTime;
        const record = this.engine.submitAnswer(selectedIndex, timeTakenMs);
        this.markChoices(record);
        window.setTimeout(() => this.goNext(), 900);
    }
    markChoices(record) {
        const question = this.engine.current;
        const buttons = Array.from(this.choicesContainer.querySelectorAll(".choice"));
        buttons.forEach((button, index) => {
            var _a;
            button.disabled = true;
            if (index === question.correctIndex) {
                button.classList.add("correct");
            }
            if (index === record.selectedIndex && !record.isCorrect) {
                button.classList.add("incorrect");
            }
            if (index === record.selectedIndex) {
                (_a = button.querySelector(".bubble")) === null || _a === void 0 ? void 0 : _a.classList.add("selected");
            }
        });
    }
    goNext() {
        const hasNext = this.engine.advance();
        if (hasNext) {
            this.renderQuestion();
        }
        else {
            this.showResults();
        }
    }
    showResults() {
        this.quizScreen.classList.add("hidden");
        this.resultScreen.classList.remove("hidden");
        const result = this.engine.getResult();
        this.scoreStamp.textContent = `${result.correct}/${result.total}`;
        this.scoreMessage.textContent = this.getMessage(result.correct, result.total);
    }
    getMessage(correct, total) {
        const pct = correct / total;
        if (pct >= 0.9)
            return "Excellent! A+ work.";
        if (pct >= 0.7)
            return "Nice work — solid grasp!";
        if (pct >= 0.5)
            return "Not bad. Review and try again?";
        return "Keep practicing — you've got this.";
    }
}