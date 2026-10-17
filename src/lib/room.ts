export type SimpleRoom = {
  code: string;
  [key: string]: unknown;
};

/**
 * Normalisasi dan pencarian room dengan toleransi prefix.
 * Mendukung kode penuh "CERDAS4K9A", akhiran 4 karakter "4K9A",
 * huruf kecil "cerdas4k9a", maupun format berspasi/tanda hubung.
 */
export function findRoom<T extends SimpleRoom>(
  rooms: Record<string, T> | undefined,
  inputCode?: string,
): T | undefined {
  if (!rooms || !inputCode) return undefined;
  const clean = inputCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!clean) return undefined;

  // 1. Cocok langsung dengan key (misal "CERDAS4K9A")
  if (rooms[clean]) return rooms[clean];

  // 2. Cocok jika user hanya memasukkan akhiran 4 karakter ("4K9A" -> "CERDAS4K9A")
  if (rooms[`CERDAS${clean}`]) return rooms[`CERDAS${clean}`];

  // 3. Iterasi nilai room jika key berbeda dari property .code
  const withoutPrefix = clean.replace(/^CERDAS/, "");
  for (const r of Object.values(rooms)) {
    if (!r || !r.code) continue;
    const roomClean = r.code.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (roomClean === clean) return r;
    if (withoutPrefix && roomClean.replace(/^CERDAS/, "") === withoutPrefix) {
      return r;
    }
  }
  return undefined;
}
