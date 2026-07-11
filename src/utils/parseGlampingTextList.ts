export function parseGlampingTextList(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.replace(/^[\s•\-*]+/, '').trim())
    .filter(Boolean);
}

export function formatGlampingTextList(items?: string[]): string {
  if (!items?.length) return '';
  return items.map((item) => `• ${item}`).join('\n');
}
