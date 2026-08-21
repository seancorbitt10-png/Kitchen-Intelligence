# Testing and Operations

## Automated coverage

The repository currently runs Vitest tests for authentication logout behavior and deterministic kitchen-domain utilities. The domain tests cover canonical ingredient normalization, malformed JSON fallback, and pantry alias matching. TypeScript checks pass with `pnpm check`.

## Required next test layers

Before commercial launch, add integration tests against an isolated database for profile persistence, user isolation, pantry CRUD, duplicate consolidation, scan confirmation, meal generation validation, allergy filtering, shopping consolidation, entitlement limits, account deletion, and admin authorization. Add provider-contract tests for AI and retailer adapters using recorded, non-production fixtures that cannot appear as customer data.

## AI safety contract

AI output is requested as structured JSON and is validated before rendering or persistence. Allergy data is treated as a hard constraint in the meal prompt. Pantry vision results remain candidates until confirmation. The application must distinguish known, inferred, and unknown information and must not invent prices, products, availability, expiration certainty, nutrition precision, or food-safety guarantees.

## Analytics and usage

The current implementation logs generated meals and meal interactions, and records AI operation rows. Expand analytics to signup, onboarding completion, first pantry addition, first scan, first generation, save, cook, pricing view, checkout start, subscription lifecycle, shopping list creation, product click, retention, and provider failures. Use the existing usage table as the source for cost accounting.

## Environment variables

The platform-injected variables currently include `DATABASE_URL`, `JWT_SECRET`, `VITE_APP_ID`, `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL`, `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`, `VITE_FRONTEND_FORGE_API_URL`, `VITE_FRONTEND_FORGE_API_KEY`, `OWNER_OPEN_ID`, and `OWNER_NAME`. Billing, retailer, monitoring, email, and durable image-retention secrets are not configured.

## Provider status

`AIProvider` and `VisionProvider` interfaces are implemented in `server/providers.ts`. Billing checkout is an explicit blocked boundary until a billing provider is configured. Retailer and product discovery remain an explicit future provider boundary. No simulated checkout, fabricated product, or fake customer data is used.
