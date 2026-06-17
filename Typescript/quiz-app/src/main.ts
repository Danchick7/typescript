// ─────────────────────────────────────────────────────────
// main.ts
// Entry point: build the engine from the question bank, hand
// it to the UI, and let the UI take over from there.
// ─────────────────────────────────────────────────────────

const engine = new QuizEngine(QUESTIONS);
const ui = new QuizUI(engine);
