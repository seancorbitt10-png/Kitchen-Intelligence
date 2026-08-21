# Purchases / Paid Dependencies Required Before Commercial Launch

This audit separates what is already available in the managed project from integrations that require credentials, approval, or purchase. No paid service was activated during implementation.

| Dependency | Purpose | Required? | Free tier? | Estimated cost | When needed | Current status |
| --- | --- | --- | --- | --- | --- | --- |
| Managed database | Persist users, pantry, meals, shopping, usage, and analytics | Required for V1 | Pricing requires verification. | Pricing requires verification. | Before production users | Already available in this project |
| Managed hosting | Serve the web application | Required for V1 | Pricing requires verification. | Pricing requires verification. | Before launch | Available through Manus hosting |
| Built-in AI runtime | Meal generation, structured modification, pantry vision | Required for AI V1 | Usage is governed by project limits; pricing requires verification. | Pricing requires verification. | Before AI launch | Already available |
| Authentication | Sign-in and session isolation | Required for V1 | Already included in the project | Pricing requires verification. | Before launch | Already available |
| Object storage | Durable upload storage if scan originals are retained | Required only if retaining originals | Pricing requires verification. | Pricing requires verification. | Before persistent image retention | Boundary available; current scan uses ephemeral data URLs |
| Billing provider | Paid subscriptions, checkout, webhooks, invoices | Required before charging users | Provider terms vary | Pricing requires verification. | Before selling Plus | Not configured; checkout intentionally blocked |
| Retailer/product APIs | Verified products, prices, inventory, links | Optional for core V1, required for commerce | Provider terms vary | Pricing requires verification. | Before retailer discovery | Abstraction documented; no fake data used |
| Monitoring/error tracking | Alerts for AI, auth, DB, and billing failures | Strongly recommended before launch | Pricing requires verification. | Pricing requires verification. | Before commercial traffic | Admin counts exist; external alerting not connected |
| Domain | Branded public URL | Optional before private testing; recommended before launch | Pricing requires verification. | Pricing requires verification. | Before acquisition campaigns | Not purchased |
| Transactional email | Billing receipts, support, account notices | Required if billing provider requires it | Provider terms vary | Pricing requires verification. | Before paid lifecycle | Not configured |
| Apple/Google developer accounts | Native mobile distribution | Not required for web V1 | Paid membership may be required | Pricing requires verification. | Native app launch | Not needed for this web app |

## Current operating-cost model

Verified provider price sheets and external commercial credentials were not supplied, so no invented numeric unit economics are presented. Before commercial launch, record actual model and billing-provider rates and calculate cost from the `usage_events` table. The current schema records operation, provider, model, input tokens, output tokens, estimated cost, success, and timestamp, which is the required measurement seam.

## Launch blockers

The main blockers to charging users are billing-provider setup and a complete subscription lifecycle, including customer creation, webhook verification, cancellation, renewal, failed payment handling, and plan/entitlement synchronization. Retailer discovery is also not commercially complete until a verified product provider is connected. The current application intentionally communicates these boundaries instead of presenting simulated checkout or fake products.

## Operating-cost scenarios

The following scenarios are intentionally quantified by usage volume but not assigned invented currency values. Actual currency totals are blocked until the selected AI, billing, monitoring, email, and retailer providers publish or supply their applicable commercial rates.

| Scenario | Monthly AI workload assumption | Cost calculation that must be populated with verified rates | Current status |
| --- | --- | --- | --- |
| 100 users | 10 meal generations and 2 pantry scans per user | `(1,000 × meal-generation unit rate) + (200 × scan unit rate) + infrastructure + storage + transaction fees` | Blocked by missing verified rates |
| 1,000 users | 10 meal generations and 2 pantry scans per user | `(10,000 × meal-generation unit rate) + (2,000 × scan unit rate) + infrastructure + storage + transaction fees` | Blocked by missing verified rates |
| 10,000 users | 10 meal generations and 2 pantry scans per user | `(100,000 × meal-generation unit rate) + (20,000 × scan unit rate) + infrastructure + storage + transaction fees` | Blocked by missing verified rates |
| 100,000 users | 10 meal generations and 2 pantry scans per user | `(1,000,000 × meal-generation unit rate) + (200,000 × scan unit rate) + infrastructure + storage + transaction fees` | Blocked by missing verified rates |

For each AI operation, the application records the fields needed to replace the formulas with actual cost: provider, model, input tokens, output tokens, estimated cost, success, and timestamp. Gross-margin cases at $5, $10, and $15 per month must be calculated after provider rate verification; presenting invented amounts would violate the product's no-fabrication requirement.

## Limitations

The current build is a strong non-billing release candidate, but it is **not yet ready to charge strangers without additional billing and production-configuration work**. Billing checkout and subscription lifecycle webhooks are not configured. Retailer/product discovery is an abstraction boundary rather than a live verified commerce integration. Pantry scan originals are processed from ephemeral client data URLs rather than retained in durable object storage, which is the intentional current V1 lifecycle. Recommendation scoring now uses structured pantry, allergy, dietary, cuisine, occasion, time, budget-estimate, household-size, skill, history, feedback, variety, and expiration signals. Weekly planning includes preference context, leftover outputs, serving-aware shopping, scan deduplication, inline pantry editing, feedback capture, atomic account deletion, self-service export, operational failure hooks, and focused router/provider tests. Remaining gaps are target-environment verification, legal approval, external monitoring/email choices, backup/restore evidence, and intentionally excluded billing.

The Terms and Privacy surfaces currently provide product disclosure language, not legal advice or a finalized contract. Legal review, provider terms review, monitoring setup, email delivery, and pricing/quotas must be completed before commercial launch.
