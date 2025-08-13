export async function withSpinner<T>(label: string, action: () => Promise<T>) {
  const frames = ['⠋','⠙','⠸','⠴','⠦','⠇'];
  let i = 0;
  const id = setInterval(() => {
    process.stdout.write(`\r${frames[i++ % frames.length]} ${label}   `);
  }, 80);
  try {
    const res = await action();
    process.stdout.write(`\r✓ ${label}\n`);
    return res;
  } catch (e) {
    process.stdout.write(`\r✗ ${label}\n`);
    throw e;
  } finally {
    clearInterval(id);
  }
}
