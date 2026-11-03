import { cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(projectRoot, 'dist');
const siteFiles = ['index.html', 'style.css', 'app.js', 'data.js', 'favicon.svg'];

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

for (const file of siteFiles) {
  await cp(path.join(projectRoot, file), path.join(outputDir, file));
}
await cp(path.join(projectRoot, 'assets'), path.join(outputDir, 'assets'), { recursive: true });

console.log(`Cloudflare Pages build ready: ${outputDir}`);
