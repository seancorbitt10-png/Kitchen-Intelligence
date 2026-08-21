import { describe, expect, it } from "vitest";
import { MAX_SCAN_FILE_BYTES, filterPantryImages } from "../client/src/lib/imageValidation";

describe("pantry scan image validation", () => {
  it("accepts supported images and skips unsupported or oversized files", () => {
    const result = filterPantryImages([
      { type: "image/jpeg", size: 100 },
      { type: "text/plain", size: 100 },
      { type: "image/png", size: MAX_SCAN_FILE_BYTES + 1 },
    ]);
    expect(result.accepted).toHaveLength(1);
    expect(result.skipped).toBe(2);
  });

  it("caps a scan session at six files", () => {
    const result = filterPantryImages(Array.from({ length: 8 }, () => ({ type: "image/jpeg", size: 100 })));
    expect(result.accepted).toHaveLength(6);
    expect(result.skipped).toBe(0);
  });
});
