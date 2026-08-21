# Kitchen Intelligence — V1 Launch Blocker Report

**Assessment date:** August 21, 2026  
**Current checkpoint:** Final checkpoint will be created after the final export/image-validation test and report updates.  
**Scope:** Non-billing V1 readiness only. No provider, hosting, or billing purchase or activation was performed.

## Executive verdict

Kitchen Intelligence is a strong non-billing release candidate and can be prepared for a controlled private beta. It is not yet possible to certify the target stranger experience in a real production environment because the current sandbox does not contain the launch owner's permanent domain, external monitoring, transactional email, distributed edge/WAF policy, backup/restore evidence, or production AI/vision account verification. Billing is intentionally excluded.

## Exact current production stack

| Layer | Current implementation | Provider/status |
| --- | --- | --- |
| Frontend | React 19, Vite 7, Tailwind CSS 4, shadcn/Radix UI, Wouter | Included in the project; no separate frontend account. |
| Backend | Node.js, Express 4, tRPC 11, TypeScript | Managed Manus WebDev runtime; current project runs as one Node service. |
| Database | MySQL/TiDB through Drizzle ORM and mysql2 | Managed project database via `DATABASE_URL`; already injected into the project environment. |
| Authentication | Manus OAuth with session cookie and JWT signing | Manus Auth via `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL`, `VITE_APP_ID`, and `JWT_SECRET`; already wired. |
| AI text | Built-in Manus Forge LLM wrapper with strict JSON-schema output | `BUILT_IN_FORGE_API_URL` and `BUILT_IN_FORGE_API_KEY`; already available in the managed environment. |
| Pantry vision | Same built-in structured provider boundary, using vision operation context | Uses the built-in AI runtime; production quota/rate verification remains required. |
| Storage | Manus Forge presigned S3 proxy helpers | Available through the built-in Forge environment; current scan images are processed as ephemeral client data URLs and are not retained. |
| Analytics | Project database analytics rows plus built-in Umami client script configuration | `VITE_ANALYTICS_ENDPOINT` and `VITE_ANALYTICS_WEBSITE_ID` are injected; external alerting is not connected. |
| Hosting | Manus WebDev managed autoscale runtime | Available through the current project; no external hosting provider is used. |
| Retailer discovery | `RetailerProvider` interface with disabled adapter | No live retailer account or catalog is connected; no fake products or prices are used. |
| Monitoring | Disabled adapter plus sanitized operational events | No external monitoring account or alert destination is connected. |
| Email | Disabled transactional-email adapter and support mailto boundary | No email provider or sender domain is connected. |
| Billing | Explicit fail-closed checkout boundary | Intentionally excluded from this pass. |

## External credentials and classification

| Dependency or credential | Configured now? | Classification | Function enabled |
| --- | --- | --- | --- |
| Manus OAuth application/session values | Yes, managed/injected | Free/currently available through the project | Sign-up, login, logout, session isolation. |
| Managed database URL | Yes, managed/injected | Free/currently available through the project; plan/pricing must be verified by owner | Persistence for product data. |
| Built-in Forge AI URL/key | Yes, managed/injected | Currently available through the project; usage limits and commercial rates require verification | Genuine structured meal generation, modification, and pantry vision. |
| AI input/output rate configuration | Not verified as a production business rate | Requires provider/business verification, not a purchase by itself | Accurate cost accounting and pricing decisions. |
| Permanent production domain | No | Requires a new domain account or existing domain configuration; may require payment | Branded public URL and permanent acquisition links. |
| External monitoring destination | No | Requires a new account; free tiers may exist depending on provider | Alerts for provider, auth, database, and runtime failures. |
| Transactional email provider and sender domain | No | Requires a new account and business/domain approval; may require payment | Account notices, privacy requests, support replies, and incident messages. |
| Distributed edge/WAF policy | No evidence of a configured policy | Can be replaced by the hosting platform's existing edge capability if it exposes the required controls; otherwise requires a new provider/account and possibly payment | Shared rate limiting, bot protection, request filtering, and public abuse protection. |
| Durable image retention | Not required for current ephemeral scan flow | Can be replaced by keeping images ephemeral; requires storage configuration only if originals must be retained | Retention, reprocessing, or audit access to original pantry images. |
| Retailer/product catalog provider | No | Optional for the core non-commerce V1; requires a new account, provider approval, and possibly payment | Verified products, prices, availability, and retailer links. |
| Backup/restore operations | Not independently configured or evidenced in code | Requires use of the managed database/hosting controls and a launch-owner restore drill; may already be available | Recovery from operational failure and data-loss incidents. |
| Legal approval | No evidence in the codebase | Requires business/legal approval, not a technical purchase | Final Terms, Privacy, AI disclosure, retention, and consumer-facing launch language. |
| Billing provider | No, intentionally | Requires a new account, business approval, and likely payment-processing fees | Checkout, subscriptions, invoices, refunds, webhooks, and paid entitlements. |

## A. COMPLETE — nothing else needed from me

