import { describe, expect, it } from "vitest";
import { PLAN_DEFINITIONS, effectivePlanFor, trialEndsAtFor } from "@shared/plans";

describe("V1 plans and trial", () => {
  const createdAt = new Date("2026-01-01T00:00:00.000Z");

  it("defines the finalized Plus and Pro prices and caps centrally", () => {
    expect(PLAN_DEFINITIONS.plus.priceCents).toBe(999);
    expect(PLAN_DEFINITIONS.plus.limits).toEqual({ meal_generation: 35, meal_modification: 20, pantry_scan: 30, weekly_plan: 4 });
    expect(PLAN_DEFINITIONS.pro.priceCents).toBe(1999);
    expect(PLAN_DEFINITIONS.pro.limits).toEqual({ meal_generation: 80, meal_modification: 40, pantry_scan: 75, weekly_plan: 10 });
  });

  it("grants exactly seven days of Plus trial access, never Pro", () => {
    const activeNow = new Date("2026-01-07T23:59:59.000Z");
    const expiredNow = new Date("2026-01-08T00:00:00.000Z");
    expect(trialEndsAtFor(createdAt, activeNow).active).toBe(true);
    expect(effectivePlanFor({ plan: "free", status: "active", createdAt }, activeNow)).toBe("plus");
    expect(effectivePlanFor({ plan: "free", status: "active", createdAt }, expiredNow)).toBe("free");
    expect(effectivePlanFor({ plan: "pro", status: "active", createdAt }, activeNow)).toBe("pro");
  });

  it("does not treat inactive paid records as active entitlements", () => {
    expect(effectivePlanFor({ plan: "plus", status: "canceled", createdAt }, new Date("2026-01-10T00:00:00.000Z"))).toBe("free");
  });
});
