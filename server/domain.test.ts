import { describe, expect, it } from "vitest";
import { canonicalIngredientName, pantryMatchScore, safeJson, scaleMeal, scoreRecommendation, entitlementAllowed, consolidateMissingIngredients } from "./domain";

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

  it("hard-filters allergy conflicts and rewards pantry fit", () => {
    expect(scoreRecommendation({ pantryMatches: 3, ingredientCount: 4, missingIngredients: 1, expiresSoon: 1, preferenceFit: 1, allergyConflict: false })).toBeGreaterThan(0);
    expect(scoreRecommendation({ pantryMatches: 4, ingredientCount: 4, missingIngredients: 0, expiresSoon: 1, preferenceFit: 1, allergyConflict: true })).toBe(-Infinity);
  });

  it("enforces free limits while allowing paid plans through", () => {
    expect(entitlementAllowed("free", 7, 8)).toBe(true);
    expect(entitlementAllowed("free", 8, 8)).toBe(false);
    expect(entitlementAllowed("plus", 999, 8)).toBe(true);
  });

  it("consolidates scaled missing ingredients", () => {
    expect(consolidateMissingIngredients([{ name: "Lime", quantity: 2, unit: "each" }, { name: " lime ", quantity: 1, unit: "each" }])).toEqual([{ name: "Lime", quantity: 3, unit: "each" }]);
  });
});
