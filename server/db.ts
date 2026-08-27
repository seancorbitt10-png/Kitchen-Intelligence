import { and, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, analyticsEvents, mealInteractions, meals, pantryItems, pantryScans, shoppingItems, subscriptions, usageEvents, userProfiles, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

/**
 * The managed runtime normally provides DATABASE_URL. Keeping a small, typed
 * fallback here makes local previews and contract tests useful without
 * pretending that data is durable when persistence is unavailable.
 */
type PantryRow = typeof pantryItems.$inferSelect;
type MealRow = typeof meals.$inferSelect;
type ShoppingRow = typeof shoppingItems.$inferSelect;
type ProfileRow = typeof userProfiles.$inferSelect;
type InteractionRow = typeof mealInteractions.$inferSelect;
type ScanRow = typeof pantryScans.$inferSelect;
type SubscriptionRow = typeof subscriptions.$inferSelect;
type UsageRow = typeof usageEvents.$inferSelect;
type AnalyticsRow = typeof analyticsEvents.$inferSelect;

const fallback = {
  pantry: [] as PantryRow[],
  scans: [] as ScanRow[],
  meals: [] as MealRow[],
  interactions: [] as InteractionRow[],
  shopping: [] as ShoppingRow[],
  subscriptions: [] as SubscriptionRow[],
  usage: [] as UsageRow[],
  analytics: [] as AnalyticsRow[],
  profiles: [] as ProfileRow[],
};
let nextFallbackId = 1;
const fallbackId = () => nextFallbackId++;
const now = () => new Date();
const quantity = (value: unknown) => Number(value ?? 0).toFixed(2);
const confidence = (value: unknown) => Number(value ?? 1).toFixed(3);

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb(); if (!db) return;
  const values: InsertUser = { openId: user.openId, name: user.name ?? null, email: user.email ?? null, loginMethod: user.loginMethod ?? null, lastSignedIn: user.lastSignedIn ?? new Date() };
  const updateSet: Record<string, unknown> = { name: values.name, email: values.email, loginMethod: values.loginMethod, lastSignedIn: values.lastSignedIn };
  if (user.role || user.openId === ENV.ownerOpenId) { values.role = user.role ?? "admin"; updateSet.role = values.role; }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}
