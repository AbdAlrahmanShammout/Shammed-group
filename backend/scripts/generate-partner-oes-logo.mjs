/**
 * Generate OES partner logo with brand-navy background.
 *
 * Source SVG (white logo): downloaded from oes-inc.com
 * Output: tmp/content-media/partner-oes.webp
 *
 * Run before `pnpm restore` on a new server if partner-oes.webp is missing:
 *   node scripts/generate-partner-oes-logo.mjs
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const __dirname = dirname(fileURLToPath(import.meta.url));
const BACKEND_DIR = resolve(__dirname, '..');
const OUT_DIR = resolve(BACKEND_DIR, 'tmp/content-media');
const OUT_PATH = resolve(OUT_DIR, 'partner-oes.webp');

const LOGO_URL =
  'https://www.oes-inc.com/app/uploads/sites/4/2020/08/OES-Manufacturing-Logo-WHT-noWhiteSpace.svg';
const BRAND_NAVY = '#2C3470';
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 560;
const PADDING_X = 120;
const PADDING_Y = 80;

function downloadSvg() {
  const tmpPath = '/tmp/oes-logo-source.svg';
  execFileSync('curl', [
    '--silent',
    '--location',
    '--max-time',
    '30',
    '--retry',
    '2',
    '--user-agent',
    'Mozilla/5.0',
    '-o',
    tmpPath,
    LOGO_URL,
  ]);
  const bytes = readFileSync(tmpPath);
  if (bytes.length < 100) {
    throw new Error('Downloaded SVG is too small or empty');
  }
  return bytes;
}

async function main() {
  console.log('Generating OES partner logo with navy background…');
  const svg = downloadSvg();
  mkdirSync(OUT_DIR, { recursive: true });

  const logoMaxWidth = CANVAS_WIDTH - PADDING_X * 2;
  const logoMaxHeight = CANVAS_HEIGHT - PADDING_Y * 2;

  const logoBuffer = await sharp(svg)
    .resize(logoMaxWidth, logoMaxHeight, { fit: 'inside', withoutEnlargement: true })
    .png()
    .toBuffer();

  const { width: logoWidth = 0, height: logoHeight = 0 } = await sharp(logoBuffer).metadata();
  const left = Math.round((CANVAS_WIDTH - logoWidth) / 2);
  const top = Math.round((CANVAS_HEIGHT - logoHeight) / 2);

  const webp = await sharp({
    create: {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      channels: 3,
      background: BRAND_NAVY,
    },
  })
    .composite([{ input: logoBuffer, left, top }])
    .webp({ quality: 90 })
    .toBuffer();

  writeFileSync(OUT_PATH, webp);
  console.log(`Saved ${OUT_PATH} (${webp.length} bytes, ${CANVAS_WIDTH}x${CANVAS_HEIGHT})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
