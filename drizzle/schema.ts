import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const userProfiles = mysqlTable("user_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  householdSize: int("householdSize").default(2).notNull(),
  dietaryPreferences: text("dietaryPreferences").notNull(),
  allergies: text("allergies").notNull(),
  cuisinePreferences: text("cuisinePreferences").notNull(),
  dislikes: text("dislikes").notNull(),
  skillLevel: varchar("skillLevel", { length: 32 }).default("beginner").notNull(),
  cookingTime: varchar("cookingTime", { length: 32 }).default("15-30").notNull(),
  budget: varchar("budget", { length: 32 }).default("moderate").notNull(),
  mealPriorities: text("mealPriorities").notNull(),
  onboardingComplete: boolean("onboardingComplete").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const pantryItems = mysqlTable("pantry_items", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  canonicalName: varchar("canonicalName", { length: 160 }).notNull(),
  category: varchar("category", { length: 64 }).notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull().default("1"),
  unit: varchar("unit", { length: 32 }).notNull().default("item"),
  expirationDate: timestamp("expirationDate"),
  confidence: decimal("confidence", { precision: 4, scale: 3 }).notNull().default("1"),
  source: varchar("source", { length: 32 }).notNull().default("manual"),
  location: varchar("location", { length: 64 }).default("pantry"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const pantryScans = mysqlTable("pantry_scans", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  imageCount: int("imageCount").notNull().default(1),
  status: varchar("status", { length: 32 }).notNull().default("confirmed"),
  candidates: text("candidates").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const meals = mysqlTable("meals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 220 }).notNull(),
  description: text("description").notNull(),
  payload: text("payload").notNull(),
  source: varchar("source", { length: 32 }).notNull().default("ai"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const mealInteractions = mysqlTable("meal_interactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  mealId: int("mealId").notNull(),
  type: varchar("type", { length: 32 }).notNull(),
  metadata: text("metadata").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const shoppingItems = mysqlTable("shopping_items", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull().default("1"),
  unit: varchar("unit", { length: 32 }).notNull().default("item"),
  mealTitle: varchar("mealTitle", { length: 220 }),
  checked: boolean("checked").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  plan: varchar("plan", { length: 32 }).notNull().default("free"),
  status: varchar("status", { length: 32 }).notNull().default("active"),
  providerCustomerId: varchar("providerCustomerId", { length: 160 }),
  providerSubscriptionId: varchar("providerSubscriptionId", { length: 160 }),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const usageEvents = mysqlTable("usage_events", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  operation: varchar("operation", { length: 64 }).notNull(),
  provider: varchar("provider", { length: 64 }).notNull(),
  model: varchar("model", { length: 128 }),
  inputTokens: int("inputTokens").default(0).notNull(),
  outputTokens: int("outputTokens").default(0).notNull(),
  estimatedCost: decimal("estimatedCost", { precision: 10, scale: 6 }).default("0").notNull(),
  success: boolean("success").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const analyticsEvents = mysqlTable("analytics_events", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  eventName: varchar("eventName", { length: 96 }).notNull(),
  metadata: text("metadata").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type UserProfile = typeof userProfiles.$inferSelect;
export type PantryItem = typeof pantryItems.$inferSelect;
export type Meal = typeof meals.$inferSelect;
export type ShoppingItem = typeof shoppingItems.$inferSelect;
