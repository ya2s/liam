import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

type ShowModeTest = {
  mode: string
  expectedColumns: string[]
}

const showModeTests: ShowModeTest[] = [
  {
    mode: 'Table Name',
    expectedColumns: [],
  },
  {
    mode: 'Key Only',
    expectedColumns: ['idbigserial', 'account_idbigint'],
  },
  {
    mode: 'All Fields',
    expectedColumns: [
      'idbigserial',
      'account_idbigint',
      'titlevarchar',
      'created_attimestamp',
      'updated_attimestamp',
      'replies_policyinteger',
      'exclusiveboolean',
    ],
  },
]

test.describe('Desktop Toolbar', () => {
  test('should be visible', async ({ page }) => {
    const toolbar = page.getByRole('toolbar', { name: 'Toolbar' })
    await expect(toolbar).toBeVisible()
  })

  test('zoom in button should increase zoom level', async ({ page }) => {
    const toolbar = page.getByRole('toolbar', { name: 'Toolbar' })
    const zoomLevelText = toolbar.locator('span[class*="zoomLevelText"]')

    const zoomLevelBefore = await zoomLevelText.textContent()

    const zoomInButton = toolbar.getByRole('button', { name: 'Zoom in' })
    await zoomInButton.click()

    const zoomLevelAfter = await zoomLevelText.textContent()
    expect(Number.parseInt(zoomLevelBefore)).toBeLessThan(
      Number.parseInt(zoomLevelAfter),
    )
  })

  test('zoom out button should decrease zoom level', async ({ page }) => {
    const toolbar = page.getByRole('toolbar', { name: 'Toolbar' })
    const zoomLevelText = toolbar.locator('span[class*="zoomLevelText"]')

    const zoomLevelBefore = await zoomLevelText.textContent()

    const zoomOutButton = toolbar.getByRole('button', { name: 'Zoom out' })
    await zoomOutButton.click()

    const zoomLevelAfter = await zoomLevelText.textContent()
    expect(Number.parseInt(zoomLevelBefore)).toBeGreaterThan(
      Number.parseInt(zoomLevelAfter),
    )
  })

  test.describe('Show Mode', () => {
    test.beforeEach(async ({ page }) => {
      const showModeButton = page.getByRole('button', {
        name: 'Show mode',
      })
      await showModeButton.click()
    })

    for (const { mode, expectedColumns } of showModeTests) {
      test(`Show Mode: ${mode}`, async ({ page }) => {
        const modeButton = page.getByRole('menuitemradio', {
          name: mode,
        })
        await modeButton.click()

        const tableNode = page.getByRole('button', {
          name: 'lists table',
          exact: true,
        })

        const columns = tableNode.getByRole('listitem')
        await expect(columns).toHaveText(expectedColumns)
      })
    }
  })
})

test.describe('Mobile Toolbar', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    const openToolbarButton = page.getByRole('button', {
      name: 'Open toolbar',
    })
    await openToolbarButton.click()
  })

  test('should be visible', async ({ page }) => {
    const toolbar = page.getByRole('toolbar', { name: 'Toolbar' })
    await expect(toolbar).toBeVisible()
  })

  test('zoom in button should increase zoom level', async ({ page }) => {
    const toolbar = page.getByRole('toolbar', { name: 'Toolbar' })
    const zoomLevelText = toolbar.locator('div[class*="zoomPercent"]')

    const zoomLevelBefore = await zoomLevelText.textContent()

    const zoomInButton = toolbar.getByRole('button', { name: 'Zoom in' })
    await zoomInButton.click()

    const zoomLevelAfter = await zoomLevelText.textContent()
    expect(Number.parseInt(zoomLevelBefore)).toBeLessThan(
      Number.parseInt(zoomLevelAfter),
    )
  })

  test('zoom out button should decrease zoom level', async ({ page }) => {
    const toolbar = page.getByRole('toolbar', { name: 'Toolbar' })
    const zoomLevelText = toolbar.locator('div[class*="zoomPercent"]')

    const zoomLevelBefore = await zoomLevelText.textContent()

    const zoomOutButton = toolbar.getByRole('button', { name: 'Zoom out' })
    await zoomOutButton.click()

    const zoomLevelAfter = await zoomLevelText.textContent()
    expect(Number.parseInt(zoomLevelBefore)).toBeGreaterThan(
      Number.parseInt(zoomLevelAfter),
    )
  })

  test.describe('Show Mode', () => {
    test.beforeEach(async ({ page }) => {
      const showModeButton = page.getByRole('button', {
        name: 'Show mode',
      })
      await showModeButton.click()
    })

    for (const { mode, expectedColumns } of showModeTests) {
      test(`Show Mode: ${mode}`, async ({ page }) => {
        const modeButton = page.getByRole('radio', {
          name: mode,
        })
        await modeButton.click()

        const tableNode = page.getByRole('button', {
          name: 'lists table',
          exact: true,
        })

        const columns = tableNode.getByRole('listitem')
        await expect(columns).toHaveText(expectedColumns)
      })
    }
  })
})
