import { test, expect, type Page } from '@playwright/test'

/** Pre-seed local progress so a test can start deep in the ladder. */
async function seedCompleted(page: Page, floorsDone: number[], stepsPerFloor: Record<number, number>) {
  const completed: Record<string, unknown> = {}
  for (const f of floorsDone) for (let s = 1; s <= stepsPerFloor[f]; s++) completed[`f${f}-s${s}`] = { xp: 50, score: 100, at: new Date().toISOString() }
  await page.addInitScript((c) => {
    if (!sessionStorage.getItem('seeded')) {
      localStorage.setItem('dataladder-progress', JSON.stringify({ state: { completed: c, floorsComplete: Object.keys(c).length ? [1, 2, 3, 4] : [], xp: 500 }, version: 1 }))
      sessionStorage.setItem('seeded', '1')
    }
  }, completed)
}

async function readXp(page: Page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem('dataladder-progress') ?? '{}').state?.xp ?? 0)
}

async function finishLesson(page: Page) {
  await expect(page.getByText(/^Card 1 of \d+$/i)).toBeVisible()
  const next = page.getByRole('button', { name: /^Next →$/ })
  while (await next.isVisible()) await next.click()
}

test('beginner completes the first step and progress persists', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /take the first step/i }).click()
  await expect(page).toHaveURL(/\/step\/f1-s1$/)

  // Click through lesson cards
  await finishLesson(page)
  await page.getByRole('button', { name: /take the quiz/i }).click()

  // Answer every question (first enabled option), waiting for each question to render.
  const counter = page.getByText(/Question \d+ of \d+/)
  await expect(counter).toBeVisible()
  const total = Number((await counter.textContent())!.match(/of (\d+)/)![1])
  for (let n = 1; n <= total; n++) {
    await expect(page.getByText(new RegExp(`Question ${n} of ${total}`))).toBeVisible()
    await page.locator('section[aria-label="Quiz"] button:not([disabled])').first().click()
    await page.getByRole('button', { name: n === total ? /see results/i : /next question/i }).click()
  }
  await expect(page.getByRole('heading', { name: /step complete/i })).toBeVisible()
  expect(await readXp(page)).toBeGreaterThan(0)
  const badges = await page.evaluate(() => JSON.parse(localStorage.getItem('dataladder-progress') ?? '{}').state?.badges ?? {})
  expect(Object.keys(badges)).toContain('first-step')

  await page.reload()
  await expect(page.getByRole('heading', { name: /step complete|what a data analyst/i }).first()).toBeVisible()
  await page.goto('/achievements')
  await expect(page.getByText(/[1-9] of \d+ badges unlocked/)).toBeVisible()
})
test('Query Quest validates real SQL', async ({ page }) => {
  await seedCompleted(page, [1, 2, 3, 4], { 1: 5, 2: 6, 3: 6, 4: 6 })
  await page.goto('/step/f5-s1')
  await finishLesson(page)
  await page.getByRole('button', { name: /play query quest/i }).click()

  const editor = page.getByLabel('SQL query')
  await editor.fill('SELECT name FROM products')
  await page.getByRole('button', { name: /run/i }).click()
  await expect(page.getByText(/expected 4 columns/i)).toBeVisible()

  await editor.fill('SELECT * FROM products')
  await page.getByRole('button', { name: /run/i }).click()
  await expect(page.getByText(/case solved/i)).toBeVisible()
  await expect(page.getByRole('table')).toContainText('Espresso')
})

test('Formula Forge evaluates spreadsheet formulas', async ({ page }) => {
  await seedCompleted(page, [1], { 1: 5 })
  await page.goto('/step/f2-s1')
  await finishLesson(page)
  await page.getByRole('button', { name: /play formula forge/i }).click()
  const fx = page.getByLabel('Formula', { exact: true })
  await fx.fill('=C2+D2')
  await fx.press('Enter')
  await expect(page.getByText(/isn't the right value/i)).toBeVisible()
  await fx.fill('=SUM(C2:E2)')
  await fx.press('Enter')
  await expect(page.getByText('F2 = 4050')).toBeVisible()
})

test('library, jobs and certificate pages load', async ({ page }) => {
  await page.goto('/library')
  await expect(page.getByText(/\d+ resources$/)).toBeVisible()
  await page.goto('/jobs')
  await expect(page.getByText(/of \d+ roles/)).toBeVisible()
  expect(await page.getByRole('link', { name: /apply/i }).count()).toBeGreaterThan(10)
  await page.goto('/certificate')
  await expect(page.getByText(/Climb all 10 floors/)).toBeVisible()
})
