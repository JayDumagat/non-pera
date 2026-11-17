export function filterReports(items, { category = 'All', range = 'All', search = '' } = {}) {
  const normalizedSearch = search.trim().toLowerCase()
  return items.filter((item) => {
    const matchesCategory =
      category === 'All' ||
      item.category === category ||
      (category === 'Custom Requests' && item.isCustom)
    if (!matchesCategory) return false

    const matchesRange =
      range === 'All' ||
      item.rangeKey === range ||
      (item.period && item.period.toLowerCase().includes(range.toLowerCase()))
    if (!matchesRange) return false

    if (!normalizedSearch) return true
    return [item.title, item.period, item.category, item.accountScope, item.format]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(normalizedSearch))
  })
}

