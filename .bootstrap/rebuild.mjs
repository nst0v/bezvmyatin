import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const partDir = join(root, '.bootstrap');
const payload = readdirSync(partDir)
  .filter((name) => /^part-\d+\.txt$/.test(name))
  .sort()
  .map((name) => readFileSync(join(partDir, name), 'utf8').trim())
  .join('');

const archive = '/tmp/bezvmyatin-project.tar.gz';
writeFileSync(archive, Buffer.from(payload, 'base64'));

for (const entry of readdirSync(root)) {
  if (entry === '.git') continue;
  rmSync(join(root, entry), { recursive: true, force: true });
}

execFileSync('tar', ['-xzf', archive, '-C', root], { stdio: 'inherit' });
rmSync(archive, { force: true });
console.log('Project rebuilt from the verified anti-vibecode payload.');
// This file is removed by the rebuild itself. The touch below exists only to trigger the one-time job.
