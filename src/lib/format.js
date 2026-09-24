/**
 * Formats a number as PKR currency for display in tables.
 */
export function formatCurrency(amount) {
  return `Rs. ${amount.toLocaleString()}`
}

/**
 * Formats an ISO date string (2026-09-26) as "Sep 26, 2026".
 */
export function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}