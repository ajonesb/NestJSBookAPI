function heavyComputation() {
  let result = 0;
  for (let i = 0; i < 1000000000; i++) {
    result += i;
  }
  return result;
}

process.on('message', (msg) => {
  if (msg === 'start') {
    const result = heavyComputation();
    process.send(result);
  }
});
