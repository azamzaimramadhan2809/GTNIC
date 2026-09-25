import type { Product } from '../types/store';

export interface CartOrderPayload {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface CustomerOrderInfo {
  name?: string;
  address?: string;
  notes?: string;
}

/**
 * Sanitizes an Indonesian phone number to international wa.me format (62...)
 */
export function sanitizeWhatsAppNumber(phoneNumber: string): string {
  let clean = phoneNumber.replace(/[^0-9]/g, '');
  if (clean.startsWith('0')) {
    clean = '62' + clean.slice(1);
  } else if (!clean.startsWith('62') && clean.length > 0) {
    clean = '62' + clean;
  }
  return clean;
}

/**
 * Formats a number to Indonesian Rupiah currency string (e.g. Rp84.000)
 */
export function formatRupiah(amount: number): string {
  return 'Rp' + amount.toLocaleString('id-ID');
}

/**
 * Builds a direct WhatsApp order URL with pre-filled message
 */
export function buildWhatsAppUrl(
  phoneNumber: string,
  storeName: string,
  cartItems: Array<CartOrderPayload>,
  customerInfo?: CustomerOrderInfo
): string {
  const cleanPhone = sanitizeWhatsAppNumber(phoneNumber);
  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  let message = `Halo *${storeName || 'Penjual'}*, saya ingin memesan:\n`;

  cartItems.forEach((item) => {
    const itemTotal = item.product.price * item.quantity;
    message += `- ${item.quantity}x ${item.product.name} (${formatRupiah(itemTotal)})\n`;
    if (item.notes && item.notes.trim()) {
      message += `  _Catatan: ${item.notes.trim()}_\n`;
    }
  });

  message += `\nTotal Pembayaran: *${formatRupiah(total)}*`;

  if (customerInfo?.name?.trim()) {
    message += `\n👤 Nama Pemesan: ${customerInfo.name.trim()}`;
  }
  if (customerInfo?.address?.trim()) {
    message += `\n📍 Alamat / No. Meja: ${customerInfo.address.trim()}`;
  }
  if (customerInfo?.notes?.trim()) {
    message += `\n📝 Catatan Tambahan: ${customerInfo.notes.trim()}`;
  }

  message += `\n\nMohon konfirmasi ketersediaan pesanan. Terima kasih! 🙏`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds a quick single product direct order URL
 */
export function buildSingleProductWhatsAppUrl(
  phoneNumber: string,
  storeName: string,
  product: Product,
  quantity: number = 1,
  notes?: string
): string {
  return buildWhatsAppUrl(
    phoneNumber,
    storeName,
    [{ product, quantity, notes }]
  );
}

export default buildWhatsAppUrl;
