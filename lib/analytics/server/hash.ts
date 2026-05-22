import { createHash } from 'crypto';

/** SHA-256 hash for Meta CAPI / Google Enhanced Conversions (normalized). */
export function sha256Normalize(value: string): string {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return '';
  return createHash('sha256').update(normalized).digest('hex');
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('254')) return digits;
  if (digits.startsWith('0')) return `254${digits.slice(1)}`;
  if (digits.length === 9) return `254${digits}`;
  return digits;
}

export function hashEmail(email: string): string {
  return sha256Normalize(email);
}

export function hashPhone(phone: string): string {
  return sha256Normalize(normalizePhone(phone));
}
