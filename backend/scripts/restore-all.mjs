/**
 * Full data + media restore script.
 *
 * Uploads every local media file from tmp/ and attaches media IDs to the
 * correct CMS entities.  Run AFTER `pnpm seed` (or as part of `pnpm restore`
 * which chains the two).
 *
 * Usage:
 *   node scripts/restore-all.mjs
 *   API_BASE_URL=https://your-server.com node scripts/restore-all.mjs
 *
 * Prerequisites:
 *   - backend/.env must contain ADMIN_PASSWORD
 *   - tmp/brand-assets/      logo.jpg  favicon-32.png
 *   - tmp/content-media/     hero.jpg  about-preview.jpg  why.jpg
 *                            about-overview.jpg  service-pharma.jpg
 *                            service-supplies.jpg
 *                            partner-storz.png  partner-technix.webp
 *                            partner-karlstorz.png  partner-kls.png
 *                            partner-dialife.png
 *   - tmp/demo-product-images/  <slug-of-product-name>.<ext>  (one per product)
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BACKEND_DIR = resolve(__dirname, '..');
const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:3000';
const ENV_PATH = resolve(BACKEND_DIR, '.env');

const BRAND_ASSETS_DIR = resolve(BACKEND_DIR, 'tmp/brand-assets');
const CONTENT_MEDIA_DIR = resolve(BACKEND_DIR, 'tmp/content-media');
const PRODUCT_IMAGES_DIR = resolve(BACKEND_DIR, 'tmp/demo-product-images');

// ── helpers ──────────────────────────────────────────────────────────────────

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
    '.svg': 'image/svg+xml',
  };
  const mime = map[ext];
  if (!mime) throw new Error(`Unknown extension for mime: ${filePath}`);
  return mime;
}

function toSlug(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
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
    console.warn(`  skip (missing): ${absolutePath}`);
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

// ── steps ────────────────────────────────────────────────────────────────────

async function restoreBrandAssets(token) {
  console.log('\n── Brand assets (logo, favicon) ──');
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
  console.log('\n── Content media (pages + partners + services) ──');
  const hero = await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'hero.jpg'));
  const aboutPreview = await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'about-preview.jpg'));
  const why = await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'why.jpg'));
  const aboutOverview = await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'about-overview.jpg'));
  const servicePharma = await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'service-pharma.jpg'));
  const serviceSupplies = await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'service-supplies.jpg'));
  const partnerStorz = await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'partner-storz.png'));
  const partnerTechnix = await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'partner-technix.webp'));
  const partnerKarl = await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'partner-karlstorz.png'));
  const partnerKls = await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'partner-kls.png'));
  const partnerDialife = await uploadFile(token, resolve(CONTENT_MEDIA_DIR, 'partner-dialife.png'));

  // Shared images (same file reused for multiple places)
  const serviceMedEquip = aboutOverview;
  const serviceInstall = why;
  const serviceTurnkey = aboutPreview;

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

  // Partners
  const partnerLogoByName = {
    'STORZ Medical AG': partnerStorz,
    Technix: partnerTechnix,
    'KARL STORZ': partnerKarl,
    'KLS Martin Group': partnerKls,
    'Dialife Group': partnerDialife,
  };
  const partners = await getJson(token, '/admin/partner?limit=100&offset=0');
  for (const partner of partners.partners) {
    const logoMediaId = partnerLogoByName[partner.name];
    if (!logoMediaId) continue;
    await patchJson(token, `/admin/partner/${partner.id}`, { logoMediaId });
    console.log(`  attached logo to partner: ${partner.name}`);
  }

  // Services
  const serviceImageByTitle = {
    'Medical Equipment Distribution': serviceMedEquip,
    'Installation, Maintenance, and After-Sales Support': serviceInstall,
    'Pharmaceutical Equipment and Distribution': servicePharma,
    'Turnkey Healthcare Projects': serviceTurnkey,
    'Operation Supplies and Medical Consumables': serviceSupplies,
  };
  const services = await getJson(token, '/admin/service?limit=100&offset=0');
  for (const service of services.services) {
    const imageMediaId = serviceImageByTitle[service.title];
    if (!imageMediaId) continue;
    await patchJson(token, `/admin/service/${service.id}`, { imageMediaId });
    console.log(`  attached image to service: ${service.title}`);
  }
}

async function restoreProductImages(token) {
  console.log('\n── Product images ──');
  if (!existsSync(PRODUCT_IMAGES_DIR)) {
    console.log('  skip (tmp/demo-product-images/ not found)');
    return;
  }
  const imageFiles = readdirSync(PRODUCT_IMAGES_DIR).filter((name) =>
    ['.png', '.jpg', '.jpeg', '.webp'].includes(extname(name).toLowerCase()),
  );
  if (imageFiles.length === 0) {
    console.log('  skip (no image files found)');
    return;
  }
  const imageBySlug = new Map(
    imageFiles.map((fileName) => [basename(fileName, extname(fileName)), fileName]),
  );
  const { products } = await getJson(token, '/admin/product?limit=100');
  let attachedCount = 0;
  for (const product of products) {
    const slug = toSlug(product.name);
    const fileName = imageBySlug.get(slug);
    if (!fileName) {
      console.log(`  skip (no image): ${product.name} → ${slug}`);
      continue;
    }
    const mediaId = await uploadFile(token, resolve(PRODUCT_IMAGES_DIR, fileName));
    if (!mediaId) continue;
    await patchJson(token, `/admin/product/${product.id}`, { imageMediaId: mediaId });
    attachedCount += 1;
    console.log(`  attached image to product: ${product.name}`);
  }
  console.log(`  total: ${attachedCount} product image(s) attached`);
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Restoring media to ${API_BASE} …`);
  const token = await login(readAdminPassword());
  await restoreBrandAssets(token);
  await restoreContentMedia(token);
  await restoreProductImages(token);
  console.log('\nDone. All media uploaded and attached.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
