# Kitchen Intelligence

Kitchen Intelligence is a full-stack AI kitchen companion centered on a persistent pantry, contextual meal planning, structured vision suggestions, and honest shopping gaps. The product is designed around **scan → understand → plan → cook → learn → shop**.

## What is implemented

The current application includes a public landing page, Manus OAuth authentication, multi-step onboarding, persisted user preferences, user-scoped pantry data, manual pantry entry, multi-image scan submission with review, structured AI meal generation and modification, occasion selection, recipe detail, missing-ingredient shopping lists, meal history, profile and account deletion controls, server-side free-plan generation limits, AI usage rows, analytics events, and protected admin summary metrics.

## Development

Run `pnpm install`, then `pnpm dev` for the local server. Use `pnpm check` for TypeScript validation, `pnpm test` for Vitest, and `pnpm build` for the production bundle. Database schema changes are defined in `drizzle/schema.ts`, generated into `drizzle/`, reviewed, and applied through the managed database workflow.

## Environment

Authentication, database, and built-in AI environment values are injected by the managed project. Billing, retailer/product discovery, monitoring, email, and durable image-retention integrations are not configured. See `docs/LAUNCH_AUDIT.md` and `docs/TESTING_AND_OPERATIONS.md` before commercial launch.

## Product boundaries

AI outputs are structured and provider-boundary controlled, but they remain recommendations. Pantry scan candidates require user confirmation. The application does not fabricate retailer products, prices, inventory, URLs, checkout results, nutrition precision, expiration certainty, or food-safety guarantees. Paid checkout intentionally stops with an explicit configuration error until a real billing provider is connected.
