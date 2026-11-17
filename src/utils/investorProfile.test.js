import test from 'node:test'
import assert from 'node:assert/strict'
import { DEFAULT_INVESTOR_PROFILE, formatInvestorProfileSubtitle } from './investorProfile'

test('formats risk profile in uppercase with PERA Contributor and Employer Linked in parentheses', () => {
  assert.equal(
    formatInvestorProfileSubtitle(DEFAULT_INVESTOR_PROFILE),
    'BALANCED | PERA Contributor (Employer Linked)',
  )
  assert.equal(
    formatInvestorProfileSubtitle({
      riskProfile: 'Conservative',
      isPeraContributor: true,
      isEmployerLinked: true,
    }),
    'CONSERVATIVE | PERA Contributor (Employer Linked)',
  )
})

test('formats PERA Contributor without employer link when not employer linked', () => {
  assert.equal(
    formatInvestorProfileSubtitle({
      riskProfile: 'Conservative',
      isPeraContributor: true,
      isEmployerLinked: false,
    }),
    'CONSERVATIVE | PERA Contributor',
  )
})

test('formats employer linked only or risk profile only when PERA contributor is false', () => {
  assert.equal(
    formatInvestorProfileSubtitle({
      riskProfile: 'Moderate',
      isPeraContributor: false,
      isEmployerLinked: true,
    }),
    'MODERATE | (Employer Linked)',
  )
  assert.equal(
    formatInvestorProfileSubtitle({
      riskProfile: 'Aggressive',
      isPeraContributor: false,
      isEmployerLinked: false,
    }),
    'AGGRESSIVE',
  )
})
