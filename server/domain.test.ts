import { describe, expect, it } from "vitest";
import { canonicalIngredientName, pantryMatchScore, safeJson, scaleMeal, scoreRecommendation, entitlementAllowed, consolidateMissingIngredients, validateMealResult, validateWeeklyResult, validateScanCandidates } from "./domain";

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

  it("enforces finite limits for every plan", () => {
    expect(entitlementAllowed("free", 0, 0)).toBe(false);
    expect(entitlementAllowed("plus", 34, 35)).toBe(true);
    expect(entitlementAllowed("plus", 35, 35)).toBe(false);
    expect(entitlementAllowed("pro", 79, 80)).toBe(true);
    expect(entitlementAllowed("pro", 80, 80)).toBe(false);
  });

  it("consolidates scaled missing ingredients", () => {
    expect(consolidateMissingIngredients([{ name: "Lime", quantity: 2, unit: "each" }, { name: " lime ", quantity: 1, unit: "each" }])).toEqual([{ name: "Lime", quantity: 3, unit: "each" }]);
  });

  it("rejects impossible structured meal payloads", () => {
    expect(validateMealResult({ title: "", description: "", servings: 0, prepTime: -1, cookTime: 10, ingredients: [], instructions: [], missingIngredients: [], substitutions: [], dietaryTags: [] })).toBe(false);
    expect(validateMealResult({ title: "Pasta", description: "Simple", servings: 2, prepTime: 10, cookTime: 10, difficulty: "easy", occasion: "Everyday", ingredients: [{ name: "pasta", quantity: 1, unit: "cup", pantryMatch: true }], instructions: ["Cook"], missingIngredients: [], substitutions: [], dietaryTags: [] })).toBe(true);
  });

  it("rejects malformed weekly and scan payloads", () => {
    expect(validateWeeklyResult({ days: [], groceryList: [], leftoverPlan: [] })).toBe(false);
    expect(validateScanCandidates({ candidates: [{ name: "mystery", category: "other", quantity: 0, unit: "item", confidence: 1.2, variants: [] }] })).toBe(false);
    expect(validateScanCandidates({ candidates: [{ name: "tomato", category: "produce", quantity: 2, unit: "each", confidence: 0.9, variants: [] }] })).toBe(true);
  });
});
