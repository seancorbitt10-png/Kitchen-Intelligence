import { describe, expect, it } from "vitest";
import { canonicalIngredientName, pantryMatchScore, safeJson, scaleMeal } from "./domain";

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

  it("scales ingredient quantities and preserves missing ingredients", () => {
    const result = scaleMeal({ servings: 2, ingredients: [{ name: "rice", quantity: 1, unit: "cup" }], missingIngredients: ["lime"] }, 4);
    expect(result.servings).toBe(4);
    expect(result.ingredients[0]?.quantity).toBe(2);
    expect(result.missingIngredients).toEqual(["lime"]);
  });
});
