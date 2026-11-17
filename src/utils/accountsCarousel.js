export const FUND_PROVIDERS = ['ATRAM', 'BDO', 'BPI', 'EASTWEST', 'METROBANK', 'RCBC']

const CATEGORY_SECTION_TITLES = {
  overall: 'ALL INVESTMENT ACCOUNTS',
  equities: 'ALL EQUITIES',
  uitfs: 'UNIT INVESTMENT TRUST FUNDS (UITF)',
  'mutual-fund': 'MUTUAL FUNDS',
  others: 'FIXED INCOME & TRUST',
}

export function getAccountsSectionTitle(categoryId) {
  return CATEGORY_SECTION_TITLES[categoryId] || 'INVESTMENT ACCOUNTS'
}

export function filterAccountsByProvider(accounts = [], provider = null) {
  if (!provider) return accounts
  return accounts.filter((account) => account.provider === provider)
}

export function getTotalPages(totalItems, pageSize = 3) {
  const safeSize = Math.max(1, pageSize)
  return Math.max(1, Math.ceil(totalItems / safeSize))
}

export function paginateItems(items = [], pageIndex = 0, pageSize = 3) {
  const safeSize = Math.max(1, pageSize)
  const totalPages = getTotalPages(items.length, safeSize)
  const safePage = Math.min(totalPages - 1, Math.max(0, pageIndex))
  const start = safePage * safeSize
  return {
    pageItems: items.slice(start, start + safeSize),
    safePage,
    totalPages,
  }
}

export function stepWindowStart(currentStart = 0, delta = 0, totalItems = 0, windowSize = 4) {
  const maxStart = Math.max(0, totalItems - Math.max(1, windowSize))
  return Math.min(maxStart, Math.max(0, currentStart + delta))
}

const PROVIDER_LOGOS = {
  ATRAM: '/logos/atram.svg',
  BDO: '/logos/bdo.svg',
  BPI: '/logos/bpi.svg',
  EASTWEST: '/logos/eastwest.svg',
  METROBANK: '/logos/metrobank.svg',
  RCBC: '/logos/rcbc.svg',
}

export function getAccountLogoSrc(account) {
  if (account?.provider && PROVIDER_LOGOS[account.provider]) {
    return PROVIDER_LOGOS[account.provider]
  }
  return '/cgsi-logo-mark.png'
}

export function maskAccountNumber(accountNumber = '') {
  const value = String(accountNumber || '')
  if (value.length <= 3) return value
  const cutoff = value.length - 3
  return value
    .split('')
    .map((char, index) => {
      if (index >= cutoff) return char
      return char === '-' ? '-' : 'x'
    })
    .join('')
}
