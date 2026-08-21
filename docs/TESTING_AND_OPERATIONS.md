# Testing and Operations

## Automated coverage

The current codebase passes the TypeScript check, the Vitest suite, and the production build. The suite covers authentication logout behavior, deterministic kitchen-domain utilities, AI usage metadata, malformed structured-output rejection, image-upload validation, router authorization and user isolation, pantry mutations, scan input boundaries, shopping consolidation and serving scaling, entitlement limits, cook/undo behavior, privacy deletion boundaries, and self-service export isolation. The current baseline is **23 tests across 6 files**. This is focused contract coverage rather than a claim that a sandbox run replaces production verification.

## Production verification still required

Before public launch, the owner must run the fresh-account end-to-end journey with real kitchen images, verify production AI/vision quotas and rate limits, perform a safe database backup/restore drill, configure edge/WAF controls, verify monitoring and email choices, confirm domain and OAuth callback settings, and approve the legal/privacy language. No purchase or paid integration is required to complete the codebase-side work described here.

## AI safety contract

AI output is requested as structured JSON and is validated before rendering or persistence. Allergy data is treated as a hard constraint in the meal prompt. Pantry vision results remain candidates until confirmation. The application must distinguish known, inferred, and unknown information and must not invent prices, products, availability, expiration certainty, nutrition precision, or food-safety guarantees.

## Analytics and usage

The application records user-scoped events for onboarding completion, pantry additions, pantry scan confirmation, meal generation, modification, weekly planning, shopping-list creation, cooking, undo-cook, and meal interactions. AI usage rows capture operation, provider, model, input/output tokens where available, estimated cost, success, and timestamp. Acquisition-page analytics, signup attribution, and payment events remain environment/product-analytics work; checkout and subscription lifecycle events are intentionally excluded.

## Environment variables

The platform-injected variables currently include `DATABASE_URL`, `JWT_SECRET`, `VITE_APP_ID`, `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL`, `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`, `VITE_FRONTEND_FORGE_API_URL`, `VITE_FRONTEND_FORGE_API_KEY`, `OWNER_OPEN_ID`, and `OWNER_NAME`. Billing, retailer, monitoring, email, and durable image-retention secrets are not configured.

## Provider status

`AIProvider` and `VisionProvider` are implemented in `server/providers.ts`. Billing checkout is an explicit fail-closed boundary until a billing provider is separately selected and implemented. Retailer/product discovery remains disabled and truthful; the UI does not fabricate products, prices, availability, or retailer links. No simulated checkout, fabricated customer data, or fake production credentials are used.
