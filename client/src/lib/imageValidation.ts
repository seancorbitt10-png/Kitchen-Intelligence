export const MAX_SCAN_FILE_BYTES = 8 * 1024 * 1024;

export function filterPantryImages<T extends { type: string; size: number }>(files: readonly T[], maxFiles = 6) {
  const considered = files.slice(0, maxFiles);
  const accepted = considered.filter(file => file.type.startsWith("image/") && file.size <= MAX_SCAN_FILE_BYTES);
  return { accepted, skipped: considered.length - accepted.length };
}
