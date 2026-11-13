import test from 'node:test'
import assert from 'node:assert/strict'
import { filterProducts } from './productFilters.js'

const sampleProducts = [
  { id: 'market', name: 'Total Market Index', category: 'Index funds', detail: 'Broad exposure to leading US companies', risk: 'Moderate' },
  { id: 'treasury', name: 'Treasury Portfolio', category: 'Fixed income', detail: 'A steadier mix of government bonds', risk: 'Low' },
  { id: 'cash', name: 'Cash Reserve', category: 'Cash', detail: 'Keep funds available for your next move', risk: 'Low' },
  { id: 'retirement', name: 'Future Builder', category: 'Retirement', detail: 'A diversified long-term portfolio', risk: 'Balanced' },
]

test('returns all products when filters are All and search is empty', () => {
  const result = filterProducts(sampleProducts, { category: 'All', risk: 'All', search: '' })
  assert.equal(result.length, 4)
})

test('filters by category', () => {
  const result = filterProducts(sampleProducts, { category: 'Fixed income' })
  assert.deepEqual(result.map((p) => p.id), ['treasury'])
})

test('filters by risk level', () => {
  const result = filterProducts(sampleProducts, { risk: 'Low' })
  assert.deepEqual(result.map((p) => p.id), ['treasury', 'cash'])
})

test('filters by search across name, detail, category, and risk', () => {
  assert.deepEqual(filterProducts(sampleProducts, { search: '  bonds ' }).map((p) => p.id), ['treasury'])
  assert.deepEqual(filterProducts(sampleProducts, { search: 'balanced' }).map((p) => p.id), ['retirement'])
})

test('combines category, risk, and search filters', () => {
  const result = filterProducts(sampleProducts, { category: 'Cash', risk: 'Low', search: 'reserve' })
  assert.deepEqual(result.map((p) => p.id), ['cash'])
})
