export function canonicalIngredientName(name: string) { return name.trim().toLowerCase().replace(/\s+/g, " "); }
export function safeJson<T>(value: string | null | undefined, fallback: T): T { try { return value ? JSON.parse(value) as T : fallback; } catch { return fallback; } }
export function pantryMatchScore(ingredient: string, pantryNames: string[]) { const target = canonicalIngredientName(ingredient); return pantryNames.some(name => { const candidate = canonicalIngredientName(name); return candidate === target || candidate.includes(target) || target.includes(candidate); }) ? 1 : 0; }

export type ScalableMeal = { servings: number; ingredients: Array<{ name: string; quantity: number; unit: string; pantryMatch?: boolean }>; missingIngredients?: string[] };
export function scaleMeal(meal: ScalableMeal, servings: number) { const factor = servings / meal.servings; return { ...meal, servings, ingredients: meal.ingredients.map(item => ({ ...item, quantity: Number((item.quantity * factor).toFixed(2)) })), missingIngredients: (meal.missingIngredients ?? []).map(name => name) }; }

export type RecommendationSignals = { pantryMatches: number; ingredientCount: number; missingIngredients: number; expiresSoon: number; preferenceFit: number; allergyConflict: boolean };
export function scoreRecommendation(signals: RecommendationSignals) { if (signals.allergyConflict) return -Infinity; const pantry = signals.ingredientCount ? signals.pantryMatches / signals.ingredientCount : 0; const missingPenalty = signals.ingredientCount ? signals.missingIngredients / signals.ingredientCount : 0; return pantry * 50 + signals.expiresSoon * 12 + signals.preferenceFit * 20 - missingPenalty * 25; }

export function entitlementAllowed(plan: "free" | "plus" | "pro", used: number, limit: number) { return plan !== "free" || used < limit; }

export function consolidateMissingIngredients(missing: Array<{ name: string; quantity: number; unit: string }>) { const result = new Map<string, { name: string; quantity: number; unit: string }>(); for (const item of missing) { const key = canonicalIngredientName(item.name); const existing = result.get(key); result.set(key, existing ? { ...existing, quantity: existing.quantity + item.quantity } : { ...item }); } return Array.from(result.values()); }
