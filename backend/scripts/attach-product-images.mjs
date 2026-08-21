/**
 * Download, process, and attach source-catalogue images to all products.
 *
 * Usage:
 *   cd backend && node scripts/attach-product-images.mjs
 *
 * What this does:
 * - Reads every product whose imageMediaId is null.
 * - Extracts the SOURCE IMAGE url from detailedDescription.
 * - Downloads the image using curl (handles redirects, timeouts).
 * - Converts to WebP via sharp and stores in CMS storage.
 * - Creates a Media record and links it to the product.
 * - Deduplicates: products sharing the same source image share the same Media record.
 */

import { PrismaClient } from '@prisma/client';
import { execFileSync } from 'node:child_process';
import { writeFileSync, readFileSync, existsSync, unlinkSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const __dirname = dirname(fileURLToPath(import.meta.url));
const BACKEND_DIR = resolve(__dirname, '..');
const STORAGE_DIR = resolve(BACKEND_DIR, 'storage');
const TMP_DIR = '/tmp';

const prisma = new PrismaClient();

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractImageUrl(detailedDescription) {
  if (!detailedDescription) return null;
  const match = detailedDescription.match(/^SOURCE IMAGE:\s*(.+)$/m);
  return match ? match[1].trim() : null;
}

function originalFileNameFromUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    return pathname.split('/').pop() ?? 'product-image.jpg';
  } catch {
    return 'product-image.jpg';
  }
}

function downloadWithCurl(url, destPath) {
  try {
    execFileSync('curl', [
      '--silent',
      '--location',
      '--max-time', '30',
      '--retry', '2',
      '--user-agent', 'Mozilla/5.0',
      '-o', destPath,
      url,
    ]);
    return existsSync(destPath);
  } catch {
    return false;
  }
}

async function processAndStore(imagePath, originalFileName) {
  const buf = readFileSync(imagePath);
  if (buf.length < 100) throw new Error(`File too small: ${buf.length} bytes`);

  const id = randomUUID();
  const storedFileName = `${id}.webp`;
  const webpBuf = await sharp(buf).webp({ quality: 85 }).toBuffer();
  writeFileSync(resolve(STORAGE_DIR, storedFileName), webpBuf);

  const media = await prisma.media.create({
    data: {
      originalFileName,
      storedFileName,
      storageKey: storedFileName,
      mimeType: 'image/webp',
      byteSize: webpBuf.length,
    },
  });
  return media;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Attach product images ===\n');

  const products = await prisma.product.findMany({
    select: { id: true, name: true, imageMediaId: true, detailedDescription: true },
    orderBy: { id: 'asc' },
  });

  const withoutImage = products.filter((p) => p.imageMediaId === null);
  console.log(`Products total:         ${products.length}`);
  console.log(`Already have image:     ${products.length - withoutImage.length}`);
  console.log(`Need image attachment:  ${withoutImage.length}\n`);

  // Cache downloaded+processed WebP buffers by source URL to avoid re-downloading
  // (imageMediaId has a unique constraint so each product needs its own Media row,
  //  but we can reuse the same WebP bytes)
  /** @type {Map<string, {buf: Buffer, originalFileName: string}>} */
  const urlToWebP = new Map();

  let attached = 0;
  let skipped = 0;
  let failed = 0;
  const failedNames = [];

  for (let i = 0; i < withoutImage.length; i++) {
    const product = withoutImage[i];
    const imageUrl = extractImageUrl(product.detailedDescription);

    if (!imageUrl) {
      console.log(`  [${i + 1}/${withoutImage.length}] SKIP (no URL): ${product.name}`);
      skipped++;
      continue;
    }

    process.stdout.write(`  [${i + 1}/${withoutImage.length}] ${product.name.substring(0, 55).padEnd(55)} `);

    const tmpPath = resolve(TMP_DIR, `product-img-${product.id}.tmp`);

    try {
      let webpBuf;
      let originalFileName;

      if (urlToWebP.has(imageUrl)) {
        // Reuse already-downloaded and converted bytes
        const cached = urlToWebP.get(imageUrl);
        webpBuf = cached.buf;
        originalFileName = cached.originalFileName;
      } else {
        const ok = downloadWithCurl(imageUrl, tmpPath);
        if (!ok) throw new Error('curl download failed');

        const rawBuf = readFileSync(tmpPath);
        if (rawBuf.length < 100) throw new Error(`File too small: ${rawBuf.length} bytes`);

        webpBuf = await sharp(rawBuf).webp({ quality: 85 }).toBuffer();
        originalFileName = originalFileNameFromUrl(imageUrl);
        urlToWebP.set(imageUrl, { buf: webpBuf, originalFileName });
      }

      // Always create a new Media row (unique constraint on imageMediaId)
      const id = randomUUID();
      const storedFileName = `${id}.webp`;
      writeFileSync(resolve(STORAGE_DIR, storedFileName), webpBuf);

      const media = await prisma.media.create({
        data: {
          originalFileName,
          storedFileName,
          storageKey: storedFileName,
          mimeType: 'image/webp',
          byteSize: webpBuf.length,
        },
      });

      await prisma.product.update({ where: { id: product.id }, data: { imageMediaId: media.id } });
      console.log(`→ media id=${media.id} (${media.byteSize} bytes)`);
      attached++;
    } catch (err) {
      console.log(`→ FAILED: ${err.message}`);
      failed++;
      failedNames.push(product.name);
    } finally {
      if (existsSync(tmpPath)) unlinkSync(tmpPath);
    }
  }

  console.log('\n══════════════════════════════════════════════');
  console.log('RESULT');
  console.log('══════════════════════════════════════════════');
  console.log(`Images attached:  ${attached}`);
  console.log(`Skipped (no URL): ${skipped}`);
  console.log(`Failed:           ${failed}`);
  if (failedNames.length > 0) {
    console.log('\nFailed products:');
    failedNames.forEach((n) => console.log('  -', n));
  }
  const finalWithImage = await prisma.product.count({ where: { imageMediaId: { not: null } } });
  console.log(`\nProducts with image now: ${finalWithImage} / ${products.length}`);
  console.log('══════════════════════════════════════════════\n');
}

main()
  .catch((err) => {
    console.error('Fatal:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
