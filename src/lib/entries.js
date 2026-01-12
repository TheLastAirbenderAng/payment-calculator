/**
 * Filter entries by payment status
 * @param {Array} entries - Array of entry objects
 * @param {string} filter - 'all' | 'paid' | 'unpaid'
 * @returns {Array} Filtered entries
 */
export function filterEntriesByStatus(entries, filter) {
  if (filter === 'all') {
    return entries
  }

  return entries.filter(entry => {
    // Treat undefined/null isPaid as unpaid (for legacy data)
    const isPaid = entry.isPaid === true
    
    if (filter === 'paid') {
      return isPaid
    }
    if (filter === 'unpaid') {
      return !isPaid
    }
    return true
  })
}

/**
 * Calculate total amount owed (sum of unpaid entries)
 * @param {Array} entries - Array of entry objects
 * @returns {number} Total amount owed
 */
export function calculateTotalOwed(entries) {
  return entries
    .filter(entry => entry.isPaid !== true)
    .reduce((sum, entry) => sum + (entry.calculatedTotal || 0), 0)
}

/**
 * Get summary stats for entries
 * @param {Array} entries - Array of entry objects
 * @returns {Object} Summary stats
 */
export function getEntriesSummary(entries) {
  const unpaidEntries = entries.filter(e => e.isPaid !== true)
  const paidEntries = entries.filter(e => e.isPaid === true)

  return {
    totalEntries: entries.length,
    unpaidCount: unpaidEntries.length,
    paidCount: paidEntries.length,
    totalOwed: calculateTotalOwed(entries),
    totalPaid: paidEntries.reduce((sum, e) => sum + (e.calculatedTotal || 0), 0),
  }
}
