/**
 * Calculate total for guest mode (no user, no save)
 * @param {Array} items - Array of {name, price, quantity}
 * @param {Object|null} charges - Optional {serviceCharge, deliveryFee, splitAmong}
 * @returns {Object} {itemsSubtotal, chargesShare, total}
 */
export function calculateGuestTotal(items, charges = null) {
  // Calculate items subtotal
  const itemsSubtotal = items.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0
    const quantity = parseInt(item.quantity) || 0
    return sum + price * quantity
  }, 0)

  // Calculate charges share
  let chargesShare = 0
  if (charges) {
    const serviceCharge = parseFloat(charges.serviceCharge) || 0
    const deliveryFee = parseFloat(charges.deliveryFee) || 0
    const splitAmong = parseInt(charges.splitAmong) || 1
    chargesShare = (serviceCharge + deliveryFee) / splitAmong
  }

  return {
    itemsSubtotal,
    chargesShare,
    total: itemsSubtotal + chargesShare,
  }
}

/**
 * Validate guest items - at least one item with name and positive price
 * @param {Array} items - Array of {name, price, quantity}
 * @returns {boolean} True if valid
 */
export function validateGuestItems(items) {
  if (!items || items.length === 0) {
    return false
  }

  const validItems = items.filter((item) => {
    const hasName = item.name && item.name.trim().length > 0
    const hasPrice = parseFloat(item.price) > 0
    return hasName && hasPrice
  })

  return validItems.length > 0
}
