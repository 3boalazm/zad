import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const out = path.join(root, 'public');
const rootExtensions = new Set(['.html', '.js', '.css', '.png', '.svg', '.txt', '.xml']);
const rootFiles = (await readdir(root, { withFileTypes: true }))
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .filter((name) => rootExtensions.has(path.extname(name).toLowerCase()) || name === 'manifest.json');
const staticDirectories = ['.well-known', 'css', 'fonts', 'icons', 'js', 'tools'];

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
for (const name of rootFiles) {
  await cp(path.join(root, name), path.join(out, name));
}
for (const name of staticDirectories) {
  try {
    await cp(path.join(root, name), path.join(out, name), { recursive: true });
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}
console.log(`Prepared ${rootFiles.length} root assets and ${staticDirectories.length} asset folders in public/.`);
