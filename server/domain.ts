export function canonicalIngredientName(name: string) { return name.trim().toLowerCase().replace(/\s+/g, " "); }
export function safeJson<T>(value: string | null | undefined, fallback: T): T { try { return value ? JSON.parse(value) as T : fallback; } catch { return fallback; } }
export function pantryMatchScore(ingredient: string, pantryNames: string[]) { const target = canonicalIngredientName(ingredient); return pantryNames.some(name => { const candidate = canonicalIngredientName(name); return candidate === target || candidate.includes(target) || target.includes(candidate); }) ? 1 : 0; }

export type ScalableMeal = { servings: number; ingredients: Array<{ name: string; quantity: number; unit: string; pantryMatch?: boolean }>; missingIngredients?: string[] };
export function scaleMeal(meal: ScalableMeal, servings: number) { const factor = servings / meal.servings; return { ...meal, servings, ingredients: meal.ingredients.map(item => ({ ...item, quantity: Number((item.quantity * factor).toFixed(2)) })), missingIngredients: (meal.missingIngredients ?? []).map(name => name) }; }
