import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig, devices } from '@playwright/test';

const configDirectory = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(configDirectory, '..');
const frontendPort = 5173;
const backendPort = 3000;
const frontendBaseUrl = `http://localhost:${frontendPort}`;
const backendBaseUrl = `http://localhost:${backendPort}`;

function loadEnvFile(filePath: string): void {
  if (!existsSync(filePath)) {
    return;
  }
  const contents = readFileSync(filePath, 'utf8');
  for (const line of contents.split('\n')) {
    const trimmed = line.trim();
    if (trimmed === '' || trimmed.startsWith('#') || !trimmed.includes('=')) {
      continue;
    }
    const separatorIndex = trimmed.indexOf('=');
    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.join(workspaceRoot, 'backend', '.env'));
loadEnvFile(path.join(workspaceRoot, 'frontend', '.env'));

if (!process.env.E2E_ADMIN_PASSWORD && process.env.ADMIN_PASSWORD) {
  process.env.E2E_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
}

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 60_000,
  expect: {
    timeout: 15_000,
  },
  reporter: [['list']],
  use: {
    baseURL: frontendBaseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'pnpm --filter backend start:dev',
      cwd: workspaceRoot,
      url: `${backendBaseUrl}/health/live`,
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    },
    {
      command: 'pnpm --filter frontend start:dev',
      cwd: workspaceRoot,
      url: frontendBaseUrl,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
