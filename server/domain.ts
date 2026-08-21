export function canonicalIngredientName(name: string) { return name.trim().toLowerCase().replace(/\s+/g, " "); }
export function safeJson<T>(value: string | null | undefined, fallback: T): T { try { return value ? JSON.parse(value) as T : fallback; } catch { return fallback; } }
export function pantryMatchScore(ingredient: string, pantryNames: string[]) { const target = canonicalIngredientName(ingredient); return pantryNames.some(name => { const candidate = canonicalIngredientName(name); return candidate === target || candidate.includes(target) || target.includes(candidate); }) ? 1 : 0; }

export type ScalableMeal = { servings: number; ingredients: Array<{ name: string; quantity: number; unit: string; pantryMatch?: boolean }>; missingIngredients?: string[] };
export function scaleMeal(meal: ScalableMeal, servings: number) { const factor = servings / meal.servings; return { ...meal, servings, ingredients: meal.ingredients.map(item => ({ ...item, quantity: Number((item.quantity * factor).toFixed(2)) })), missingIngredients: (meal.missingIngredients ?? []).map(name => name) }; }

export type RecommendationSignals = { pantryMatches: number; ingredientCount: number; missingIngredients: number; expiresSoon: number; preferenceFit: number; allergyConflict: boolean };
export function scoreRecommendation(signals: RecommendationSignals) { if (signals.allergyConflict) return -Infinity; const pantry = signals.ingredientCount ? signals.pantryMatches / signals.ingredientCount : 0; const missingPenalty = signals.ingredientCount ? signals.missingIngredients / signals.ingredientCount : 0; return pantry * 50 + signals.expiresSoon * 12 + signals.preferenceFit * 20 - missingPenalty * 25; }

export function entitlementAllowed(plan: "free" | "plus" | "pro", used: number, limit: number) { return plan !== "free" || used < limit; }

export function consolidateMissingIngredients(missing: Array<{ name: string; quantity: number; unit: string }>) { const result = new Map<string, { name: string; quantity: number; unit: string }>(); for (const item of missing) { const key = canonicalIngredientName(item.name); const existing = result.get(key); result.set(key, existing ? { ...existing, quantity: existing.quantity + item.quantity } : { ...item }); } return Array.from(result.values()); }

export function validateMealResult(value: any) {
  if (!value || typeof value.title !== "string" || !value.title.trim() || typeof value.description !== "string") return false;
  if (!Number.isInteger(value.servings) || value.servings < 1 || value.servings > 50) return false;
  if (!["prepTime", "cookTime"].every(key => Number.isInteger(value[key]) && value[key] >= 0 && value[key] <= 1440)) return false;
  if (!Array.isArray(value.ingredients) || value.ingredients.length === 0 || !Array.isArray(value.instructions) || value.instructions.length === 0) return false;
  if (!value.ingredients.every((item: any) => item && typeof item.name === "string" && item.name.trim() && typeof item.unit === "string" && item.unit.trim() && Number.isFinite(item.quantity) && item.quantity > 0 && typeof item.pantryMatch === "boolean")) return false;
  if (!Array.isArray(value.missingIngredients) || !value.missingIngredients.every((item: any) => typeof item === "string")) return false;
  if (!Array.isArray(value.substitutions) || !value.substitutions.every((item: any) => typeof item === "string")) return false;
  if (!Array.isArray(value.dietaryTags) || !value.dietaryTags.every((item: any) => typeof item === "string")) return false;
  return value.instructions.every((item: any) => typeof item === "string" && item.trim());
}

export function validateWeeklyResult(value: any) {
  return Boolean(value && Array.isArray(value.days) && value.days.length >= 3 && value.days.every((day: any) => day && typeof day.day === "string" && typeof day.title === "string") && Array.isArray(value.groceryList) && Array.isArray(value.leftoverPlan));
}

export function validateScanCandidates(value: any) {
  return Boolean(value && Array.isArray(value.candidates) && value.candidates.every((item: any) => item && typeof item.name === "string" && item.name.trim() && typeof item.category === "string" && Number.isFinite(item.quantity) && item.quantity > 0 && typeof item.unit === "string" && item.unit.trim() && Number.isFinite(item.confidence) && item.confidence >= 0 && item.confidence <= 1 && Array.isArray(item.variants) && item.variants.every((variant: any) => typeof variant === "string")));
}