export async function getUserByOpenId(openId: string) { const db = await getDb(); if (!db) return undefined; const rows = await db.select().from(users).where(eq(users.openId, openId)).limit(1); return rows[0]; }
export async function getProfile(userId: number) { const db = await getDb(); if (!db) return fallback.profiles.find(row => row.userId === userId) ?? null; const rows = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1); return rows[0] ?? null; }
export async function saveProfile(userId: number, data: Omit<typeof userProfiles.$inferInsert, "userId">) {
  const db = await getDb();
  if (!db) {
    const timestamp = now();
    const existing = fallback.profiles.find(row => row.userId === userId);
    const saved = {
      id: existing?.id ?? fallbackId(),
      userId,
      householdSize: data.householdSize ?? existing?.householdSize ?? 2,
      dietaryPreferences: data.dietaryPreferences ?? existing?.dietaryPreferences ?? "[]",
      allergies: data.allergies ?? existing?.allergies ?? "[]",
      cuisinePreferences: data.cuisinePreferences ?? existing?.cuisinePreferences ?? "[]",
      dislikes: data.dislikes ?? existing?.dislikes ?? "[]",
      skillLevel: data.skillLevel ?? existing?.skillLevel ?? "beginner",
      cookingTime: data.cookingTime ?? existing?.cookingTime ?? "15-30",
      budget: data.budget ?? existing?.budget ?? "moderate",
      mealPriorities: data.mealPriorities ?? existing?.mealPriorities ?? "[]",
      onboardingComplete: data.onboardingComplete ?? existing?.onboardingComplete ?? false,
      createdAt: existing?.createdAt ?? timestamp,
      updatedAt: timestamp,
    } as ProfileRow;
    if (existing) Object.assign(existing, saved); else fallback.profiles.push(saved);
    return saved;
  }
  const existing = await getProfile(userId); if (existing) { await db.update(userProfiles).set({ ...data, updatedAt: new Date() }).where(eq(userProfiles.userId, userId)); } else { await db.insert(userProfiles).values({ ...data, userId }); } return getProfile(userId);
}
export async function listPantry(userId: number) { const db = await getDb(); if (!db) return fallback.pantry.filter(row => row.userId === userId).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()); return db.select().from(pantryItems).where(eq(pantryItems.userId, userId)).orderBy(desc(pantryItems.updatedAt)); }
export async function getPantryItem(userId: number, id: number) { const db = await getDb(); if (!db) return fallback.pantry.find(row => row.userId === userId && row.id === id) ?? null; const rows = await db.select().from(pantryItems).where(and(eq(pantryItems.userId, userId), eq(pantryItems.id, id))).limit(1); return rows[0] ?? null; }
export async function addPantryItem(userId: number, item: Omit<typeof pantryItems.$inferInsert, "userId">) {
  const db = await getDb();
  if (!db) {
    const timestamp = now();
    const saved = { id: fallbackId(), userId, name: item.name, canonicalName: item.canonicalName ?? item.name.trim().toLowerCase(), category: item.category, quantity: quantity(item.quantity), unit: item.unit ?? "item", expirationDate: item.expirationDate ?? null, confidence: confidence(item.confidence), source: item.source ?? "manual", location: item.location ?? "pantry", createdAt: timestamp, updatedAt: timestamp } as PantryRow;
    fallback.pantry.push(saved);
    return saved;
  }
  await db.insert(pantryItems).values({ ...item, userId }); const rows = await db.select().from(pantryItems).where(eq(pantryItems.userId, userId)).orderBy(desc(pantryItems.id)).limit(1); return rows[0] ?? null;
}
export async function updatePantryItem(userId: number, id: number, data: Partial<typeof pantryItems.$inferInsert>) {
  const db = await getDb();
  if (!db) {
    const existing = fallback.pantry.find(row => row.userId === userId && row.id === id); if (!existing) return null;
    Object.assign(existing, { ...data, ...(data.quantity !== undefined ? { quantity: quantity(data.quantity) } : {}), ...(data.confidence !== undefined ? { confidence: confidence(data.confidence) } : {}), updatedAt: now() });
    return existing;
  }
  await db.update(pantryItems).set({ ...data, updatedAt: new Date() }).where(and(eq(pantryItems.userId, userId), eq(pantryItems.id, id))); return getPantryItem(userId, id);
}
export async function deletePantryItem(userId: number, id: number) { const db = await getDb(); if (!db) { const index = fallback.pantry.findIndex(row => row.userId === userId && row.id === id); if (index >= 0) fallback.pantry.splice(index, 1); return index >= 0; } await db.delete(pantryItems).where(and(eq(pantryItems.userId, userId), eq(pantryItems.id, id))); return true; }
export async function saveScan(userId: number, imageCount: number, candidates: string) { const db = await getDb(); if (!db) { const timestamp = now(); fallback.scans.push({ id: fallbackId(), userId, imageCount, status: "confirmed", candidates, createdAt: timestamp } as ScanRow); return true; } await db.insert(pantryScans).values({ userId, imageCount, candidates, status: "confirmed" }); return true; }
export async function saveMeal(userId: number, title: string, description: string, payload: string) { const db = await getDb(); if (!db) { const timestamp = now(); const saved = { id: fallbackId(), userId, title, description, payload, source: "ai", createdAt: timestamp } as MealRow; fallback.meals.push(saved); return saved; } await db.insert(meals).values({ userId, title, description, payload, source: "ai" }); const rows = await db.select().from(meals).where(eq(meals.userId, userId)).orderBy(desc(meals.id)).limit(1); return rows[0] ?? null; }
export async function listMeals(userId: number) { const db = await getDb(); if (!db) return fallback.meals.filter(row => row.userId === userId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 20); return db.select().from(meals).where(eq(meals.userId, userId)).orderBy(desc(meals.createdAt)).limit(20); }
export async function addInteraction(userId: number, mealId: number, type: string, metadata = "{}") { const db = await getDb(); if (!db) { fallback.interactions.push({ id: fallbackId(), userId, mealId, type, metadata, createdAt: now() } as InteractionRow); return true; } await db.insert(mealInteractions).values({ userId, mealId, type, metadata }); return true; }
export async function listInteractions(userId: number) { const db = await getDb(); if (!db) return fallback.interactions.filter(row => row.userId === userId).sort((a, b) => b.id - a.id).slice(0, 200); return db.select().from(mealInteractions).where(eq(mealInteractions.userId, userId)).orderBy(desc(mealInteractions.id)).limit(200); }
export async function getLatestInteraction(userId: number, mealId: number, type: string) { const db = await getDb(); if (!db) return fallback.interactions.filter(row => row.userId === userId && row.mealId === mealId && row.type === type).sort((a, b) => b.id - a.id)[0] ?? null; const rows = await db.select().from(mealInteractions).where(and(eq(mealInteractions.userId, userId), eq(mealInteractions.mealId, mealId), eq(mealInteractions.type, type))).orderBy(desc(mealInteractions.id)).limit(1); return rows[0] ?? null; }
export async function deleteInteraction(userId: number, id: number) { const db = await getDb(); if (!db) { const index = fallback.interactions.findIndex(row => row.userId === userId && row.id === id); if (index >= 0) fallback.interactions.splice(index, 1); return index >= 0; } await db.delete(mealInteractions).where(and(eq(mealInteractions.userId, userId), eq(mealInteractions.id, id))); return true; }
export async function listShopping(userId: number) { const db = await getDb(); if (!db) return fallback.shopping.filter(row => row.userId === userId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); return db.select().from(shoppingItems).where(eq(shoppingItems.userId, userId)).orderBy(desc(shoppingItems.createdAt)); }
export async function addShopping(userId: number, item: Omit<typeof shoppingItems.$inferInsert, "userId">) { const db = await getDb(); if (!db) { const timestamp = now(); fallback.shopping.push({ id: fallbackId(), userId, name: item.name, quantity: quantity(item.quantity), unit: item.unit ?? "item", mealTitle: item.mealTitle ?? null, checked: item.checked ?? false, createdAt: timestamp, updatedAt: timestamp } as ShoppingRow); return true; } await db.insert(shoppingItems).values({ ...item, userId }); return true; }
export async function updateShopping(userId: number, id: number, data: Partial<typeof shoppingItems.$inferInsert>) { const db = await getDb(); if (!db) { const existing = fallback.shopping.find(row => row.userId === userId && row.id === id); if (!existing) return false; Object.assign(existing, { ...data, ...(data.quantity !== undefined ? { quantity: quantity(data.quantity) } : {}), updatedAt: now() }); return true; } await db.update(shoppingItems).set({ ...data, updatedAt: new Date() }).where(and(eq(shoppingItems.userId, userId), eq(shoppingItems.id, id))); return true; }
export async function deleteShopping(userId: number, id: number) { const db = await getDb(); if (!db) { const index = fallback.shopping.findIndex(row => row.userId === userId && row.id === id); if (index >= 0) fallback.shopping.splice(index, 1); return index >= 0; } await db.delete(shoppingItems).where(and(eq(shoppingItems.userId, userId), eq(shoppingItems.id, id))); return true; }
export async function logUsage(userId: number, data: Omit<typeof usageEvents.$inferInsert, "userId">) { const db = await getDb(); if (!db) { fallback.usage.push({ id: fallbackId(), userId, operation: data.operation, provider: data.provider, model: data.model ?? null, inputTokens: data.inputTokens ?? 0, outputTokens: data.outputTokens ?? 0, estimatedCost: quantity(data.estimatedCost), success: data.success ?? true, createdAt: now() } as UsageRow); return true; } await db.insert(usageEvents).values({ ...data, userId }); return true; }
export async function logAnalytics(userId: number | null, eventName: string, metadata = "{}") { const db = await getDb(); if (!db) { fallback.analytics.push({ id: fallbackId(), userId, eventName, metadata, createdAt: now() } as AnalyticsRow); return true; } await db.insert(analyticsEvents).values({ userId, eventName, metadata }); return true; }
export async function getSubscription(userId: number) { const db = await getDb(); if (!db) return fallback.subscriptions.find(row => row.userId === userId) ?? { plan: "free", status: "active" }; const rows = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1); return rows[0] ?? { plan: "free", status: "active" }; }
export async function usageThisMonth(userId: number, operation: string) { const db = await getDb(); if (!db) { const monthStart = new Date(); monthStart.setDate(1); return fallback.usage.filter(row => row.userId === userId && row.operation === operation && row.createdAt >= monthStart).length; } const since = new Date(); since.setDate(1); const rows = await db.select({ count: sql<number>`count(*)` }).from(usageEvents).where(and(eq(usageEvents.userId, userId), eq(usageEvents.operation, operation), sql`${usageEvents.createdAt} >= ${since}`)); return Number(rows[0]?.count ?? 0); }
export async function adminSummary() { const db = await getDb(); if (!db) { const failedOperations = fallback.usage.filter(row => !row.success).length; const aiOperations = fallback.usage.length; const subscriptionMix = fallback.subscriptions.reduce<Record<string, number>>((acc, row) => { const key = `${row.plan}:${row.status}`; acc[key] = (acc[key] ?? 0) + 1; return acc; }, {}); return { users: 0, meals: fallback.meals.length, pantryItems: fallback.pantry.length, aiOperations, subscriptions: fallback.subscriptions.length, failedOperations, analyticsEvents: fallback.analytics.length, failureRate: aiOperations ? failedOperations / aiOperations : 0, mealGenerationConversion: fallback.analytics.length ? fallback.meals.length / fallback.analytics.length : 0, subscriptionMix }; } const [u, m, p, a, s, f, e, subscriptionRows] = await Promise.all([db.select({ count: sql<number>`count(*)` }).from(users), db.select({ count: sql<number>`count(*)` }).from(meals), db.select({ count: sql<number>`count(*)` }).from(pantryItems), db.select({ count: sql<number>`count(*)` }).from(usageEvents), db.select({ count: sql<number>`count(*)` }).from(subscriptions), db.select({ count: sql<number>`count(*)` }).from(usageEvents).where(eq(usageEvents.success, false)), db.select({ count: sql<number>`count(*)` }).from(analyticsEvents), db.select({ plan: subscriptions.plan, status: subscriptions.status }).from(subscriptions)]); const subscriptionMix = subscriptionRows.reduce<Record<string, number>>((acc, row) => { const key = `${row.plan}:${row.status}`; acc[key] = (acc[key] ?? 0) + 1; return acc; }, {}); const aiOperations = Number(a[0]?.count ?? 0); const failedOperations = Number(f[0]?.count ?? 0); const analyticsEventCount = Number(e[0]?.count ?? 0); return { users: Number(u[0]?.count ?? 0), meals: Number(m[0]?.count ?? 0), pantryItems: Number(p[0]?.count ?? 0), aiOperations, subscriptions: Number(s[0]?.count ?? 0), failedOperations, failureRate: aiOperations ? failedOperations / aiOperations : 0, analyticsEvents: analyticsEventCount, mealGenerationConversion: analyticsEventCount ? Number(m[0]?.count ?? 0) / analyticsEventCount : 0, subscriptionMix }; }

