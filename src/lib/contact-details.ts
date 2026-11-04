export function formatPhoneNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("211") && digits.length === 12) {
    return `+211 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
  }

  return phone.trim();
}
