class Timer {
  private remainingMs: number;
  private intervalId: number | null = null;
  private readonly tickMs = 100;

  constructor(
    private readonly durationMs: number,
    private readonly onTick: (remainingMs: number, durationMs: number) => void,
    private readonly onExpire: () => void
  ) {
    this.remainingMs = durationMs;
  }

  start(): void {
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

  stop(): void {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getElapsedMs(): number {
    return this.durationMs - this.remainingMs;
  }
}
