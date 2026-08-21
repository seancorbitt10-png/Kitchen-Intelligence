export function canonicalIngredientName(name: string) { return name.trim().toLowerCase().replace(/\s+/g, " "); }
export function safeJson<T>(value: string | null | undefined, fallback: T): T { try { return value ? JSON.parse(value) as T : fallback; } catch { return fallback; } }
export function pantryMatchScore(ingredient: string, pantryNames: string[]) { const target = canonicalIngredientName(ingredient); return pantryNames.some(name => { const candidate = canonicalIngredientName(name); return candidate === target || candidate.includes(target) || target.includes(candidate); }) ? 1 : 0; }
