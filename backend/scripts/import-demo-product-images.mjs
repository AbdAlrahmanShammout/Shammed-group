/**
 * Upload demo product catalogue images and attach them by matching
 * slugified product names to filenames.
 *
 * Run: node scripts/import-demo-product-images.mjs
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:3000';
const MEDIA_DIR = resolve(__dirname, '../tmp/demo-product-images');
const ENV_PATH = resolve(__dirname, '../.env');

function readAdminPassword() {
  const envText = readFileSync(ENV_PATH, 'utf8');
  const match = envText.match(/^ADMIN_PASSWORD=(.*)$/m);
  if (!match) {
    throw new Error('ADMIN_PASSWORD missing from backend/.env');
  }
  return match[1].trim();
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
  if (!response.ok) {
    throw new Error(`Login failed: ${response.status} ${await response.text()}`);
  }
  const body = await response.json();
  return body.accessToken;
}

async function uploadMedia(token, absolutePath, originalFileName) {
  if (!existsSync(absolutePath)) {
    throw new Error(`Missing file: ${absolutePath}`);
  }
  const bytes = readFileSync(absolutePath);
  const form = new FormData();
  form.append('file', new Blob([bytes], { type: 'image/png' }), originalFileName);
  const response = await fetch(`${API_BASE}/admin/media`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!response.ok) {
    throw new Error(
      `Upload failed for ${originalFileName}: ${response.status} ${await response.text()}`,
    );
  }
  const body = await response.json();
  return body.media.id;
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

async function main() {
  const token = await login(readAdminPassword());
  const imageFiles = readdirSync(MEDIA_DIR).filter((name) =>
    ['.png', '.jpg', '.jpeg', '.webp'].includes(extname(name).toLowerCase()),
  );
  const imageBySlug = new Map(
    imageFiles.map((fileName) => [basename(fileName, extname(fileName)), fileName]),
  );
  const { products } = await getJson(token, '/admin/product?limit=100');
  let attachedCount = 0;
  for (const product of products) {
    const slug = toSlug(product.name);
    const fileName = imageBySlug.get(slug);
    if (!fileName) {
      console.log(`skip (no image): ${product.name} → ${slug}`);
      continue;
    }
    const mediaId = await uploadMedia(token, resolve(MEDIA_DIR, fileName), fileName);
    await patchJson(token, `/admin/product/${product.id}`, { imageMediaId: mediaId });
    attachedCount += 1;
    console.log(`attached media ${mediaId} → ${product.name} (${fileName})`);
  }
  console.log(`Done. Attached ${attachedCount} product image(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
