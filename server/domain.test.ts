import { describe, expect, it } from "vitest";
import { canonicalIngredientName, pantryMatchScore, safeJson } from "./domain";

describe("kitchen domain utilities", () => {
  it("normalizes ingredient aliases without collapsing meaningful words", () => {
    expect(canonicalIngredientName("  Roma   Tomatoes ")).toBe("roma tomatoes");
    expect(canonicalIngredientName("Chicken-Breast")).toBe("chicken-breast");
  });

  it("never throws on malformed persisted JSON", () => {
    expect(safeJson("not-json", ["fallback"])).toEqual(["fallback"]);
    expect(safeJson('["spinach"]', [])).toEqual(["spinach"]);
  });

  it("matches pantry aliases conservatively enough for meal context", () => {
    expect(pantryMatchScore("tomato", ["Roma tomatoes"])).toBe(1);
    expect(pantryMatchScore("heavy cream", ["milk"])).toBe(0);
  });
});
