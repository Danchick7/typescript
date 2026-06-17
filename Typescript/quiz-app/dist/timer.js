"use strict";
// ─────────────────────────────────────────────────────────
// timer.ts
// A small countdown timer. It doesn't know anything about
// quizzes — it just counts down and reports progress, which
// keeps it easy to reuse or unit test on its own.
// ─────────────────────────────────────────────────────────
class Timer {
    constructor(durationMs, onTick, onExpire) {
        this.durationMs = durationMs;
        this.onTick = onTick;
        this.onExpire = onExpire;
        this.intervalId = null;
        this.tickMs = 100;
        this.remainingMs = durationMs;
    }
    start() {
        this.stop();
        this.remainingMs = this.durationMs;
        this.onTick(this.remainingMs, this.durationMs);
        this.intervalId = window.setInterval(() => {
            this.remainingMs -= this.tickMs;
            if (this.remainingMs <= 0) {
                this.remainingMs = 0;
                this.onTick(this.remainingMs, this.durationMs);
                this.stop();
                this.onExpire();
                return;
            }
            this.onTick(this.remainingMs, this.durationMs);
        }, this.tickMs);
    }
    stop() {
        if (this.intervalId !== null) {
            window.clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    getElapsedMs() {
        return this.durationMs - this.remainingMs;
    }
}
//# sourceMappingURL=timer.js.map