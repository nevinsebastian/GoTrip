/** Strip formatting so phone values match the auth API (digits only). */
export function normalizePhoneForApi(phone: string): string {
  return phone.replace(/\D/g, '');
}
