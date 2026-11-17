export const DEFAULT_INVESTOR_PROFILE = {
  riskProfile: 'Balanced',
  isPeraContributor: true,
  isEmployerLinked: true,
}

export function formatInvestorProfileSubtitle({
  riskProfile,
  isPeraContributor = false,
  isEmployerLinked = false,
}) {
  const normalizedRisk = String(riskProfile || '').trim().toUpperCase()
  const peraStatus = [
    isPeraContributor ? 'PERA Contributor' : '',
    isEmployerLinked ? '(Employer Linked)' : '',
  ]
    .filter(Boolean)
    .join(' ')

  if (!normalizedRisk) {
    return peraStatus
  }

  return peraStatus ? `${normalizedRisk} | ${peraStatus}` : normalizedRisk
}