export async function exportUserData(userId: number) {
  const db = await getDb();
  if (!db) {
    return { profile: fallback.profiles.filter(row => row.userId === userId), pantry: fallback.pantry.filter(row => row.userId === userId), meals: fallback.meals.filter(row => row.userId === userId), shopping: fallback.shopping.filter(row => row.userId === userId), interactions: fallback.interactions.filter(row => row.userId === userId), usage: fallback.usage.filter(row => row.userId === userId), analytics: fallback.analytics.filter(row => row.userId === userId), scans: fallback.scans.filter(row => row.userId === userId), subscriptions: fallback.subscriptions.filter(row => row.userId === userId).map(({ id, userId: _userId, plan, status, currentPeriodEnd, createdAt, updatedAt }) => ({ id, plan, status, currentPeriodEnd, createdAt, updatedAt })), exportedAt: new Date().toISOString() };
  }
  const [profile, pantry, mealsRows, shopping, interactions, usage, analytics, scans, subscriptionsRows] = await Promise.all([
    db.select().from(userProfiles).where(eq(userProfiles.userId, userId)),
    db.select().from(pantryItems).where(eq(pantryItems.userId, userId)),
    db.select().from(meals).where(eq(meals.userId, userId)),
    db.select().from(shoppingItems).where(eq(shoppingItems.userId, userId)),
    db.select().from(mealInteractions).where(eq(mealInteractions.userId, userId)),
    db.select().from(usageEvents).where(eq(usageEvents.userId, userId)),
    db.select().from(analyticsEvents).where(eq(analyticsEvents.userId, userId)),
    db.select().from(pantryScans).where(eq(pantryScans.userId, userId)),
    db.select().from(subscriptions).where(eq(subscriptions.userId, userId)),
  ]);
  const safeSubscriptions = subscriptionsRows.map(({ id, userId: _userId, plan, status, currentPeriodEnd, createdAt, updatedAt }) => ({ id, plan, status, currentPeriodEnd, createdAt, updatedAt }));
  return { profile, pantry, meals: mealsRows, shopping, interactions, usage, analytics, scans, subscriptions: safeSubscriptions, exportedAt: new Date().toISOString() };
}

