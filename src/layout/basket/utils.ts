export function getApplicableUnitPrice(
    basePrice: number,
    quantity: number,
    discounts: { quantity: number; price: number }[]
  ): number {
    let applicablePrice = basePrice;
  
    if (discounts && discounts.length > 0) {
      const eligibleDiscounts = discounts.filter(discount => quantity >= discount.quantity);
  
      if (eligibleDiscounts.length > 0) {
        const bestDiscount = eligibleDiscounts.reduce((prev, curr) =>
          curr.price < prev.price ? curr : prev
        );
        applicablePrice = bestDiscount.price;
      }
    }
  
    return applicablePrice;
  }
  
  export function calculateTotalPrice(
    basePrice: number,
    quantity: number,
    unit: string,
    step: number,
    discounts: { quantity: number; price: number }[]
  ): number {
    const applicablePrice = getApplicableUnitPrice(basePrice, quantity, discounts);
    return unit === 'g' ? applicablePrice * (quantity / step) : applicablePrice * quantity;
  }
  