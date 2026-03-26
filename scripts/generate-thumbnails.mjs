import sharp from 'sharp';
import { readdirSync, statSync, existsSync, writeFileSync } from 'fs';
import { join, extname, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const postsDir = join(__dirname, '..', 'public', 'images', 'posts');

const THUMB_WIDTH = 600;
const THUMB_QUALITY = 80;
const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

function walk(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...walk(full));
    } else {
      const ext = extname(full).toLowerCase();
      const name = basename(full, ext);
      // Skip files that are already thumbnails
      if (!name.endsWith('-thumb') && SUPPORTED.has(ext)) {
        results.push(full);
      }
    }
  }
  return results;
}

async function generateThumb(filePath) {
  const ext = extname(filePath).toLowerCase();
  const name = basename(filePath, ext);
  const dir = dirname(filePath);
  const thumbPath = join(dir, `${name}-thumb.webp`);

  // Skip if thumb already exists and is newer than source
  if (existsSync(thumbPath)) {
    const srcMtime = statSync(filePath).mtimeMs;
    const thumbMtime = statSync(thumbPath).mtimeMs;
    if (thumbMtime >= srcMtime) {
      const kb = Math.round(statSync(thumbPath).size / 1024);
      console.log(`-- ${name}${ext} → already up-to-date (${kb}KB)`);
      return;
    }
  }

  const meta = await sharp(filePath, { failOnError: false }).metadata();
  const originalKB = Math.round(statSync(filePath).size / 1024);

  const buffer = await sharp(filePath, { failOnError: false })
    .resize({
      width: THUMB_WIDTH,
      withoutEnlargement: true,
    })
    .webp({ quality: THUMB_QUALITY })
    .toBuffer();

  writeFileSync(thumbPath, buffer);
  const thumbKB = Math.round(buffer.length / 1024);
  const saving = ((1 - buffer.length / statSync(filePath).size) * 100).toFixed(0);
  console.log(`OK ${name}${ext} (${meta.width ?? '?'}px) → ${name}-thumb.webp | ${originalKB}KB → ${thumbKB}KB (-${saving}%)`);
}

async function main() {
  const files = walk(postsDir);
  console.log(`Generating thumbnails for ${files.length} image(s)...\n`);

  let totalOrigKB = 0;
  let totalThumbKB = 0;

  for (const file of files) {
    try {
      const before = statSync(file).size;
      await generateThumb(file);
      const ext = extname(file).toLowerCase();
      const name = basename(file, ext);
      const thumbPath = join(dirname(file), `${name}-thumb.webp`);
      const after = existsSync(thumbPath) ? statSync(thumbPath).size : before;
      totalOrigKB += Math.round(before / 1024);
      totalThumbKB += Math.round(after / 1024);
    } catch (err) {
      console.warn(`⚠️  ${basename(file)} — skipped: ${err.message}`);
    }
  }

  console.log(`\n📊 Total originals: ${totalOrigKB}KB → thumbnails: ${totalThumbKB}KB (thumbnails are ${((1 - totalThumbKB / totalOrigKB) * 100).toFixed(0)}% smaller)`);
}

main().catch(console.error);
