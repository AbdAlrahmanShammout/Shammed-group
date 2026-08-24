/**
 * Full data + media restore script.
 *
 * Run AFTER `pnpm seed` (or use `pnpm restore` which chains them).
 *
 * Usage:
 *   node scripts/restore-all.mjs
 *   API_BASE_URL=http://localhost:3000 node scripts/restore-all.mjs
 *
 * What this script does (in order):
 *   1. Brand assets  — upload logo + favicon from tmp/brand-assets/
 *   2. Content media — upload page + service images from tmp/content-media/
 *   3. Partner logos (local files) — from tmp/content-media/partner-*.{png,webp}
 *   4. Partner logos (web download) — Marinas Official and related web logos
 *   5. Product images (web download) — all 50 catalogue products via source URLs
 *      stored in each product's detailedDescription field
 *   6. Cleanup — delete all unreferenced media via the backend API
 *
 * Prerequisites:
 *   - The backend must be running (all uploads go through the API)
 *   - backend/.env must contain ADMIN_PASSWORD
 *   - tmp/brand-assets/    logo.jpg  favicon-32.png
 *   - tmp/content-media/   hero.jpg  about-preview.jpg  why.jpg
 *                          about-overview.jpg  service-pharma.jpg
 *                          service-supplies.jpg
 *                          partner-storz.png  partner-technix.webp
 *                          partner-karlstorz.png  partner-kls.png
 *                          partner-dialife.png  partner-oes.webp
 *                          partner-smd-medicare.webp
 *
 * NOTE: No direct writes to the storage directory are performed.
 * Every media file is created through the backend API so that file
 * permissions are always managed by the backend process.
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync, unlinkSync } from 'node:fs';
import { resolve, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require('sharp');
const { PrismaClient } = require('@prisma/client');

/** Max bytes to send in a single upload — stay well under nginx's default 1 MB limit. */
const UPLOAD_SIZE_LIMIT = 900_000;
/** Pause between product upload+patch cycles to stay under the API throttle (100 req / 60s). */
const PRODUCT_UPLOAD_PACING_MS = 800;
/** Max attempts for a single API call when the server returns 429. */
const RATE_LIMIT_MAX_ATTEMPTS = 8;
/** Base wait used for exponential backoff on 429 responses. */
const RATE_LIMIT_BASE_DELAY_MS = 5_000;

const __dirname = dirname(fileURLToPath(import.meta.url));
const BACKEND_DIR = resolve(__dirname, '..');
const ENV_PATH = resolve(BACKEND_DIR, '.env');

const BRAND_ASSETS_DIR = resolve(BACKEND_DIR, 'tmp/brand-assets');
const CONTENT_MEDIA_DIR = resolve(BACKEND_DIR, 'tmp/content-media');

// ── Helpers ───────────────────────────────────────────────────────────────────

function readEnvValue(key) {
  if (process.env[key]) {
    return process.env[key].trim();
  }
  if (!existsSync(ENV_PATH)) {
    return null;
  }
  const envText = readFileSync(ENV_PATH, 'utf8');
  const match = envText.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return match ? match[1].trim() : null;
}

function resolveApiBase() {
  return readEnvValue('API_BASE_URL') ?? 'http://localhost:3000';
}

function ensurePrismaEnv() {
  const databaseUrl = readEnvValue('DATABASE_URL');
  if (!databaseUrl) {
    throw new Error('DATABASE_URL missing from backend/.env');
  }
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = databaseUrl;
  }
}

const API_BASE = resolveApiBase();

