# Environment

The managed project injects the variables below. Secret values are intentionally never documented or committed. Production values must be supplied through the project’s secure configuration flow rather than source code.

| Variable | Purpose | Required? | Where used | Production required? |
|---|---|---:|---|---:|
| `DATABASE_URL` | Managed MySQL/TiDB connection | Yes | `server/db.ts`, Drizzle | Yes |
| `JWT_SECRET` | Session-cookie signing and verification | Yes | Manus auth/cookies | Yes |
| `VITE_APP_ID` | Manus OAuth application identifier | Yes | OAuth callback and client login | Yes |
| `OAUTH_SERVER_URL` | Manus OAuth backend base URL | Yes | Server OAuth integration | Yes |
| `VITE_OAUTH_PORTAL_URL` | Manus login portal URL | Yes | Client login redirect | Yes |
| `BUILT_IN_FORGE_API_URL` | Server-side Forge AI/storage API base URL | Yes | AI, vision, storage boundaries | Yes |
| `BUILT_IN_FORGE_API_KEY` | Server-side Forge authorization | Yes | AI, vision, storage boundaries | Yes |
| `VITE_FRONTEND_FORGE_API_URL` | Frontend Forge API base URL for supported client helpers | Platform-provided | Client integration helpers | Verify before production use |
| `VITE_FRONTEND_FORGE_API_KEY` | Frontend Forge client authorization | Platform-provided | Client integration helpers | Verify before production use |
| `OWNER_OPEN_ID` | Owner identity for admin bootstrap/ownership | Platform-provided | User upsert/admin boundary | Yes for admin operations |
| `OWNER_NAME` | Owner display name | Platform-provided | Project/user metadata | Recommended |
| `VITE_ANALYTICS_ENDPOINT` | Built-in analytics endpoint | Platform-provided | Client analytics configuration | Verify before production use |
| `VITE_ANALYTICS_WEBSITE_ID` | Built-in analytics site identifier | Platform-provided | Client analytics configuration | Verify before production use |
| `AI_INPUT_COST_PER_1K_TOKENS` | Optional input rate used for estimated AI cost | No | `server/providers.ts` | Verify rate before cost-based commercial decisions |
| `AI_OUTPUT_COST_PER_1K_TOKENS` | Optional output rate used for estimated AI cost | No | `server/providers.ts` | Verify rate before cost-based commercial decisions |

The following categories are intentionally absent from the current non-billing build: payment processor credentials, retailer/product catalog credentials, external monitoring credentials, transactional-email credentials, durable image-retention credentials, and webhook signing secrets. Add them only after the owner selects a provider and approves the associated account, terms, and costs.

The project must not commit `.env` files, place server secrets in client code, or treat development credentials as production configuration. Before launch, verify OAuth callback URLs, canonical domain/API URLs, HTTPS behavior, database migration state, Forge quotas/rates, analytics site configuration, and the managed platform’s backup/restore controls.
