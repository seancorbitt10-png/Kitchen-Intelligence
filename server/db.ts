import { and, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, analyticsEvents, mealInteractions, meals, pantryItems, pantryScans, shoppingItems, subscriptions, usageEvents, userProfiles, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;
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
export async function getProfile(userId: number) { const db = await getDb(); if (!db) return null; const rows = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1); return rows[0] ?? null; }
export async function saveProfile(userId: number, data: Omit<typeof userProfiles.$inferInsert, "userId">) { const db = await getDb(); if (!db) return null; const existing = await getProfile(userId); if (existing) { await db.update(userProfiles).set({ ...data, updatedAt: new Date() }).where(eq(userProfiles.userId, userId)); } else { await db.insert(userProfiles).values({ ...data, userId }); } return getProfile(userId); }
export async function listPantry(userId: number) { const db = await getDb(); if (!db) return []; return db.select().from(pantryItems).where(eq(pantryItems.userId, userId)).orderBy(desc(pantryItems.updatedAt)); }
export async function getPantryItem(userId: number, id: number) { const db = await getDb(); if (!db) return null; const rows = await db.select().from(pantryItems).where(and(eq(pantryItems.userId, userId), eq(pantryItems.id, id))).limit(1); return rows[0] ?? null; }
export async function addPantryItem(userId: number, item: Omit<typeof pantryItems.$inferInsert, "userId">) { const db = await getDb(); if (!db) return null; await db.insert(pantryItems).values({ ...item, userId }); const rows = await db.select().from(pantryItems).where(eq(pantryItems.userId, userId)).orderBy(desc(pantryItems.id)).limit(1); return rows[0] ?? null; }
export async function updatePantryItem(userId: number, id: number, data: Partial<typeof pantryItems.$inferInsert>) { const db = await getDb(); if (!db) return null; await db.update(pantryItems).set({ ...data, updatedAt: new Date() }).where(and(eq(pantryItems.userId, userId), eq(pantryItems.id, id))); return getPantryItem(userId, id); }
export async function deletePantryItem(userId: number, id: number) { const db = await getDb(); if (!db) return false; await db.delete(pantryItems).where(and(eq(pantryItems.userId, userId), eq(pantryItems.id, id))); return true; }
export async function saveScan(userId: number, imageCount: number, candidates: string) { const db = await getDb(); if (!db) return null; await db.insert(pantryScans).values({ userId, imageCount, candidates, status: "confirmed" }); return true; }
export async function saveMeal(userId: number, title: string, description: string, payload: string) { const db = await getDb(); if (!db) return null; await db.insert(meals).values({ userId, title, description, payload, source: "ai" }); const rows = await db.select().from(meals).where(eq(meals.userId, userId)).orderBy(desc(meals.id)).limit(1); return rows[0] ?? null; }
export async function listMeals(userId: number) { const db = await getDb(); if (!db) return []; return db.select().from(meals).where(eq(meals.userId, userId)).orderBy(desc(meals.createdAt)).limit(20); }
export async function addInteraction(userId: number, mealId: number, type: string, metadata = "{}") { const db = await getDb(); if (!db) return false; await db.insert(mealInteractions).values({ userId, mealId, type, metadata }); return true; }
export async function listInteractions(userId: number) { const db = await getDb(); if (!db) return []; return db.select().from(mealInteractions).where(eq(mealInteractions.userId, userId)).orderBy(desc(mealInteractions.id)).limit(200); }
export async function getLatestInteraction(userId: number, mealId: number, type: string) { const db = await getDb(); if (!db) return null; const rows = await db.select().from(mealInteractions).where(and(eq(mealInteractions.userId, userId), eq(mealInteractions.mealId, mealId), eq(mealInteractions.type, type))).orderBy(desc(mealInteractions.id)).limit(1); return rows[0] ?? null; }
export async function deleteInteraction(userId: number, id: number) { const db = await getDb(); if (!db) return false; await db.delete(mealInteractions).where(and(eq(mealInteractions.userId, userId), eq(mealInteractions.id, id))); return true; }
export async function listShopping(userId: number) { const db = await getDb(); if (!db) return []; return db.select().from(shoppingItems).where(eq(shoppingItems.userId, userId)).orderBy(desc(shoppingItems.createdAt)); }
export async function addShopping(userId: number, item: Omit<typeof shoppingItems.$inferInsert, "userId">) { const db = await getDb(); if (!db) return null; await db.insert(shoppingItems).values({ ...item, userId }); return true; }
export async function updateShopping(userId: number, id: number, data: Partial<typeof shoppingItems.$inferInsert>) { const db = await getDb(); if (!db) return false; await db.update(shoppingItems).set({ ...data, updatedAt: new Date() }).where(and(eq(shoppingItems.userId, userId), eq(shoppingItems.id, id))); return true; }
export async function deleteShopping(userId: number, id: number) { const db = await getDb(); if (!db) return false; await db.delete(shoppingItems).where(and(eq(shoppingItems.userId, userId), eq(shoppingItems.id, id))); return true; }
export async function logUsage(userId: number, data: Omit<typeof usageEvents.$inferInsert, "userId">) { const db = await getDb(); if (!db) return false; await db.insert(usageEvents).values({ ...data, userId }); return true; }
export async function logAnalytics(userId: number | null, eventName: string, metadata = "{}") { const db = await getDb(); if (!db) return false; await db.insert(analyticsEvents).values({ userId, eventName, metadata }); return true; }
export async function getSubscription(userId: number) { const db = await getDb(); if (!db) return { plan: "free", status: "active" }; const rows = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1); return rows[0] ?? { plan: "free", status: "active" }; }
export async function usageThisMonth(userId: number, operation: string) { const db = await getDb(); if (!db) return 0; const since = new Date(); since.setDate(1); const rows = await db.select({ count: sql<number>`count(*)` }).from(usageEvents).where(and(eq(usageEvents.userId, userId), eq(usageEvents.operation, operation), sql`${usageEvents.createdAt} >= ${since}`)); return Number(rows[0]?.count ?? 0); }
export async function adminSummary() { const db = await getDb(); if (!db) return { users: 0, meals: 0, pantryItems: 0, aiOperations: 0, subscriptions: 0, failedOperations: 0, analyticsEvents: 0, failureRate: 0, mealGenerationConversion: 0, subscriptionMix: {} }; const [u, m, p, a, s, f, e, subscriptionRows] = await Promise.all([db.select({ count: sql<number>`count(*)` }).from(users), db.select({ count: sql<number>`count(*)` }).from(meals), db.select({ count: sql<number>`count(*)` }).from(pantryItems), db.select({ count: sql<number>`count(*)` }).from(usageEvents), db.select({ count: sql<number>`count(*)` }).from(subscriptions), db.select({ count: sql<number>`count(*)` }).from(usageEvents).where(eq(usageEvents.success, false)), db.select({ count: sql<number>`count(*)` }).from(analyticsEvents), db.select({ plan: subscriptions.plan, status: subscriptions.status }).from(subscriptions)]); const subscriptionMix = subscriptionRows.reduce<Record<string, number>>((acc, row) => { const key = `${row.plan}:${row.status}`; acc[key] = (acc[key] ?? 0) + 1; return acc; }, {}); const aiOperations = Number(a[0]?.count ?? 0); const failedOperations = Number(f[0]?.count ?? 0); const analyticsEventCount = Number(e[0]?.count ?? 0); return { users: Number(u[0]?.count ?? 0), meals: Number(m[0]?.count ?? 0), pantryItems: Number(p[0]?.count ?? 0), aiOperations, subscriptions: Number(s[0]?.count ?? 0), failedOperations, failureRate: aiOperations ? failedOperations / aiOperations : 0, analyticsEvents: analyticsEventCount, mealGenerationConversion: analyticsEventCount ? Number(m[0]?.count ?? 0) / analyticsEventCount : 0, subscriptionMix }; }

export async function exportUserData(userId: number) {
  const db = await getDb();
  if (!db) return null;
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
  return { profile, pantry, meals: mealsRows, shopping, interactions, usage, analytics, scans, subscriptions: subscriptionsRows, exportedAt: new Date().toISOString() };
}
