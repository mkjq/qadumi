import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhone(phone: string) {
  return phone.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3');
}

export function whatsappLink(phone: string, message?: string) {
  const cleaned = phone.replace(/\D/g, '');
  const jordanian = cleaned.startsWith('0') ? '962' + cleaned.slice(1) : cleaned;
  const msg = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${jordanian}${msg ? `?text=${msg}` : ''}`;
}
