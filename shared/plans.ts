export const TRIAL_DURATION_DAYS = 7;

export const AI_OPERATIONS = [
  "meal_generation",
  "meal_modification",
  "pantry_scan",
  "weekly_plan",
] as const;

export type AiOperation = (typeof AI_OPERATIONS)[number];
export type PlanKey = "free" | "plus" | "pro";

export const AI_OPERATION_LABELS: Record<AiOperation, string> = {
  meal_generation: "Meal generations",
  meal_modification: "Meal modifications",
  pantry_scan: "Pantry image analyses",
  weekly_plan: "Weekly meal plans",
};

export type PlanDefinition = {
  key: PlanKey;
  name: string;
  priceCents: number;
  cadence: "month" | "none";
  tagline: string;
  limits: Record<AiOperation, number>;
  displayRanges: Record<AiOperation, string>;
  features: readonly string[];
};

const unlimitedCore = [
  "Unlimited manual pantry items",
  "Unlimited saved meals and history",
  "Unlimited shopping lists and cooking actions",
  "Full personalization and recipe scaling",
] as const;

export const PLAN_DEFINITIONS: Record<PlanKey, PlanDefinition> = {
  free: {
    key: "free",
    name: "Free",
    priceCents: 0,
    cadence: "none",
    tagline: "Manual kitchen tools after the trial.",
    limits: { meal_generation: 0, meal_modification: 0, pantry_scan: 0, weekly_plan: 0 },
    displayRanges: { meal_generation: "0", meal_modification: "0", pantry_scan: "0", weekly_plan: "0" },
    features: [...unlimitedCore, "AI access requires an active trial or paid plan"],
  },
  plus: {
    key: "plus",
    name: "Plus",
    priceCents: 999,
    cadence: "month",
    tagline: "Your everyday AI kitchen assistant.",
    limits: { meal_generation: 35, meal_modification: 20, pantry_scan: 30, weekly_plan: 4 },
    displayRanges: { meal_generation: "30–35", meal_modification: "15–20", pantry_scan: "25–30", weekly_plan: "3–4" },
    features: [...unlimitedCore, "Pantry-aware meal recommendations", "Weekly planning within the included allowance", "Pantry scanning within the included allowance"],
  },
  pro: {
    key: "pro",
    name: "Pro",
    priceCents: 1999,
    cadence: "month",
    tagline: "Advanced kitchen intelligence for heavier users and households.",
    limits: { meal_generation: 80, meal_modification: 40, pantry_scan: 75, weekly_plan: 10 },
    displayRanges: { meal_generation: "70–80", meal_modification: "35–40", pantry_scan: "60–75", weekly_plan: "8–10" },
    features: [...unlimitedCore, "Everything in Plus", "Higher AI and pantry allowances", "Advanced planning constraints are planned, not yet enabled"],
  },
};

export function trialEndsAtFor(createdAt: Date | string | number, now = new Date()) {
  const start = new Date(createdAt);
  const endsAt = new Date(start.getTime() + TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000);
  return { start, endsAt, active: Number.isFinite(start.getTime()) && now < endsAt };
}

export function effectivePlanFor(input: { plan?: string | null; status?: string | null; createdAt: Date | string | number }, now = new Date()): PlanKey {
  const plan = input.plan === "plus" || input.plan === "pro" ? input.plan : "free";
  const activeStatus = input.status === "active";
  if (activeStatus && plan !== "free") return plan;
  return plan === "free" && trialEndsAtFor(input.createdAt, now).active ? "plus" : "free";
}

export function entitlementLimit(plan: PlanKey, operation: AiOperation) {
  return PLAN_DEFINITIONS[plan].limits[operation];
}

export function formatPlanPrice(plan: PlanKey) {
  const definition = PLAN_DEFINITIONS[plan];
  return definition.priceCents === 0 ? "$0" : `$${(definition.priceCents / 100).toFixed(2)}/month`;
}
