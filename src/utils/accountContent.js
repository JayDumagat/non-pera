export function getScopedAccountContent({
  category = 'overall',
  accountId = null,
  holdings = [],
  activities = [],
  defaultHoldings = holdings,
  defaultActivities = activities,
}) {
  if (accountId) {
    return {
      holdings: holdings.filter((item) => item.accountId === accountId),
      activities: activities.filter((item) => item.accountId === accountId),
    }
  }

  if (category && category !== 'overall') {
    return {
      holdings: holdings.filter((item) => item.category === category),
      activities: activities.filter((item) => item.category === category),
    }
  }

  return {
    holdings: defaultHoldings,
    activities: defaultActivities,
  }
}
