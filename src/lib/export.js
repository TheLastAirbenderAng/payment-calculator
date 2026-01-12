/**
 * Format a single entry for CSV export
 * @param {Object} entry - Entry object from Firestore
 * @returns {Object} Formatted entry for CSV
 */
export function formatEntryForCsv(entry) {
  // Format date
  const date = entry.createdAt?.toDate 
    ? entry.createdAt.toDate() 
    : new Date(entry.createdAt)
  const dateStr = date.toISOString().split('T')[0]

  // Format items list
  const itemsList = entry.items && entry.items.length > 0
    ? entry.items.map(item => `${item.name} (${item.quantity})`).join(', ')
    : ''

  return {
    date: dateStr,
    situation: entry.situation || '',
    payer: entry.payerName || '',
    total: entry.calculatedTotal || 0,
    currency: entry.currency || 'PHP',
    status: entry.isPaid ? 'Paid' : 'Unpaid',
    items: itemsList,
  }
}

/**
 * Escape a value for CSV (handle commas, quotes, newlines)
 * @param {any} value - Value to escape
 * @returns {string} Escaped value
 */
function escapeCsvValue(value) {
  const str = String(value)
  // If contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

/**
 * Convert array of entries to CSV string
 * @param {Array} entries - Array of entry objects
 * @returns {string} CSV string
 */
export function entriesToCsv(entries) {
  const headers = ['Date', 'Situation', 'Payer', 'Total', 'Currency', 'Status', 'Items']
  
  if (entries.length === 0) {
    return headers.join(',')
  }

  const rows = entries.map(entry => {
    const formatted = formatEntryForCsv(entry)
    return [
      escapeCsvValue(formatted.date),
      escapeCsvValue(formatted.situation),
      escapeCsvValue(formatted.payer),
      escapeCsvValue(formatted.total),
      escapeCsvValue(formatted.currency),
      escapeCsvValue(formatted.status),
      escapeCsvValue(formatted.items),
    ].join(',')
  })

  return [headers.join(','), ...rows].join('\n')
}

/**
 * Trigger download of CSV file
 * @param {string} csvContent - CSV content string
 * @param {string} filename - Name of file to download
 */
export function downloadCsv(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  
  // Clean up
  URL.revokeObjectURL(url)
}
