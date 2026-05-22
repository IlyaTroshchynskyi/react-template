import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

dotenv.config({ path: path.resolve(__dirname, '.env.e2e.local') })
dotenv.config({ path: path.resolve(__dirname, '.env.e2e') })

const CI = !!process.env.CI

export default defineConfig({
  testDir: './e2e/tests',
  tsconfig: './tsconfig.e2e.json',
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  workers: CI ? '50%' : 2,
  reporter: CI ? [['github'], ['html']] : [['html', { open: 'on-failure' }], ['list']],
  use: {
    baseURL: 'http://localhost:5173',
    headless: CI,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run client',
    url: 'http://localhost:5173',
    reuseExistingServer: !CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      // Headed local runs use the real OS window (maximized) — viewport: null disables
      // Playwright's viewport simulation, --start-maximized tells Chromium to fill the screen.
      // CI keeps the deterministic Desktop Chrome preset (1280x720) for stable screenshots.
      use: CI
        ? { ...devices['Desktop Chrome'] }
        : {
            channel: 'chromium',
            viewport: null,
            launchOptions: { args: ['--start-maximized'] },
          },
    },
  ],
})
