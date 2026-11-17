export function isFundCategory(category) {
  return category === 'uitfs' || category === 'mutual-fund'
}

export function getAccountQuickActions(account) {
  const encodedId = encodeURIComponent(account.id)
  const primary = isFundCategory(account.category)
    ? [
        { id: 'subscribe', label: 'Subscribe', to: `/portfolio?action=subscribe&account=${encodedId}`, primary: true },
        { id: 'redeem', label: 'Redeem', to: `/portfolio?action=redeem&account=${encodedId}`, primary: false },
      ]
    : [
        { id: 'buy', label: 'Buy', to: `/portfolio?action=buy&account=${encodedId}`, primary: true },
        { id: 'sell', label: 'Sell', to: `/portfolio?action=sell&account=${encodedId}`, primary: false },
      ]

  const fixed = [
    { id: 'deposit', label: 'Deposit', to: `/funding?mode=deposit&account=${encodedId}` },
    { id: 'withdraw', label: 'Withdraw', to: `/funding?mode=withdraw&account=${encodedId}` },
    { id: 'transfer', label: 'Transfer', to: `/funding?mode=transfer&account=${encodedId}` },
  ]

  return { primary, fixed }
}

export function getWalletQuickActions(accountId = null) {
  const accountSuffix = accountId ? `&account=${encodeURIComponent(accountId)}` : ''
  return [
    { id: 'deposit', label: 'Deposit', to: `/funding?mode=deposit${accountSuffix}`, primary: true },
    { id: 'withdraw', label: 'Withdraw', to: `/funding?mode=withdraw${accountSuffix}`, primary: false },
    { id: 'transfer', label: 'Transfer', to: `/funding?mode=transfer${accountSuffix}`, primary: false },
  ]
}

export function stepCategorySelection(categories, currentId, delta) {
  if (!Array.isArray(categories) || categories.length === 0) return currentId
  const currentIndex = categories.findIndex((item) => item.id === currentId)
  const baseIndex = currentIndex === -1 ? 0 : currentIndex
  const nextIndex = Math.min(categories.length - 1, Math.max(0, baseIndex + delta))
  return categories[nextIndex].id
}
