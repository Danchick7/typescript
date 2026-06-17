var QuizState;
(function (QuizState) {
    QuizState[QuizState["NotStarted"] = 0] = "NotStarted";
    QuizState[QuizState["InProgress"] = 1] = "InProgress";
    QuizState[QuizState["Finished"] = 2] = "Finished";
})(QuizState || (QuizState = {}));