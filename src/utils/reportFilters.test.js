import test from 'node:test'
import assert from 'node:assert/strict'
import { filterReports } from './reportFilters.js'

const sampleReports = [
  { id: 'r1', title: 'Monthly Portfolio Statement', period: 'October 2026', category: 'Statements', accountScope: 'All accounts', format: 'PDF' },
  { id: 'r2', title: 'PERA Contribution Tax Credit', period: 'FY 2026', category: 'Tax & PERA', accountScope: 'PERA Portfolio', format: 'PDF' },
  { id: 'r3', title: 'Equities Trade Confirmation Ledger', period: 'Q3 2026', category: 'Trade Logs', accountScope: 'Equities', format: 'CSV' },
]

test('filterReports returns all items when category is All and search is empty', () => {
  assert.equal(filterReports(sampleReports, { category: 'All', search: '' }).length, 3)
})

test('filterReports filters by category', () => {
  const result = filterReports(sampleReports, { category: 'Tax & PERA' })
  assert.deepEqual(result.map((item) => item.id), ['r2'])
})

test('filterReports filters by search across title, period, accountScope, and format', () => {
  assert.deepEqual(filterReports(sampleReports, { search: 'csv' }).map((item) => item.id), ['r3'])
  assert.deepEqual(filterReports(sampleReports, { search: 'october' }).map((item) => item.id), ['r1'])
})
