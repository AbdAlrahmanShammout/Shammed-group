/**
 * One-off importer: upload downloaded content media and attach media IDs to CMS rows.
 * Run: node scripts/import-content-media.mjs
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:3000';
const MEDIA_DIR = resolve(__dirname, '../tmp/content-media');
const ENV_PATH = resolve(__dirname, '../.env');

function readAdminPassword() {
  const envText = readFileSync(ENV_PATH, 'utf8');
  const match = envText.match(/^ADMIN_PASSWORD=(.*)$/m);
  if (!match) {
    throw new Error('ADMIN_PASSWORD missing from backend/.env');
  }
  return match[1].trim();
}

async function login(password) {
  const response = await fetch(`${API_BASE}/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (!response.ok) {
    throw new Error(`Login failed: ${response.status} ${await response.text()}`);
  }
  const body = await response.json();
  return body.accessToken;
}

async function uploadMedia(token, absolutePath, mimeType, originalFileName) {
  if (!existsSync(absolutePath)) {
    throw new Error(`Missing file: ${absolutePath}`);
  }
  const bytes = readFileSync(absolutePath);
  const form = new FormData();
  form.append('file', new Blob([bytes], { type: mimeType }), originalFileName);
  const response = await fetch(`${API_BASE}/admin/media`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!response.ok) {
    throw new Error(`Upload failed for ${originalFileName}: ${response.status} ${await response.text()}`);
  }
  const body = await response.json();
  return body.media.id;
}

async function patchJson(token, path, body) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`PATCH ${path} failed: ${response.status} ${await response.text()}`);
  }
  return response.json();
}

async function getJson(token, path) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`GET ${path} failed: ${response.status} ${await response.text()}`);
  }
  return response.json();
}

async function main() {
  const token = await login(readAdminPassword());
  const uploads = {
    hero: await uploadMedia(token, resolve(MEDIA_DIR, 'hero.jpg'), 'image/jpeg', 'home-hero.jpg'),
    aboutPreview: await uploadMedia(
      token,
      resolve(MEDIA_DIR, 'about-preview.jpg'),
      'image/jpeg',
      'home-about-preview.jpg',
    ),
    why: await uploadMedia(token, resolve(MEDIA_DIR, 'why.jpg'), 'image/jpeg', 'home-why.jpg'),
    aboutOverview: await uploadMedia(
      token,
      resolve(MEDIA_DIR, 'about-overview.jpg'),
      'image/jpeg',
      'about-overview.jpg',
    ),
    servicePharma: await uploadMedia(
      token,
      resolve(MEDIA_DIR, 'service-pharma.jpg'),
      'image/jpeg',
      'service-pharma.jpg',
    ),
    serviceSupplies: await uploadMedia(
      token,
      resolve(MEDIA_DIR, 'service-supplies.jpg'),
      'image/jpeg',
      'service-supplies.jpg',
    ),
    partnerStorz: await uploadMedia(
      token,
      resolve(MEDIA_DIR, 'partner-storz.png'),
      'image/png',
      'partner-storz.png',
    ),
    partnerTechnix: await uploadMedia(
      token,
      resolve(MEDIA_DIR, 'partner-technix.webp'),
      'image/webp',
      'partner-technix.webp',
    ),
    partnerKarl: await uploadMedia(
      token,
      resolve(MEDIA_DIR, 'partner-karlstorz.png'),
      'image/png',
      'partner-karlstorz.png',
    ),
    partnerKls: await uploadMedia(
      token,
      resolve(MEDIA_DIR, 'partner-kls.png'),
      'image/png',
      'partner-kls.png',
    ),
    partnerDialife: await uploadMedia(
      token,
      resolve(MEDIA_DIR, 'partner-dialife.png'),
      'image/png',
      'partner-dialife.png',
    ),
  };
  // Shared stock images (same source URLs in the media sheet)
  uploads.serviceMedEquip = uploads.aboutOverview;
  uploads.serviceInstall = uploads.why;
  uploads.serviceTurnkey = uploads.aboutPreview;

  await patchJson(token, '/admin/home-page', {
    heroImageMediaId: uploads.hero,
    aboutPreviewImageMediaId: uploads.aboutPreview,
    whyImageMediaId: uploads.why,
  });
  await patchJson(token, '/admin/about-page', {
    overviewImageMediaId: uploads.aboutOverview,
  });

  const partners = await getJson(token, '/admin/partner?limit=100&offset=0');
  const partnerLogoByName = {
    'STORZ Medical AG': uploads.partnerStorz,
    Technix: uploads.partnerTechnix,
    'KARL STORZ': uploads.partnerKarl,
    'KLS Martin Group': uploads.partnerKls,
    'Dialife Group': uploads.partnerDialife,
  };
  for (const partner of partners.partners) {
    const logoMediaId = partnerLogoByName[partner.name];
    if (!logoMediaId) {
      continue;
    }
    await patchJson(token, `/admin/partner/${partner.id}`, { logoMediaId });
  }

  const services = await getJson(token, '/admin/service?limit=100&offset=0');
  const serviceImageByTitle = {
    'Medical Equipment Distribution': uploads.serviceMedEquip,
    'Installation, Maintenance, and After-Sales Support': uploads.serviceInstall,
    'Pharmaceutical Equipment and Distribution': uploads.servicePharma,
    'Turnkey Healthcare Projects': uploads.serviceTurnkey,
    'Operation Supplies and Medical Consumables': uploads.serviceSupplies,
  };
  for (const service of services.services) {
    const imageMediaId = serviceImageByTitle[service.title];
    if (!imageMediaId) {
      continue;
    }
    await patchJson(token, `/admin/service/${service.id}`, { imageMediaId });
  }

  console.log(JSON.stringify({ uploads, attached: true }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
