function simulateHeavyComputation(duration: number): string {
  const start = Date.now();
  while (Date.now() - start < duration) {
    // Simulate CPU-intensive task
  }
  return `Heavy computation completed after ${duration}ms`;
}

process.on('message', (duration: number) => {
  const result = simulateHeavyComputation(duration);
  process.send(result);
});
