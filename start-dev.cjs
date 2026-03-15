const { execSync } = require('child_process');
const { spawn } = require('child_process');
process.chdir('C:/Users/brianallicat/realty-buyers-search');
const args = process.argv.slice(2);
const child = spawn(process.execPath, ['node_modules/vite/bin/vite.js', ...args], {
  cwd: 'C:/Users/brianallicat/realty-buyers-search',
  stdio: 'inherit',
  env: { ...process.env }
});
child.on('exit', (code) => process.exit(code));
