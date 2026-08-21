# Kitchen Intelligence Architecture

Kitchen Intelligence is a React, tRPC, Express, Drizzle, and MySQL/TiDB web application. The frontend presents a mobile-first consumer experience, while authenticated procedures provide the only path to user-owned pantry, profile, meal, shopping, usage, and privacy data.

## Core flow

The product loop is **scan → understand → plan → cook → learn → shop**. Pantry image candidates are returned as structured, confidence-scored suggestions and are not written to inventory until the user confirms them. Meal requests are enriched with the persisted profile and pantry context, sent through an AI provider boundary, validated against a JSON schema, persisted as a meal record, and logged as usage and analytics events.

## Layers

| Layer | Responsibility |
| --- | --- |
| React UI | Responsive landing page, onboarding, pantry, scan confirmation, meal planning, recipe detail, shopping, history, profile, privacy, and protected admin views. |
| tRPC router | Authenticated contracts, Zod input validation, entitlement checks, user isolation, controlled mutations, and user-facing error messages. |
| Domain helpers | Canonical ingredient names, safe JSON parsing, pantry matching, usage tracking, analytics, and data access helpers. |
| Provider boundary | `AIProvider` and `VisionProvider` interfaces keep the domain independent from a single model vendor. |
| Database | User-owned relational records for profiles, pantry items, scans, meals, interactions, shopping items, subscriptions, usage, and analytics. |

## Security and privacy

All protected procedures derive the user ID from the authenticated session; callers cannot provide an alternate owner ID. Admin summaries require the `admin` role. Account deletion removes the user profile, pantry, scan records, meals, interactions, shopping items, subscription record, usage events, analytics events, and user record. Secrets remain server-side through the platform environment.

## Known provider boundaries

The built-in AI/vision runtime is available through the platform. Billing checkout and retailer product discovery intentionally stop at explicit provider boundaries until credentials and commercial approvals are supplied. The application does not fabricate products, prices, retailer availability, or checkout results.