export async function deleteUserAccount(userId: number) {
  const db = await getDb();
  if (!db) {
    fallback.analytics = fallback.analytics.filter(row => row.userId !== userId);
    fallback.usage = fallback.usage.filter(row => row.userId !== userId);
    fallback.interactions = fallback.interactions.filter(row => row.userId !== userId);
    fallback.meals = fallback.meals.filter(row => row.userId !== userId);
    fallback.shopping = fallback.shopping.filter(row => row.userId !== userId);
    fallback.scans = fallback.scans.filter(row => row.userId !== userId);
    fallback.pantry = fallback.pantry.filter(row => row.userId !== userId);
    fallback.subscriptions = fallback.subscriptions.filter(row => row.userId !== userId);
    fallback.profiles = fallback.profiles.filter(row => row.userId !== userId);
    return true;
  }
  await db.transaction(async tx => {
    await tx.delete(analyticsEvents).where(eq(analyticsEvents.userId, userId));
    await tx.delete(usageEvents).where(eq(usageEvents.userId, userId));
    await tx.delete(mealInteractions).where(eq(mealInteractions.userId, userId));
    await tx.delete(meals).where(eq(meals.userId, userId));
    await tx.delete(shoppingItems).where(eq(shoppingItems.userId, userId));
    await tx.delete(pantryScans).where(eq(pantryScans.userId, userId));
    await tx.delete(pantryItems).where(eq(pantryItems.userId, userId));
    await tx.delete(subscriptions).where(eq(subscriptions.userId, userId));
    await tx.delete(userProfiles).where(eq(userProfiles.userId, userId));
    await tx.delete(users).where(eq(users.id, userId));
  });
  return true;
}
