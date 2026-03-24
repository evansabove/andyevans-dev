import { readdirSync, statSync, writeFileSync } from 'fs';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const imagesDir = join(__dirname, '..', 'public', 'images');

const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

function walk(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...walk(full));
    } else if (SUPPORTED.has(extname(full).toLowerCase())) {
      results.push(full);
    }
  }
  return results;
}

const files = walk(imagesDir);
let totalKB = 0;
const rows = files.map(f => {
  const kb = Math.round(statSync(f).size / 1024);
  totalKB += kb;
  return { file: f.replace(imagesDir + '\\', '').replace(/\\/g, '/'), kb };
}).sort((a, b) => b.kb - a.kb);

rows.forEach(r => console.log(`${r.kb}KB\t${r.file}`));
console.log(`\nTOTAL: ${totalKB}KB`);