The core non-billing product surface is implemented: authentication, onboarding, persisted preferences, pantry CRUD, expiration, scan review and deduplication, structured AI meal generation, recipe modification, recommendation signals, weekly planning, leftover carry-forward, serving-aware shopping consolidation, cook and undo-cook, favorites and feedback, user-scoped history, account deletion, scan-history deletion, feedback deletion, admin observability, and a self-service JSON data export. The export procedure is protected and tested for user isolation.

The codebase now includes production-oriented security headers, request-size limits, sanitized server errors, health/readiness endpoints, IP burst protection, per-user/per-operation throttling, provider-failure operational events, disabled monitoring and email adapters, image type/size validation with automated coverage, explicit provider boundaries, conservative non-fabrication behavior, self-service export, and lazy-loaded workspace code. The production build emits separate React, query, and UI vendor chunks; the remaining main application chunk is a documented optimization tradeoff rather than a failed build.

Validation completed in the sandbox: TypeScript check passed, 22 automated tests passed across 6 files, the production build passed, the self-service export isolation path and image validation are covered by tests, health/readiness endpoints responded during the prior hardening pass, and the responsive mobile taskbar was visually verified. No fake credentials, fake retailers, fake monitoring events, or paid integrations were activated. Real target-environment provider, backup/restore, edge/WAF, and fresh-account smoke verification remains unperformed and is explicitly listed as launch-owner work.

## B. NEEDS MY ACCOUNT/CREDENTIAL CONFIGURATION

The built-in Manus environment is sufficient for the current AI, vision, database, authentication, hosting, storage-proxy, and basic analytics capabilities. The remaining configuration work is the owner’s provider selection and credential handoff rather than new feature scope.

A permanent domain is needed for a credible public URL and social-media acquisition. An external monitoring destination is needed to turn sanitized provider-failure and server-error events into alerts. A transactional-email provider and sender domain are needed for reliable account, privacy, support, and incident communications. A distributed edge/WAF policy must be configured either through the managed host’s existing controls or through a selected edge provider. Production AI/vision quotas, rate cards, and limits must be verified even though the built-in runtime is already available.

A launch owner must also run a real database backup/restore drill, approve retention and deletion policy, complete Terms/Privacy/AI disclosure review, and run a fresh-account production smoke test with representative kitchen images. These actions require access to the target production environment and business decisions; they do not require adding major product features.

## C. REQUIRES MONEY — DO NOT PURCHASE

No purchase is recommended in this report. The following items may eventually require payment, but they should remain unpurchased until the owner selects providers and confirms the launch budget: a permanent domain, external monitoring above a free tier, transactional email above a free tier, a distributed edge/WAF service above a free tier, durable image storage if retention is desired, and retailer/product catalog access.

The core non-billing product can use the already available managed Manus hosting, database, authentication, Forge AI/vision runtime, storage proxy, and analytics configuration while the owner evaluates provider choices. Do not purchase retailer APIs or durable image retention merely to launch the core meal-planning product; both can remain disabled boundaries.

## D. BILLING — INTENTIONALLY EXCLUDED

Billing has not been implemented or activated in this pass. Checkout intentionally fails closed. No billing provider, payment method, subscription webhook, invoice system, refund flow, failed-payment flow, or paid-plan lifecycle should be configured until the owner separately chooses a billing provider and approves the commercial model.

When billing is deliberately started later, it will require customer creation, checkout, webhook signature verification, activation, renewal, cancellation, failed payment, refund, downgrade, entitlement expiry, invoice access, and account-deletion reconciliation. None of those are prerequisites for the current non-billing engineering pass, but they are prerequisites for charging users.

## Completion and blocker summary

| Measure | Current assessment |
| --- | --- |
| Current V1 completion percentage | **Approximately 85% for non-billing engineering; approximately 70% for a publicly sellable commercial product**. The lower commercial figure reflects unverified production providers, operational ownership, legal approval, and intentionally excluded billing. |
| Remaining engineering work | **Low to moderate:** mostly production smoke-test evidence, edge/WAF integration, external monitoring/email wiring, and any provider-specific adapter work selected by the owner. Core product feature scope should remain frozen. |
| Remaining configuration work | **Moderate:** permanent domain, monitoring destination, email sender/provider, production AI/vision rate/quota verification, edge/WAF policy, backup/restore drill, legal copy approval, and fresh-account production testing. |
| Remaining paid dependencies | **None should be purchased yet.** Potential future paid dependencies are domain, monitoring, email, edge/WAF, durable storage, retailer data, and billing. |
| Current launch blockers | **Real production provider verification, distributed abuse protection, backup/restore evidence, legal/privacy approval, operational monitoring/email, and the separately excluded billing lifecycle.** |

## Final recommendation

Freeze product scope. Use the current build for internal QA or a tightly controlled free private beta only after the owner verifies the available Manus AI/vision runtime with real kitchen images. Do not advertise paid subscriptions or take money. The next decisions should be provider selection and production-account configuration, not additional product features.
