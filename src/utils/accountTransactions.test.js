import test from 'node:test'
import assert from 'node:assert/strict'
import { applyAccountTransaction, validateAccountTransaction } from './accountTransactions.js'

const sampleAccounts = [
  { id: 'account-1', category: 'equities', name: 'Margin', value: 1000 },
  { id: 'account-4', category: 'uitfs', name: 'BDO Equity Index Fund', value: 2180.5 },
]

const sampleCategories = [
  { id: 'overall', label: 'Overall', value: 3180.5 },
  { id: 'equities', label: 'Equities', value: 1000 },
  { id: 'uitfs', label: 'UITFs', value: 2180.5 },
]

test('validateAccountTransaction rejects zero, negative, and non-numeric values', () => {
  assert.equal(validateAccountTransaction({ type: 'deposit', amount: '0', accountBalance: 500 }).valid, false)
  assert.equal(validateAccountTransaction({ type: 'deposit', amount: '-50', accountBalance: 500 }).valid, false)
  assert.equal(validateAccountTransaction({ type: 'deposit', amount: 'abc', accountBalance: 500 }).valid, false)
})

test('validateAccountTransaction rejects withdrawals exceeding account balance', () => {
  const result = validateAccountTransaction({ type: 'withdraw', amount: '600', accountBalance: 500 })
  assert.equal(result.valid, false)
  assert.match(result.error, /exceeds/i)
})

test('applyAccountTransaction adds deposit to account, category, and overall totals', () => {
  const result = applyAccountTransaction({
    accounts: sampleAccounts,
    categories: sampleCategories,
    accountId: 'account-4',
    type: 'deposit',
    amount: '1000',
  })

  assert.equal(result.error, null)
  assert.equal(result.updatedAccount.value, 3180.5)
  assert.equal(result.categories.find((c) => c.id === 'uitfs').value, 3180.5)
  assert.equal(result.categories.find((c) => c.id === 'overall').value, 4180.5)
})

test('applyAccountTransaction subtracts withdrawal from account, category, and overall totals', () => {
  const result = applyAccountTransaction({
    accounts: sampleAccounts,
    categories: sampleCategories,
    accountId: 'account-1',
    type: 'withdraw',
    amount: '250.25',
  })

  assert.equal(result.error, null)
  assert.equal(result.updatedAccount.value, 749.75)
  assert.equal(result.categories.find((c) => c.id === 'equities').value, 749.75)
  assert.equal(result.categories.find((c) => c.id === 'overall').value, 2930.25)
})
