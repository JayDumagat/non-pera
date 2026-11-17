export function filterReports(items, { category = 'All', search = '' } = {}) {
  const normalizedSearch = search.trim().toLowerCase()
  return items.filter((item) => {
    const matchesCategory = category === 'All' || item.category === category
    if (!matchesCategory) return false
    if (!normalizedSearch) return true
    return [item.title, item.period, item.category, item.accountScope, item.format]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(normalizedSearch))
  })
}
