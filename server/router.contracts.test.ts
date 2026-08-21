import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { saveMeal, deletePantryItem } from "./db";

function context(role: "user" | "admin" = "user", id = 7): TrpcContext {
  return {
    user: { id, openId: `router-test-user-${id}`, email: "router@example.com", name: "Router Test", loginMethod: "test", role, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Kitchen Intelligence router contracts", () => {
  it("keeps pantry and shopping reads user-scoped and safe without a configured database", async () => {
    const caller = appRouter.createCaller(context("user", 910001));
    expect(await caller.pantry.list()).toEqual([]);
    expect(await caller.shopping.list()).toEqual([]);
  });

  it("covers pantry mutation operations and cross-user isolation", async () => {
    const userId = 100000 + Math.floor(Date.now() % 900000);
    const otherId = userId + 1;
    const caller = appRouter.createCaller(context("user", userId));
    const otherCaller = appRouter.createCaller(context("user", otherId));
    const created = await caller.pantry.add({ name: "contract oats", category: "grain", quantity: 2, unit: "cups", confidence: 1, source: "manual", location: "pantry" });
    expect(created?.id).toBeTruthy();
    expect((await otherCaller.pantry.list()).some(item => item.id === created?.id)).toBe(false);
    await caller.pantry.update({ id: created!.id, quantity: 3, name: "contract oats", category: "grain", unit: "cups" });
    await caller.pantry.consume({ id: created!.id, quantity: 1 });
    await caller.pantry.replenish({ id: created!.id, quantity: 2 });
    expect((await caller.pantry.list()).find(item => item.id === created!.id)?.quantity).toBe("4.00");
    await caller.pantry.remove({ id: created!.id });
  });

  it("rejects malformed scan payloads before calling vision providers", async () => {
    await expect(appRouter.createCaller(context()).pantry.scan({ images: [], threshold: 0.65 })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("fails closed for billing checkout and exposes the free fallback status", async () => {
    const caller = appRouter.createCaller(context());
    expect(await caller.billing.status()).toMatchObject({ plan: "free", status: "active" });
    await expect(caller.billing.startCheckout()).rejects.toMatchObject({ code: "PRECONDITION_FAILED" });
  });

  it("protects admin observability from ordinary users", async () => {
    await expect(appRouter.createCaller(context("user")).admin.summary()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("keeps privacy deletion fail-closed when persistence is unavailable", async () => {
    expect(await appRouter.createCaller(context()).privacy.deleteFeedback()).toEqual({ success: true });
    expect(await appRouter.createCaller(context()).privacy.deleteScanHistory()).toEqual({ success: true });
  });

  it("exercises scaled shopping input and editable cook quantities at the procedure boundary", async () => {
    const caller = appRouter.createCaller(context("user", 100000 + Math.floor(Date.now() % 900000)));
    const shopping = await caller.shopping.fromMeal({ meal: { title: "Test meal", missingIngredients: ["lime", "Lime"], ingredients: [{ name: "lime", quantity: 2, unit: "each" }] } });
    expect(shopping.find(item => item.name === "lime")?.quantity).toBe("4.00");
    expect(await caller.meals.cook({ mealId: 1, confirm: true, ingredients: [{ name: "lime", quantity: 1.5, unit: "each" }] })).toMatchObject({ confirmed: true, consumed: [] });
    await expect(caller.meals.undoCook({ mealId: 999999 })).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("restores an edited pantry quantity after a successful cook and undo", async () => {
    const userId = 100000 + Math.floor(Date.now() % 900000);
    const caller = appRouter.createCaller(context("user", userId));
    const meal = await saveMeal(userId, "Integration meal", "Test", JSON.stringify({ title: "Integration meal" }));
    const pantry = await caller.pantry.add({ name: "integration rice", category: "grain", quantity: 5, unit: "cups", confidence: 1, source: "manual", location: "pantry" });
    expect(meal?.id).toBeTruthy();
    expect(pantry?.id).toBeTruthy();
    const cooked = await caller.meals.cook({ mealId: meal!.id, confirm: true, ingredients: [{ name: "integration rice", quantity: 1.5, unit: "cups" }] });
    expect(cooked.confirmed).toBe(true);
    expect((await caller.pantry.list()).find(item => item.id === pantry!.id)?.quantity).toBe("3.50");
    await caller.meals.undoCook({ mealId: meal!.id });
    expect((await caller.pantry.list()).find(item => item.id === pantry!.id)?.quantity).toBe("5.00");
    await deletePantryItem(userId, pantry!.id);
  });

  it("exports only the requesting user data through the protected privacy procedure", async () => {
    const userId = 100000 + Math.floor(Date.now() % 900000);
    const caller = appRouter.createCaller(context("user", userId));
    const created = await caller.pantry.add({ name: "export oats", category: "grain", quantity: 1, unit: "bag", confidence: 1, source: "manual", location: "pantry" });
    const exported = await caller.privacy.exportData();
    expect(exported.pantry.some(item => item.id === created?.id)).toBe(true);
    expect(exported.pantry.every(item => item.userId === userId)).toBe(true);
    await deletePantryItem(userId, created!.id);
  });
});