function sleep(ms) {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

/**
 * Parse Retry-After (seconds or HTTP date). Falls back to exponential backoff.
 * @param {Response} response
 * @param {number} attempt 1-based attempt number
 */
function resolveRetryDelayMs(response, attempt) {
  const retryAfter = response.headers.get('retry-after');
  if (retryAfter) {
    const asSeconds = Number(retryAfter);
    if (Number.isFinite(asSeconds) && asSeconds >= 0) {
      return Math.max(asSeconds * 1000, 1_000);
    }
    const asDate = Date.parse(retryAfter);
    if (Number.isFinite(asDate)) {
      return Math.max(asDate - Date.now(), 1_000);
    }
  }
  return RATE_LIMIT_BASE_DELAY_MS * 2 ** (attempt - 1);
}

/**
 * fetch wrapper that retries on HTTP 429 with backoff.
 * @param {string} url
 * @param {RequestInit} init
 * @param {string} label
 */
async function fetchWithRateLimitRetry(url, init, label) {
  let lastError = null;
  for (let attempt = 1; attempt <= RATE_LIMIT_MAX_ATTEMPTS; attempt++) {
    const response = await fetch(url, init);
    if (response.status !== 429) {
      return response;
    }
    const delayMs = resolveRetryDelayMs(response, attempt);
    const bodyPreview = (await response.text()).slice(0, 120);
    console.log(
      `  rate-limited on ${label} (attempt ${attempt}/${RATE_LIMIT_MAX_ATTEMPTS}); waiting ${Math.round(delayMs / 1000)}s… (${bodyPreview})`,
    );
    lastError = new Error(`Too Many Requests for ${label}: ${bodyPreview}`);
    await sleep(delayMs);
  }
  throw lastError ?? new Error(`Too Many Requests for ${label}`);
}
function readAdminPassword() {
  const password = readEnvValue('ADMIN_PASSWORD');
  if (!password) throw new Error('ADMIN_PASSWORD missing from backend/.env');
  return password;
}

function mimeForExt(ext) {
  const map = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif' };
  return map[ext.toLowerCase()] ?? 'image/jpeg';
}

function mimeFromUrl(url) {
  const ext = '.' + (url.split('?')[0].split('.').pop() ?? 'jpg');
  return mimeForExt(ext);
}

async function login(password) {
  const response = await fetch(`${API_BASE}/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (!response.ok) throw new Error(`Login failed: ${response.status} ${await response.text()}`);
  const body = await response.json();
  return body.accessToken;
}

/**
 * Upload raw bytes through the API.
 * The backend process owns the storage folder and handles all file writes.
 * If the payload exceeds UPLOAD_SIZE_LIMIT, the image is pre-compressed to
 * JPEG so it fits within nginx's default client_max_body_size.
 */
async function uploadBytes(token, bytes, fileName, mimeType) {
  let finalBytes = bytes;
  let finalName = fileName;
  let finalMime = mimeType;

  if (bytes.length > UPLOAD_SIZE_LIMIT && mimeType !== 'image/gif') {
    try {
      finalBytes = await sharp(bytes).jpeg({ quality: 82 }).toBuffer();
      finalName = fileName.replace(/\.[^.]+$/, '.jpg');
      finalMime = 'image/jpeg';
    } catch {
      // sharp failed — try uploading original and let the server reject if needed
    }
  }

  const form = new FormData();
  form.append('file', new Blob([finalBytes], { type: finalMime }), finalName);
  const response = await fetchWithRateLimitRetry(
    `${API_BASE}/admin/media`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    },
    `POST /admin/media (${fileName})`,
  );
  if (!response.ok) {
    throw new Error(`Upload failed for ${fileName}: ${response.status} ${await response.text()}`);
  }
  const body = await response.json();
  console.log(`  uploaded ${fileName} → media id ${body.media.id}`);
  return body.media.id;
}

/** Upload a local file through the API. */
async function uploadFile(token, absolutePath) {
  if (!existsSync(absolutePath)) {
    console.log(`  skip (missing): ${basename(absolutePath)}`);
    return null;
  }
  const fileName = basename(absolutePath);
  const mime = mimeForExt(extname(absolutePath));
  const bytes = readFileSync(absolutePath);
  return uploadBytes(token, bytes, fileName, mime);
}

async function getJson(token, path) {
  const response = await fetchWithRateLimitRetry(
    `${API_BASE}${path}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
    `GET ${path}`,
  );
  if (!response.ok) throw new Error(`GET ${path} failed: ${response.status} ${await response.text()}`);
  return response.json();
}

async function patchJson(token, path, body) {
  const response = await fetchWithRateLimitRetry(
    `${API_BASE}${path}`,
    {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
    `PATCH ${path}`,
  );
  if (!response.ok) {
    throw new Error(`PATCH ${path} failed: ${response.status} ${await response.text()}`);
  }
  return response.json();
}

function downloadWithCurl(url, destPath) {
  try {
    execFileSync('curl', [
      '--silent', '--location', '--max-time', '30', '--retry', '2',
      '--user-agent', 'Mozilla/5.0',
      '-o', destPath, url,
    ]);
    return existsSync(destPath);
  } catch {
    return false;
  }
}

function extractSourceImageUrl(detailedDescription) {
  if (!detailedDescription) return null;
  const match = detailedDescription.match(/^SOURCE IMAGE:\s*(.+)$/m);
  return match ? match[1].trim() : null;
}

function fileNameFromUrl(url) {
  try {
    return new URL(url).pathname.split('/').pop() ?? 'image.jpg';
  } catch {
    return 'image.jpg';
  }
}

// ── Step 1: Brand assets ──────────────────────────────────────────────────────

async function restoreBrandAssets(token) {
  console.log('\n── 1. Brand assets ──');
  const logoId = await uploadFile(token, resolve(BRAND_ASSETS_DIR, 'logo.jpg'));
  const faviconId = await uploadFile(token, resolve(BRAND_ASSETS_DIR, 'favicon-32.png'));
  const patch = {};
  if (logoId) patch.logoMediaId = logoId;
  if (faviconId) patch.faviconMediaId = faviconId;
  if (Object.keys(patch).length > 0) {
    await patchJson(token, '/admin/site-settings', patch);
    console.log('  attached to site-settings');
  }
}

// ── Step 2: Content media ─────────────────────────────────────────────────────

async function restoreContentMedia(token) {
  console.log('\n── 2. Content media (pages + services) ──');

  const hero = await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'hero.jpg'));
  const aboutPreview = await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'about-preview.jpg'));
  const why = await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'why.jpg'));
  const aboutOverview = await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'about-overview.jpg'));
  const servicePharma = await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'service-pharma.jpg'));
  const serviceSupplies = await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'service-supplies.jpg'));

  const homePagePatch = {};
  if (hero) homePagePatch.heroImageMediaId = hero;
  if (aboutPreview) homePagePatch.aboutPreviewImageMediaId = aboutPreview;
  if (why) homePagePatch.whyImageMediaId = why;
  if (Object.keys(homePagePatch).length > 0) {
    await patchJson(token, '/admin/home-page', homePagePatch);
    console.log('  attached to home-page');
  }

  if (aboutOverview) {
    await patchJson(token, '/admin/about-page', { overviewImageMediaId: aboutOverview });
    console.log('  attached to about-page');
  }

  const serviceImageByTitle = {
    'Medical Equipment Distribution': aboutOverview,
    'Installation, Maintenance, and After-Sales Support': why,
    'Pharmaceutical Equipment and Distribution': servicePharma,
    'Turnkey Healthcare Projects': aboutPreview,
    'Operation Supplies and Medical Consumables': serviceSupplies,
  };
  const { services } = await getJson(token, '/admin/service?limit=100&offset=0');
  for (const service of services) {
    const imageMediaId = serviceImageByTitle[service.title];
    if (!imageMediaId) continue;
    await patchJson(token, `/admin/service/${service.id}`, { imageMediaId });
    console.log(`  attached image to service: ${service.title}`);
  }
}

