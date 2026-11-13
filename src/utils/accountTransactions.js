export function validateAccountTransaction({ type, amount, accountBalance }) {
  const numericAmount = Number(amount)
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return { valid: false, error: 'Enter an amount greater than ₱0.' }
  }
  if (type === 'withdraw' && numericAmount > accountBalance) {
    return { valid: false, error: 'Withdrawal exceeds available account balance.' }
  }
  return { valid: true, numericAmount: Number(numericAmount.toFixed(2)) }
}

export function applyAccountTransaction({ accounts, categories, accountId, type, amount }) {
  const target = accounts.find((account) => account.id === accountId)
  if (!target) {
    return { error: 'Account not found.', accounts, categories }
  }

  const validation = validateAccountTransaction({
    type,
    amount,
    accountBalance: target.value,
  })
  if (!validation.valid) {
    return { error: validation.error, accounts, categories }
  }

  const delta = type === 'deposit' ? validation.numericAmount : -validation.numericAmount
  const nextAccounts = accounts.map((account) =>
    account.id === accountId
      ? { ...account, value: Number((account.value + delta).toFixed(2)) }
      : account,
  )

  const nextCategories = categories.map((category) => {
    if (category.id === target.category || category.id === 'overall') {
      return { ...category, value: Number((category.value + delta).toFixed(2)) }
    }
    return category
  })

  const updatedAccount = nextAccounts.find((account) => account.id === accountId)
  return {
    error: null,
    accounts: nextAccounts,
    categories: nextCategories,
    updatedAccount,
    delta,
  }
}
