"use strict";
// ─────────────────────────────────────────────────────────
// types.ts
// Shared shapes used across the quiz app. Kept in its own
// file so the data model is easy to find and easy to grade.
// ─────────────────────────────────────────────────────────
/** Lifecycle states the quiz can be in. */
var QuizState;
(function (QuizState) {
    QuizState[QuizState["NotStarted"] = 0] = "NotStarted";
    QuizState[QuizState["InProgress"] = 1] = "InProgress";
    QuizState[QuizState["Finished"] = 2] = "Finished";
})(QuizState || (QuizState = {}));
//# sourceMappingURL=types.js.map