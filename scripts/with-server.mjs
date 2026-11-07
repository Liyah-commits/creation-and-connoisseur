/**
 * Starts the static server, waits for it, runs a command, then stops the
 * server and exits with the command's exit code.
 * Usage: node scripts/with-server.mjs <command> [args...]
 */
import { spawn } from 'node:child_process';

const port = Number(process.env.PORT ?? 4321);
const [command, ...args] = process.argv.slice(2);
if (!command) {
  console.error('Usage: node scripts/with-server.mjs <command> [args...]');
  process.exit(2);
}

const server = spawn(process.execPath, ['scripts/serve-static.mjs', String(port)], { stdio: ['ignore', 'inherit', 'inherit'] });

async function waitForServer() {
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      const response = await fetch(`http://localhost:${port}/`);
      if (response.ok) return;
    } catch {}
    await new Promise((done) => setTimeout(done, 200));
  }
  throw new Error(`The static server did not start on port ${port}.`);
}

let code = 1;
try {
  await waitForServer();
  code = await new Promise((done) => {
    const child = spawn(command, args, { stdio: 'inherit', shell: process.platform === 'win32' });
    child.on('exit', (exitCode) => done(exitCode ?? 1));
  });
} catch (error) {
  console.error(error.message);
} finally {
  server.kill('SIGTERM');
}
process.exit(code);
