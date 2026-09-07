export const PHONE_PREFIX = '+38';

export function extractUkrainianPhoneDigits(value = '') {
  let digits = String(value).replace(/\D/g, '');
  if (digits.startsWith('38')) digits = digits.slice(2);
  return digits.slice(0, 10);
}

export function formatUkrainianPhone(value = '') {
  const digits = extractUkrainianPhoneDigits(value);
  return `${PHONE_PREFIX}${digits}`;
}

export function isValidUkrainianPhone(value = '') {
  return /^0\d{9}$/.test(extractUkrainianPhoneDigits(value));
}
