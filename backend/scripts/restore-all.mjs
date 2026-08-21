/**
 * Full data + media restore script.
 *
 * Run AFTER `pnpm seed` (or use `pnpm restore` which chains them).
 *
 * Usage:
 *   node scripts/restore-all.mjs
 *   API_BASE_URL=https://your-server.com node scripts/restore-all.mjs
 *
 * What this script does (in order):
 *   1. Brand assets  — upload logo + favicon from tmp/brand-assets/
 *   2. Content media — upload page images + service images from tmp/content-media/
 *   3. Partner logos (local files) — from tmp/content-media/partner-*.{png,webp}
 *   4. Partner logos (web download) — Al Inmaa and Marinas Official
 *   5. Product images (web download) — all 94 catalogue products via source URLs
 *      stored in each product's detailedDescription field
 *   6. Cleanup — delete media records not referenced by any entity, plus their
 *      storage files
 *
 * Prerequisites:
 *   - backend/.env must contain ADMIN_PASSWORD
 *   - tmp/brand-assets/    logo.jpg  favicon-32.png
 *   - tmp/content-media/   hero.jpg  about-preview.jpg  why.jpg
 *                          about-overview.jpg  service-pharma.jpg
 *                          service-supplies.jpg
 *                          partner-storz.png  partner-technix.webp
 *                          partner-karlstorz.png  partner-kls.png
 *                          partner-dialife.png
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'node:fs';
import { resolve, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require('sharp');
const { PrismaClient } = require('@prisma/client');

const __dirname = dirname(fileURLToPath(import.meta.url));
const BACKEND_DIR = resolve(__dirname, '..');
const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:3000';
const ENV_PATH = resolve(BACKEND_DIR, '.env');
const STORAGE_DIR = resolve(BACKEND_DIR, 'storage');

const BRAND_ASSETS_DIR = resolve(BACKEND_DIR, 'tmp/brand-assets');
const CONTENT_MEDIA_DIR = resolve(BACKEND_DIR, 'tmp/content-media');

// ── Helpers ───────────────────────────────────────────────────────────────────

function readAdminPassword() {
  const envText = readFileSync(ENV_PATH, 'utf8');
  const match = envText.match(/^ADMIN_PASSWORD=(.*)$/m);
  if (!match) throw new Error('ADMIN_PASSWORD missing from backend/.env');
  return match[1].trim();
}

function mimeForFile(filePath) {
  const ext = extname(filePath).toLowerCase();
  const map = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
  };
  const mime = map[ext];
  if (!mime) throw new Error(`Unknown mime for extension: ${filePath}`);
  return mime;
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

async function uploadFile(token, absolutePath) {
  if (!existsSync(absolutePath)) {
    console.log(`  skip (missing): ${basename(absolutePath)}`);
    return null;
  }
  const fileName = basename(absolutePath);
  const mime = mimeForFile(absolutePath);
  const bytes = readFileSync(absolutePath);
  const form = new FormData();
  form.append('file', new Blob([bytes], { type: mime }), fileName);
  const response = await fetch(`${API_BASE}/admin/media`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!response.ok) {
    throw new Error(`Upload failed for ${fileName}: ${response.status} ${await response.text()}`);
  }
  const body = await response.json();
  console.log(`  uploaded ${fileName} → media id ${body.media.id}`);
  return body.media.id;
}

async function getJson(token, path) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`GET ${path} failed: ${response.status} ${await response.text()}`);
  return response.json();
}

async function patchJson(token, path, body) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
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

async function convertToWebPAndStore(prisma, sourcePath, originalFileName) {
  const buf = readFileSync(sourcePath);
  if (buf.length < 100) throw new Error(`Downloaded file too small: ${buf.length} bytes`);
  const id = randomUUID();
  const storedFileName = `${id}.webp`;
  const webpBuf = await sharp(buf).webp({ quality: 85 }).toBuffer();
  writeFileSync(resolve(STORAGE_DIR, storedFileName), webpBuf);
  return prisma.media.create({
    data: {
      originalFileName,
      storedFileName,
      storageKey: storedFileName,
      mimeType: 'image/webp',
      byteSize: webpBuf.length,
    },
  });
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

// ── Step 1 & 2: Brand assets + content media (local files via API) ─────────────

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

async function restoreContentMedia(token) {
  console.log('\n── 2. Content media (pages + services) ──');

  const hero = await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'hero.jpg'));
  const aboutPreview = await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'about-preview.jpg'));
  const why = await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'why.jpg'));
  const aboutOverview = await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'about-overview.jpg'));
  const servicePharma = await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'service-pharma.jpg'));
  const serviceSupplies = await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'service-supplies.jpg'));

  // Home page
  const homePagePatch = {};
  if (hero) homePagePatch.heroImageMediaId = hero;
  if (aboutPreview) homePagePatch.aboutPreviewImageMediaId = aboutPreview;
  if (why) homePagePatch.whyImageMediaId = why;
  if (Object.keys(homePagePatch).length > 0) {
    await patchJson(token, '/admin/home-page', homePagePatch);
    console.log('  attached to home-page');
  }

  // About page
  if (aboutOverview) {
    await patchJson(token, '/admin/about-page', { overviewImageMediaId: aboutOverview });
    console.log('  attached to about-page');
  }

  // Services (reuse available images for missing ones)
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

// ── Step 3: Partner logos from local files ────────────────────────────────────

async function restoreLocalPartnerLogos(token) {
  console.log('\n── 3. Partner logos (local files) ──');
  const partnerStorz = await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'partner-storz.png'));
  const partnerTechnix = await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'partner-technix.webp'));
  const partnerKarl = await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'partner-karlstorz.png'));
  const partnerKls = await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'partner-kls.png'));
  const partnerDialife = await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'partner-dialife.png'));

  const partnerLogoByName = {
    'STORZ Medical AG': partnerStorz,
    'Technix': partnerTechnix,
    'KARL STORZ': partnerKarl,
    'KLS Martin Group': partnerKls,
    'Dialife Group': partnerDialife,
  };

  const { partners } = await getJson(token, '/admin/partner?limit=100&offset=0');
  for (const partner of partners) {
    const logoMediaId = partnerLogoByName[partner.name];
    if (!logoMediaId) continue;
    await patchJson(token, `/admin/partner/${partner.id}`, { logoMediaId });
    console.log(`  attached logo to partner: ${partner.name}`);
  }
}

// ── Step 4: Partner logos from web (Al Inmaa + Marinas) ──────────────────────

async function restoreWebPartnerLogos(prisma) {
  console.log('\n── 4. Partner logos (web download) ──');

  const webLogos = [
    {
      partnerName: 'Al Inmaa Drug Store & Medical Equipment LLC',
      url: 'https://inmaa.ae/wp-content/uploads/2026/03/header-logo.png',
      fileName: 'partner-al-inmaa-logo.png',
    },
    {
      partnerName: 'Marinas Official',
      url: 'https://marinasofficial.com/wp-content/uploads/2023/08/MarinasOfficial-1.png',
      fileName: 'partner-marinas-logo.png',
    },
  ];

  for (const { partnerName, url, fileName } of webLogos) {
    const partner = await prisma.partner.findFirst({ where: { name: partnerName } });
    if (!partner) {
      console.log(`  skip (partner not found): ${partnerName}`);
      continue;
    }
    if (partner.logoMediaId) {
      console.log(`  skip (already has logo): ${partnerName}`);
      continue;
    }

    const tmpPath = `/tmp/restore-partner-logo-${randomUUID()}.tmp`;
    try {
      process.stdout.write(`  downloading: ${partnerName} … `);
      const ok = downloadWithCurl(url, tmpPath);
      if (!ok) throw new Error('download failed');

      const media = await convertToWebPAndStore(prisma, tmpPath, fileName);
      await prisma.partner.update({ where: { id: partner.id }, data: { logoMediaId: media.id } });
      console.log(`→ media id=${media.id} (${media.byteSize} bytes)`);
    } catch (err) {
      console.log(`→ FAILED: ${err.message}`);
    } finally {
      if (existsSync(tmpPath)) unlinkSync(tmpPath);
    }
  }
}

// ── Step 5: Product images from source URLs ──────────────────────────────────

async function restoreProductImages(prisma) {
  console.log('\n── 5. Product images (web download) ──');

  const products = await prisma.product.findMany({
    select: { id: true, name: true, imageMediaId: true, detailedDescription: true },
    orderBy: { id: 'asc' },
  });

  const withoutImage = products.filter((p) => p.imageMediaId === null);
  console.log(`  ${products.length - withoutImage.length} already have images, downloading ${withoutImage.length}`);

  // Cache converted WebP bytes by source URL to avoid re-downloading the same image
  /** @type {Map<string, Buffer>} */
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
    const tmpPath = `/tmp/restore-product-${product.id}.tmp`;

    try {
      let webpBuf;
      if (urlCache.has(imageUrl)) {
        webpBuf = urlCache.get(imageUrl);
      } else {
        const ok = downloadWithCurl(imageUrl, tmpPath);
        if (!ok) throw new Error('curl download failed');
        const raw = readFileSync(tmpPath);
        if (raw.length < 100) throw new Error(`file too small (${raw.length} bytes)`);
        webpBuf = await sharp(raw).webp({ quality: 85 }).toBuffer();
        urlCache.set(imageUrl, webpBuf);
      }

      // imageMediaId is unique — each product needs its own Media row
      const id = randomUUID();
      const storedFileName = `${id}.webp`;
      writeFileSync(resolve(STORAGE_DIR, storedFileName), webpBuf);

      const media = await prisma.media.create({
        data: {
          originalFileName: fileNameFromUrl(imageUrl),
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
    } finally {
      if (existsSync(tmpPath)) unlinkSync(tmpPath);
    }
  }

  console.log(`  product images: ${attached} attached, ${failed} failed`);
}

// ── Step 6: Delete unreferenced media ────────────────────────────────────────

async function cleanupUnusedMedia(prisma) {
  console.log('\n── 6. Cleanup unreferenced media ──');

  const unreferenced = await prisma.$queryRaw`
    SELECT m.id, m."storedFileName", m."originalFileName", m."byteSize"
    FROM "Media" m
    WHERE m.id NOT IN (
      SELECT COALESCE("logoMediaId",0)    FROM "SiteSettings" WHERE "logoMediaId" IS NOT NULL
      UNION SELECT COALESCE("faviconMediaId",0) FROM "SiteSettings" WHERE "faviconMediaId" IS NOT NULL
      UNION SELECT COALESCE("placeholderMediaId",0) FROM "SiteSettings" WHERE "placeholderMediaId" IS NOT NULL
      UNION SELECT COALESCE("heroImageMediaId",0) FROM "HomePage" WHERE "heroImageMediaId" IS NOT NULL
      UNION SELECT COALESCE("aboutPreviewImageMediaId",0) FROM "HomePage" WHERE "aboutPreviewImageMediaId" IS NOT NULL
      UNION SELECT COALESCE("whyImageMediaId",0) FROM "HomePage" WHERE "whyImageMediaId" IS NOT NULL
      UNION SELECT COALESCE("overviewImageMediaId",0) FROM "AboutPage" WHERE "overviewImageMediaId" IS NOT NULL
      UNION SELECT COALESCE("logoMediaId",0) FROM "Partner" WHERE "logoMediaId" IS NOT NULL
      UNION SELECT COALESCE("imageMediaId",0) FROM "Service" WHERE "imageMediaId" IS NOT NULL
      UNION SELECT COALESCE("imageMediaId",0) FROM "Product" WHERE "imageMediaId" IS NOT NULL
    )
  `;

  if (unreferenced.length === 0) {
    console.log('  no unreferenced media found');
    return;
  }

  console.log(`  found ${unreferenced.length} unreferenced media record(s)`);
  let deleted = 0;

  for (const row of unreferenced) {
    const filePath = resolve(STORAGE_DIR, row.storedFileName);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
    await prisma.media.delete({ where: { id: Number(row.id) } });
    console.log(`  deleted media id=${row.id} ${row.originalFileName} (${row.byteSize} bytes)`);
    deleted++;
  }

  console.log(`  cleanup done: ${deleted} record(s) removed`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Restoring all media to ${API_BASE} …`);

  const prisma = new PrismaClient();
  try {
    const token = await login(readAdminPassword());

    await restoreBrandAssets(token);
    await restoreContentMedia(token);
    await restoreLocalPartnerLogos(token);
    await restoreWebPartnerLogos(prisma);
    await restoreProductImages(prisma);
    await cleanupUnusedMedia(prisma);

    console.log('\n✅ Restore complete. All media uploaded, attached, and cleaned up.');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
