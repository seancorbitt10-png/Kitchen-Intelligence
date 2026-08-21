# Environment

The managed project injects `DATABASE_URL`, `JWT_SECRET`, `VITE_APP_ID`, `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL`, `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`, `VITE_FRONTEND_FORGE_API_URL`, `VITE_FRONTEND_FORGE_API_KEY`, `OWNER_OPEN_ID`, and `OWNER_NAME`.

Billing, retailer, monitoring, email, and durable-image variables are intentionally absent until the corresponding providers are selected and credentials are supplied through the secure project settings flow. Never commit secret values or place provider credentials in client code.
