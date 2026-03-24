import sharp from 'sharp';
import { readdirSync, statSync, writeFileSync, renameSync } from 'fs';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const imagesDir = join(__dirname, '..', 'public', 'images');

// Max dimensions — large enough for web use, reduced from raw sizes
const MAX_WIDTH = 1400;
const MAX_HEIGHT = 1050;
const JPEG_QUALITY = 82;
const PNG_QUALITY = 85;
const WEBP_QUALITY = 82;

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

async function processImage(filePath) {
  const sizeBefore = statSync(filePath).size;
  const ext = extname(filePath).toLowerCase();

  let img = sharp(filePath, { failOnError: false });
  const meta = await img.metadata();

  const needsResize = meta.width > MAX_WIDTH || meta.height > MAX_HEIGHT;

  if (needsResize) {
    img = img.resize({
      width: MAX_WIDTH,
      height: MAX_HEIGHT,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  // Re-encode in-place with quality settings
  if (ext === '.jpg' || ext === '.jpeg') {
    img = img.jpeg({ quality: JPEG_QUALITY });
  } else if (ext === '.png') {
    img = img.png({ quality: PNG_QUALITY, compressionLevel: 9 });
  } else if (ext === '.webp') {
    img = img.webp({ quality: WEBP_QUALITY });
  } else if (ext === '.avif') {
    img = img.avif({ quality: WEBP_QUALITY });
  }

  const buffer = await img.toBuffer();
  const sizeAfter = buffer.length;

  if (sizeAfter < sizeBefore) {
    // Write to a temp file first, then rename over original to avoid file-locking issues
    const tmpPath = filePath + '.tmp';
    writeFileSync(tmpPath, buffer);
    renameSync(tmpPath, filePath);
    const saved = ((1 - sizeAfter / sizeBefore) * 100).toFixed(1);
    console.log(`OK ${filePath.replace(imagesDir, '').replace(/\\/g, '/')} | ${Math.round(sizeBefore/1024)}KB -> ${Math.round(sizeAfter/1024)}KB (-${saved}%)`);
  } else {
    console.log(`-- ${filePath.replace(imagesDir, '').replace(/\\/g, '/')} | ${Math.round(sizeBefore/1024)}KB already optimal, skipped`);
  }
}

async function main() {
  const files = walk(imagesDir);
  console.log(`Found ${files.length} image(s) in ${imagesDir}\n`);
  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const before = statSync(file).size;
    try {
      await processImage(file);
    } catch (err) {
      console.warn(`⚠️  ${file.replace(imagesDir, '').replace(/\\/g, '/')} — skipped`);
      console.warn(`   Error: ${err.message}`);
      if (err.stack) console.warn(`   Stack: ${err.stack.split('\n').slice(0,3).join(' | ')}`);
      totalBefore += before;
      totalAfter += before;
      continue;
    }
    const after = statSync(file).size;
    totalBefore += before;
    totalAfter += after;
  }

  console.log(`\n📊 Total: ${Math.round(totalBefore/1024)}KB → ${Math.round(totalAfter/1024)}KB (saved ${Math.round((totalBefore - totalAfter)/1024)}KB, ${((1 - totalAfter/totalBefore)*100).toFixed(1)}%)`);
}

main().catch(console.error);
