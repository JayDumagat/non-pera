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
