import test from 'node:test'
import assert from 'node:assert/strict'
import {
  FUND_PROVIDERS,
  filterAccountsByProvider,
  getAccountLogoSrc,
  getAccountsSectionTitle,
  getTotalPages,
  maskAccountNumber,
  paginateItems,
  stepWindowStart,
} from './accountsCarousel.js'

test('getAccountsSectionTitle returns dynamic section titles per category', () => {
  assert.equal(getAccountsSectionTitle('overall'), 'ALL INVESTMENT ACCOUNTS')
  assert.equal(getAccountsSectionTitle('equities'), 'ALL EQUITIES')
  assert.equal(getAccountsSectionTitle('uitfs'), 'UNIT INVESTMENT TRUST FUNDS (UITF)')
  assert.equal(getAccountsSectionTitle('mutual-fund'), 'MUTUAL FUNDS')
  assert.equal(getAccountsSectionTitle('others'), 'FIXED INCOME & TRUST')
  assert.equal(getAccountsSectionTitle('unknown'), 'INVESTMENT ACCOUNTS')
})

test('filterAccountsByProvider returns all accounts when null or matching provider only', () => {
  const sample = [
    { id: '1', provider: 'BDO' },
    { id: '2', provider: 'BPI' },
    { id: '3', provider: 'ATRAM' },
    { id: '4', provider: 'EASTWEST' },
  ]
  assert.equal(filterAccountsByProvider(sample, null).length, 4)
  assert.deepEqual(
    filterAccountsByProvider(sample, 'ATRAM').map((item) => item.id),
    ['3'],
  )
  assert.deepEqual(
    filterAccountsByProvider(sample, 'EASTWEST').map((item) => item.id),
    ['4'],
  )
})

test('paginateItems slices items cleanly and clamps out-of-range pages', () => {
  const items = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
  assert.equal(getTotalPages(items.length, 3), 3)

  const page0 = paginateItems(items, 0, 3)
  assert.deepEqual(page0, { pageItems: ['a', 'b', 'c'], safePage: 0, totalPages: 3 })

  const page2 = paginateItems(items, 2, 3)
  assert.deepEqual(page2, { pageItems: ['g'], safePage: 2, totalPages: 3 })

  const clampedHigh = paginateItems(items, 99, 3)
  assert.deepEqual(clampedHigh, { pageItems: ['g'], safePage: 2, totalPages: 3 })

  const clampedLow = paginateItems(items, -4, 3)
  assert.deepEqual(clampedLow, { pageItems: ['a', 'b', 'c'], safePage: 0, totalPages: 3 })
})

test('stepWindowStart moves provider window within bounds', () => {
  assert.equal(FUND_PROVIDERS.includes('ATRAM'), true)
  assert.equal(FUND_PROVIDERS.includes('BDO'), true)
  assert.equal(FUND_PROVIDERS.includes('BPI'), true)
  assert.equal(FUND_PROVIDERS.includes('EASTWEST'), true)

  assert.equal(stepWindowStart(0, -1, 6, 4), 0)
  assert.equal(stepWindowStart(0, 1, 6, 4), 1)
  assert.equal(stepWindowStart(1, 1, 6, 4), 2)
  assert.equal(stepWindowStart(2, 1, 6, 4), 2)
  assert.equal(stepWindowStart(2, -1, 6, 4), 1)
})

test('maskAccountNumber preserves exact length and hyphens while revealing only last 3 chars', () => {
  const full = 'JOHALEM-101-1-01-001'
  const masked = maskAccountNumber(full)
  assert.equal(masked.length, full.length)
  assert.equal(masked, 'xxxxxxx-xxx-x-xx-001')
  assert.equal(maskAccountNumber('123-004'), 'xxx-004')
  assert.equal(maskAccountNumber('001'), '001')
  assert.equal(maskAccountNumber(''), '')
})

test('getAccountLogoSrc resolves CGSI logo for equities/others and provider logos for funds', () => {
  assert.equal(getAccountLogoSrc({ category: 'equities' }), '/cgsi-logo-mark.png')
  assert.equal(getAccountLogoSrc({ category: 'others' }), '/cgsi-logo-mark.png')
  assert.equal(getAccountLogoSrc({ category: 'uitfs', provider: 'BDO' }), '/logos/bdo.svg')
  assert.equal(getAccountLogoSrc({ category: 'uitfs', provider: 'BPI' }), '/logos/bpi.svg')
  assert.equal(getAccountLogoSrc({ category: 'uitfs', provider: 'ATRAM' }), '/logos/atram.png')
  assert.equal(getAccountLogoSrc({ category: 'mutual-fund', provider: 'EASTWEST' }), '/logos/eastwest.svg')
})
