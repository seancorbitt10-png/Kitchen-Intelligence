# Kitchen Intelligence — Managed Manus Production Setup

This project is designed to run on the managed Manus full-stack environment. The repository already targets Manus OAuth, Manus Forge for AI and storage, Drizzle/MySQL-compatible persistence, and the built-in analytics hook. No third-party infrastructure is required for the core product.

## What is already handled in the repository

The repository includes the Express server, React frontend, tRPC API, Manus OAuth callback route, server-side authentication context, Drizzle schema and migration command, Forge LLM/vision boundaries, generated-image storage proxy, privacy procedures, plan entitlements, health/readiness endpoints, rate limiting, security headers, and production build scripts. Billing, payment processing, retailer purchasing, invoices, refunds, and webhooks remain intentionally disabled.

## Production environment matrix

| Variable | Required for production | Who supplies it | Purpose | Notes |
|---|---:|---|---|---|
| `DATABASE_URL` | Yes | Managed Manus database/project configuration | MySQL/TiDB persistence | Must point to the production database; apply Drizzle migrations before launch. |
| `JWT_SECRET` | Yes | Managed Manus secret configuration | Session-cookie signing and verification | Generate/store as a production secret; never commit it. |
| `VITE_APP_ID` | Yes | Manus OAuth project configuration | OAuth application identifier | Must match the production OAuth app. |
| `VITE_OAUTH_PORTAL_URL` | Yes | Manus OAuth project configuration | Browser login portal | Must be the approved Manus login URL for the app. |
| `OAUTH_SERVER_URL` | Yes | Manus OAuth project configuration | Server-side OAuth exchange and user-info authority | Required for `/api/oauth/callback`. |
| `BUILT_IN_FORGE_API_URL` | Yes | Managed Manus platform | Server-side Forge AI/storage base URL | Use the platform-provided value; do not replace with a third-party endpoint. |
| `BUILT_IN_FORGE_API_KEY` | Yes | Managed Manus platform secret | Server-side Forge authorization | Keep server-side only. |
| `OWNER_OPEN_ID` | Yes for admin operations | Project owner / Manus identity configuration | Admin bootstrap and owner boundary | The owner’s Manus Open ID must be supplied or injected by the project environment. |
| `PORT` | No | Managed Manus runtime | HTTP listener port | The platform normally supplies this; do not hardcode a production port. |
| `NODE_ENV` | No | Managed Manus runtime | Development vs production behavior | Set to `production` by the deployment runtime. |
| `VITE_ANALYTICS_ENDPOINT` | No | Managed Manus analytics configuration | Optional client analytics endpoint | Leave unset if built-in analytics is not enabled. |
| `VITE_ANALYTICS_WEBSITE_ID` | No | Managed Manus analytics configuration | Optional analytics site identifier | Must be paired with the endpoint; otherwise analytics is not injected. |
| `AI_INPUT_COST_PER_1K_TOKENS` | No | Owner/provider verification | Optional estimated text-input cost metadata | Set only after confirming the active Forge/model rate. |
| `AI_OUTPUT_COST_PER_1K_TOKENS` | No | Owner/provider verification | Optional estimated text-output cost metadata | Set only after confirming the active Forge/model rate. |
| `IMAGE_GENERATION_COST_PER_IMAGE` | No | Owner/provider verification | Optional generated-image cost metadata | Set only after confirming the active model and quality price. |

## Variables not needed for the current product surface

`VITE_FRONTEND_FORGE_API_URL` and `VITE_FRONTEND_FORGE_API_KEY` belong to a generic frontend Forge helper and an unused map component. They are not required for the currently surfaced Kitchen Intelligence flows. Do not request or configure them unless the map component is intentionally activated.

`OWNER_NAME` is not currently read by application code and does not need to be supplied for the product to run. It may be added later as display metadata if the managed project requires it.

## Owner inputs required before production activation

The owner must provide or approve only the following account-level items:

1. The managed Manus project/deployment target where this repository should be published.
2. The production domain, if a custom domain will be used; otherwise the managed deployment URL is sufficient.
3. OAuth application registration/approval for that domain.
4. The exact production OAuth callback URL: `https://YOUR_DOMAIN/api/oauth/callback`.
5. Confirmation that the managed Manus project has its production database provisioned and its `DATABASE_URL` available.
6. Confirmation that managed Forge AI/storage access is enabled and its platform-provided URL/key are available to the deployment.
7. The owner’s Manus Open ID for `OWNER_OPEN_ID` if it is not injected automatically.
8. A decision on whether optional analytics should be enabled; if yes, the managed analytics endpoint and website ID.
9. Verified provider rates only if cost metadata is needed: input-token rate, output-token rate, and/or generated-image rate.
10. Final approval of the existing Free Trial, Plus, and Pro information and the current decision to leave billing disabled.

No passwords or secret values should be pasted into source files or committed to Git. Enter secrets through the managed project’s secure configuration flow.

## Launch sequence

After the owner inputs are available, publish the current `main` branch, configure the variables above in the managed Manus project, run the database migration command against the production database, and verify `/healthz` and `/readyz`. Then complete a real OAuth sign-in and test the authenticated workspace flows: onboarding, pantry CRUD, pantry image scanning, meal generation/modification, shopping, cooking/undo, Profile privacy controls, logout, and session expiry.

The application must not be declared production-ready while `/readyz` is failing, OAuth is unconfigured, or the server is using the local in-memory fallback. Billing must remain disabled until a separate provider, terms, pricing, webhook, refund, and compliance implementation is explicitly approved.
