import test from 'node:test'
import assert from 'node:assert/strict'
import { getScopedAccountContent } from './accountContent.js'

const sampleHoldings = [
  { accountId: 'account-1', category: 'equities', ticker: 'SM', value: 7240 },
  { accountId: 'account-2', category: 'equities', ticker: 'VTI', value: 3980.4 },
  { accountId: 'account-4', category: 'uitfs', ticker: 'BDOEI', value: 2180.5 },
]

const sampleActivities = [
  { accountId: 'account-1', category: 'equities', title: 'Buy order filled' },
  { accountId: 'account-2', category: 'equities', title: 'Rebalance executed' },
  { accountId: 'account-4', category: 'uitfs', title: 'UITF subscription' },
]

const defaultHoldings = [{ ticker: 'VTI' }, { ticker: 'VXUS' }]
const defaultActivities = [{ title: 'Recurring investment' }]

test('returns defaults for overall category when no account is selected', () => {
  const result = getScopedAccountContent({
    category: 'overall',
    accountId: null,
    holdings: sampleHoldings,
    activities: sampleActivities,
    defaultHoldings,
    defaultActivities,
  })
  assert.deepEqual(result.holdings, defaultHoldings)
  assert.deepEqual(result.activities, defaultActivities)
})

test('filters holdings and activities by category when no account is selected', () => {
  const result = getScopedAccountContent({
    category: 'equities',
    accountId: null,
    holdings: sampleHoldings,
    activities: sampleActivities,
    defaultHoldings,
    defaultActivities,
  })
  assert.deepEqual(result.holdings.map((h) => h.ticker), ['SM', 'VTI'])
  assert.deepEqual(result.activities.map((a) => a.title), ['Buy order filled', 'Rebalance executed'])
})

test('filters holdings and activities strictly by selected accountId when selected', () => {
  const result = getScopedAccountContent({
    category: 'overall',
    accountId: 'account-4',
    holdings: sampleHoldings,
    activities: sampleActivities,
    defaultHoldings,
    defaultActivities,
  })
  assert.deepEqual(result.holdings.map((h) => h.ticker), ['BDOEI'])
  assert.deepEqual(result.activities.map((a) => a.title), ['UITF subscription'])
})