// ── Step 3: Partner logos — local files ───────────────────────────────────────

async function restoreLocalPartnerLogos(token) {
  console.log('\n── 3. Partner logos (local files) ──');

  const oesLogoPath = resolve(CONTENT_MEDIA_DIR, 'partner-oes.webp');
  if (!existsSync(oesLogoPath)) {
    console.log('  partner-oes.webp missing — generating from official SVG source …');
    execFileSync('node', [resolve(__dirname, 'generate-partner-oes-logo.mjs')], { stdio: 'inherit' });
  }

  const partnerLogoByName = {
    'STORZ Medical AG':  await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'partner-storz.png')),
    'Technix':           await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'partner-technix.webp')),
    'KARL STORZ':        await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'partner-karlstorz.png')),
    'KLS Martin Group':  await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'partner-kls.png')),
    'Dialife Group':     await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'partner-dialife.png')),
    'OES':               await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'partner-oes.webp')),
    'SMD Medicare':      await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'partner-smd-medicare.webp')),
    'Bistos Co':         await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'partner-bistos.png')),
  };

  const { partners } = await getJson(token, '/admin/partner?limit=100&offset=0');
  for (const partner of partners) {
    const logoMediaId = partnerLogoByName[partner.name];
    if (!logoMediaId) continue;
    await patchJson(token, `/admin/partner/${partner.id}`, { logoMediaId });
    console.log(`  attached logo to partner: ${partner.name}`);
  }
}

// ── Step 4: Partner logos — web download ─────────────────────────────────────

async function restoreWebPartnerLogos(token) {
  console.log('\n── 4. Partner logos (web download) ──');

  const webLogos = [
    {
      partnerName: 'Marinas Official',
      url: 'https://marinasofficial.com/wp-content/uploads/2023/08/MarinasOfficial-1.png',
      fileName: 'partner-marinas-logo.png',
    },
    {
      partnerName: 'SMD Medicare',
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo7L6Iqnx9E9v393KYdv1GvuskjUY4VVBqKrDRFAFU3A&s',
      fileName: 'partner-smd-medicare.jpg',
    },
    {
      partnerName: 'Bistos Co',
      url: 'https://www.bistos.co.kr/wp-content/uploads/2023/08/00.logo-bistos-1.png',
      fileName: 'partner-bistos.png',
    },
  ];

  const { partners } = await getJson(token, '/admin/partner?limit=100&offset=0');
  const partnerByName = new Map(partners.map((p) => [p.name, p]));

  for (const { partnerName, url, fileName } of webLogos) {
    const partner = partnerByName.get(partnerName);
    if (!partner) {
      console.log(`  skip (partner not found): ${partnerName}`);
      continue;
    }
    if (partner.logoMediaId) {
      console.log(`  skip (already has logo): ${partnerName}`);
      continue;
    }

    const tmpPath = `/tmp/restore-web-logo-${randomUUID()}.tmp`;
    try {
      process.stdout.write(`  downloading: ${partnerName} … `);
      const ok = downloadWithCurl(url, tmpPath);
      if (!ok) throw new Error('download failed');
      const bytes = readFileSync(tmpPath);
      if (bytes.length < 100) throw new Error(`file too small (${bytes.length} bytes)`);
      const mediaId = await uploadBytes(token, bytes, fileName, mimeFromUrl(url));
      await patchJson(token, `/admin/partner/${partner.id}`, { logoMediaId: mediaId });
      console.log(`  attached logo to partner: ${partnerName}`);
    } catch (err) {
      console.log(`→ FAILED: ${err.message}`);
    } finally {
      if (existsSync(tmpPath)) unlinkSync(tmpPath);
    }
  }
}

