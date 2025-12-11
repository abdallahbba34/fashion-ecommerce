export function cn(...inputs: (string | undefined | null | boolean)[]) {
  return inputs.filter(Boolean).join(' ');
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: 'DZD',
  }).format(price);
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `ORD-${timestamp}-${random}`.toUpperCase();
}

export function calculateShippingCost(wilaya: string, subtotal: number): number {
  // Shipping costs by wilaya (example)
  const metropolitanWilayas = [
    'Alger', 'Blida', 'Boumerdès', 'Tipaza', 'Aïn Defla', 'Médéa'
  ];

  if (metropolitanWilayas.includes(wilaya)) {
    return subtotal > 5000 ? 0 : 500; // Free shipping over 5000 DZD
  }

  return subtotal > 8000 ? 0 : 800; // Free shipping over 8000 DZD for other wilayas
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
