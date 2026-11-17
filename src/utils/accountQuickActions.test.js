import test from 'node:test'
import assert from 'node:assert/strict'
import { getAccountQuickActions, getWalletQuickActions, isFundCategory, stepCategorySelection } from './accountQuickActions.js'

test('isFundCategory identifies UITFs and Mutual funds only', () => {
  assert.equal(isFundCategory('uitfs'), true)
  assert.equal(isFundCategory('mutual-fund'), true)
  assert.equal(isFundCategory('equities'), false)
  assert.equal(isFundCategory('others'), false)
})

test('getAccountQuickActions returns Buy/Sell plus Deposit/Withdraw/Transfer for equities and others', () => {
  const equityActions = getAccountQuickActions({ id: 'account-1', category: 'equities' })
  assert.deepEqual(
    equityActions.primary.map((item) => item.label),
    ['Buy', 'Sell'],
  )
  assert.deepEqual(
    equityActions.fixed.map((item) => item.label),
    ['Deposit', 'Withdraw', 'Transfer'],
  )
  assert.equal(equityActions.primary[0].to, '/portfolio?action=buy&account=account-1')
  assert.equal(equityActions.fixed[2].to, '/funding?mode=transfer&account=account-1')

  const otherActions = getAccountQuickActions({ id: 'account-8', category: 'others' })
  assert.deepEqual(
    otherActions.primary.map((item) => item.label),
    ['Buy', 'Sell'],
  )
})

test('getAccountQuickActions returns Subscribe/Redeem plus Deposit/Withdraw/Transfer for funds', () => {
  const uitfActions = getAccountQuickActions({ id: 'account-4', category: 'uitfs' })
  assert.deepEqual(
    uitfActions.primary.map((item) => item.label),
    ['Subscribe', 'Redeem'],
  )
  assert.deepEqual(
    uitfActions.fixed.map((item) => item.label),
    ['Deposit', 'Withdraw', 'Transfer'],
  )
  assert.equal(uitfActions.primary[0].to, '/portfolio?action=subscribe&account=account-4')
  assert.equal(uitfActions.primary[1].to, '/portfolio?action=redeem&account=account-4')

  const mutualFundActions = getAccountQuickActions({ id: 'account-6', category: 'mutual-fund' })
  assert.deepEqual(
    mutualFundActions.primary.map((item) => item.label),
    ['Subscribe', 'Redeem'],
  )
})

test('getWalletQuickActions returns Deposit (primary), Withdraw, and Transfer actions with optional account query', () => {
  const defaultActions = getWalletQuickActions()
  assert.deepEqual(defaultActions, [
    { id: 'deposit', label: 'Deposit', to: '/funding?mode=deposit', primary: true },
    { id: 'withdraw', label: 'Withdraw', to: '/funding?mode=withdraw', primary: false },
    { id: 'transfer', label: 'Transfer', to: '/funding?mode=transfer', primary: false },
  ])

  const scopedActions = getWalletQuickActions('account-2')
  assert.equal(scopedActions[0].to, '/funding?mode=deposit&account=account-2')
  assert.equal(scopedActions[1].to, '/funding?mode=withdraw&account=account-2')
  assert.equal(scopedActions[2].to, '/funding?mode=transfer&account=account-2')
})

test('stepCategorySelection moves up and down within category bounds', () => {
  const items = [{ id: 'overall' }, { id: 'equities' }, { id: 'uitfs' }]
  assert.equal(stepCategorySelection(items, 'overall', -1), 'overall')
  assert.equal(stepCategorySelection(items, 'overall', 1), 'equities')
  assert.equal(stepCategorySelection(items, 'equities', 1), 'uitfs')
  assert.equal(stepCategorySelection(items, 'uitfs', 1), 'uitfs')
  assert.equal(stepCategorySelection(items, 'uitfs', -1), 'equities')
})