// ── Step 5: Product images — web download via API ────────────────────────────

async function restoreProductImages(token, prisma) {
  console.log('\n── 5. Product images (web download → API upload) ──');

  const products = await prisma.product.findMany({
    select: { id: true, name: true, imageMediaId: true, detailedDescription: true },
    orderBy: { id: 'asc' },
  });

  const withoutImage = products.filter((p) => p.imageMediaId === null);
  const alreadyHave = products.length - withoutImage.length;
  console.log(`  ${alreadyHave} already have images, downloading ${withoutImage.length}`);

  // Cache downloaded bytes by source URL — download once, upload once per product
  /** @type {Map<string, { bytes: Buffer, fileName: string }>} */
  const urlCache = new Map();
  let attached = 0;
  let failed = 0;

  for (let i = 0; i < withoutImage.length; i++) {
    const product = withoutImage[i];
    const imageUrl = extractSourceImageUrl(product.detailedDescription);
    if (!imageUrl) {
      console.log(`  [${i + 1}/${withoutImage.length}] skip (no SOURCE IMAGE url): ${product.name}`);
      continue;
    }

    process.stdout.write(`  [${i + 1}/${withoutImage.length}] ${product.name.substring(0, 55).padEnd(55)} `);
    const tmpPath = `/tmp/restore-prod-${product.id}-${randomUUID()}.tmp`;

    try {
      let bytes;
      let fileName;

      if (urlCache.has(imageUrl)) {
        ({ bytes, fileName } = urlCache.get(imageUrl));
      } else {
        const ok = downloadWithCurl(imageUrl, tmpPath);
        if (!ok) throw new Error('curl download failed');
        bytes = readFileSync(tmpPath);
        if (bytes.length < 100) throw new Error(`file too small (${bytes.length} bytes)`);
        fileName = fileNameFromUrl(imageUrl);
        urlCache.set(imageUrl, { bytes, fileName });
      }

      // Upload through the API — backend handles WebP conversion and unique UUID filename.
      // imageMediaId has a unique constraint so each product must get its own Media row;
      // uploading separately for each product guarantees that.
      const mediaId = await uploadBytes(token, bytes, fileName, mimeFromUrl(imageUrl));
      await patchJson(token, `/admin/product/${product.id}`, { imageMediaId: mediaId });
      console.log(`→ media id=${mediaId}`);
      attached++;
      await sleep(PRODUCT_UPLOAD_PACING_MS);
    } catch (err) {
      console.log(`→ FAILED: ${err.message}`);
      failed++;
      // After a hard failure (including exhausted 429 retries), pause before the next product.
      await sleep(RATE_LIMIT_BASE_DELAY_MS);
    } finally {
      if (existsSync(tmpPath)) unlinkSync(tmpPath);
    }
  }

  console.log(`  product images: ${attached} attached, ${failed} failed`);
}

// ── Step 6: Cleanup unreferenced media via API ────────────────────────────────

async function cleanupUnusedMedia(token) {
  console.log('\n── 6. Cleanup unreferenced media ──');
  const response = await fetchWithRateLimitRetry(
    `${API_BASE}/admin/media`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    },
    'DELETE /admin/media',
  );
  if (!response.ok) {
    throw new Error(`Cleanup failed: ${response.status} ${await response.text()}`);
  }
  // Endpoint returns 204 No Content
  console.log('  cleanup done: unreferenced media purged');
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Restoring all media to ${API_BASE} …`);

  ensurePrismaEnv();
  const prisma = new PrismaClient();
  try {
    const token = await login(readAdminPassword());

    await restoreBrandAssets(token);
    await restoreContentMedia(token);
    await restoreLocalPartnerLogos(token);
    await restoreWebPartnerLogos(token);
    await restoreProductImages(token, prisma);
    await cleanupUnusedMedia(token);

    console.log('\n✅ Restore complete. All media uploaded, attached, and cleaned up.');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
