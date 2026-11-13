export function filterProducts(products, { category = 'All', risk = 'All', search = '' } = {}) {
  const query = search.trim().toLowerCase()
  return products.filter((product) => {
    const matchesCategory = category === 'All' || product.category === category
    const matchesRisk = risk === 'All' || product.risk === risk
    if (!matchesCategory || !matchesRisk) return false
    if (!query) return true
    const searchable = `${product.name} ${product.detail} ${product.category} ${product.risk}`.toLowerCase()
    return searchable.includes(query)
  })
}
