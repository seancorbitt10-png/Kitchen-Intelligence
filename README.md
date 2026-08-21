# Kitchen Intelligence

Kitchen Intelligence is a full-stack AI kitchen companion centered on a persistent pantry, contextual meal planning, structured vision suggestions, and honest shopping gaps. The product is designed around **scan → understand → plan → cook → learn → shop**.

## What is implemented

The current application includes a public landing page, Manus OAuth authentication, multi-step onboarding, persisted and recommendation-aware user preferences, user-scoped pantry data, manual pantry entry, multi-image scan submission with review, structured AI meal generation and modification, occasion selection including Holiday, recipe detail and serving scaling, weekly planning with leftover outputs, consolidated shopping lists, cooking reconciliation with undo, meal history and interaction signals, profile/export/deletion controls, server-side free-plan generation limits, AI usage rows, analytics events, operational failure hooks, and protected admin summary metrics.

## Development

Run `pnpm install`, then `pnpm dev` for the local server. Use `pnpm check` for TypeScript validation, `pnpm test` for Vitest, and `pnpm build` for the production bundle. Database schema changes are defined in `drizzle/schema.ts`, generated into `drizzle/`, reviewed, and applied through the managed database workflow.

## Environment

Authentication, database, and built-in AI environment values are injected by the managed project. Billing, retailer/product discovery, external monitoring, transactional email, and durable image-retention integrations are intentionally not activated. See `docs/ENVIRONMENT.md`, `docs/V1_FINAL_AUDIT_CHECKLIST.md`, `docs/V1_LAUNCH_BLOCKER_REPORT.md`, and `docs/TESTING_AND_OPERATIONS.md` before commercial launch.

## Product boundaries

AI outputs are structured and provider-boundary controlled, but they remain recommendations. Pantry scan candidates require user confirmation. The application does not fabricate retailer products, prices, inventory, URLs, checkout results, nutrition precision, expiration certainty, or food-safety guarantees. Paid checkout intentionally stops with an explicit configuration error until a real billing provider is connected.

## Mobile delivery note

Kitchen Intelligence is currently a responsive web application built on the React, Tailwind, Express, tRPC, and Manus-authenticated web stack. It is not an Expo or React Native project, so it cannot produce an Expo Go QR code or an `exp://` deep link in its current form. The responsive mobile experience is available through the managed web preview or a published web URL. If native Expo distribution is required, the product needs a separate Expo mobile client that shares the backend contracts and authentication design; alternatively, a standard QR code can point to the web URL and open in a phone browser.
