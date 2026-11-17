import test from 'node:test'
import assert from 'node:assert/strict'
import { getAccountQuickActions, isFundCategory } from './accountQuickActions.js'

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
