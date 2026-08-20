/**
 * Cleanup script: find and delete all media records that are not referenced
 * by any CMS entity (orphaned uploads).
 *
 * Usage:
 *   node scripts/cleanup-unused-media.mjs
 *   API_BASE_URL=https://your-server.com node scripts/cleanup-unused-media.mjs
 *
 * Pass --dry-run to only list orphaned media without deleting.
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BACKEND_DIR = resolve(__dirname, '..');
const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:3000';
const ENV_PATH = resolve(BACKEND_DIR, '.env');
const isDryRun = process.argv.includes('--dry-run');

function readAdminPassword() {
  const envText = readFileSync(ENV_PATH, 'utf8');
  const match = envText.match(/^ADMIN_PASSWORD=(.*)$/m);
  if (!match) throw new Error('ADMIN_PASSWORD missing from backend/.env');
  return match[1].trim();
}

async function login(password) {
  const response = await fetch(`${API_BASE}/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (!response.ok) throw new Error(`Login failed: ${response.status} ${await response.text()}`);
  return (await response.json()).accessToken;
}

/** Collect all media IDs that are currently in use by any CMS entity. */
async function collectReferencedMediaIds(token) {
  const headers = { Authorization: `Bearer ${token}` };

  async function getJson(path) {
    const r = await fetch(`${API_BASE}${path}`, { headers });
    if (!r.ok) throw new Error(`GET ${path} failed: ${r.status}`);
    return r.json();
  }

  const ids = new Set();

  // Site settings
  try {
    const { siteSettings } = await getJson('/admin/site-settings');
    if (siteSettings?.logoMediaId) ids.add(siteSettings.logoMediaId);
    if (siteSettings?.faviconMediaId) ids.add(siteSettings.faviconMediaId);
  } catch {
    console.warn('  warn: could not fetch site-settings');
  }

  // Home page
  try {
    const { homePage } = await getJson('/admin/home-page');
    if (homePage?.heroImageMediaId) ids.add(homePage.heroImageMediaId);
    if (homePage?.aboutPreviewImageMediaId) ids.add(homePage.aboutPreviewImageMediaId);
    if (homePage?.whyImageMediaId) ids.add(homePage.whyImageMediaId);
  } catch {
    console.warn('  warn: could not fetch home-page');
  }

  // About page
  try {
    const { aboutPage } = await getJson('/admin/about-page');
    if (aboutPage?.overviewImageMediaId) ids.add(aboutPage.overviewImageMediaId);
  } catch {
    console.warn('  warn: could not fetch about-page');
  }

  // Partners
  try {
    const { partners } = await getJson('/admin/partner?limit=200&offset=0');
    for (const p of partners) {
      if (p.logoMediaId) ids.add(p.logoMediaId);
    }
  } catch {
    console.warn('  warn: could not fetch partners');
  }

  // Services
  try {
    const { services } = await getJson('/admin/service?limit=200&offset=0');
    for (const s of services) {
      if (s.imageMediaId) ids.add(s.imageMediaId);
    }
  } catch {
    console.warn('  warn: could not fetch services');
  }

  // Products
  try {
    const { products } = await getJson('/admin/product?limit=500&offset=0');
    for (const p of products) {
      if (p.imageMediaId) ids.add(p.imageMediaId);
    }
  } catch {
    console.warn('  warn: could not fetch products');
  }

  return ids;
}

/** List all media IDs known to the server (paginated). */
async function fetchAllMediaIds(token) {
  const limit = 100;
  let offset = 0;
  const ids = [];
  while (true) {
    const response = await fetch(`${API_BASE}/admin/media?limit=${limit}&offset=${offset}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 404 || response.status === 405) {
      // No list endpoint — fall back to the purge endpoint instead
      return null;
    }
    if (!response.ok) throw new Error(`GET /admin/media failed: ${response.status}`);
    const body = await response.json();
    const page = body.mediaList ?? body.items ?? body.media ?? [];
    for (const m of page) ids.push(m.id);
    if (page.length < limit) break;
    offset += limit;
  }
  return ids;
}

async function deleteMediaById(token, id) {
  const response = await fetch(`${API_BASE}/admin/media/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok && response.status !== 404) {
    throw new Error(`DELETE /admin/media/${id} failed: ${response.status}`);
  }
}

async function purgeUnreferencedViaEndpoint(token) {
  console.log('  Using server-side purge endpoint (DELETE /admin/media) …');
  const response = await fetch(`${API_BASE}/admin/media`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`DELETE /admin/media failed: ${response.status}`);
  console.log('  Server-side purge complete.');
}

async function main() {
  console.log(`Cleaning up unused media on ${API_BASE} …`);
  if (isDryRun) console.log('  (dry-run mode — nothing will be deleted)');

  const token = await login(readAdminPassword());
  const referencedIds = await collectReferencedMediaIds(token);
  console.log(`\n  Referenced media IDs: ${[...referencedIds].sort((a, b) => a - b).join(', ') || 'none'}`);

  const allIds = await fetchAllMediaIds(token);

  if (allIds === null) {
    // No list endpoint — use the server-side batch purge
    console.log('\n  No GET /admin/media list endpoint found.');
    if (isDryRun) {
      console.log('  Dry-run: would call DELETE /admin/media to purge server-side.');
      return;
    }
    await purgeUnreferencedViaEndpoint(token);
    return;
  }

  const orphanedIds = allIds.filter((id) => !referencedIds.has(id));
  console.log(`\n  Total media:    ${allIds.length}`);
  console.log(`  Referenced:     ${referencedIds.size}`);
  console.log(`  Orphaned:       ${orphanedIds.length}`);

  if (orphanedIds.length === 0) {
    console.log('\n  Nothing to delete.');
    return;
  }

  console.log(`\n  Orphaned IDs: ${orphanedIds.join(', ')}`);

  if (isDryRun) {
    console.log('\n  Dry-run: skipping deletion.');
    return;
  }

  let deletedCount = 0;
  for (const id of orphanedIds) {
    await deleteMediaById(token, id);
    console.log(`  deleted media id ${id}`);
    deletedCount += 1;
  }

  console.log(`\nDone. Deleted ${deletedCount} orphaned media record(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
