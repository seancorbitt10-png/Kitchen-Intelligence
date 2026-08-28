# Billing

The data model separates users, subscriptions, plans, entitlements, and usage. The server returns the effective plan and trial state from the server. The client does not decide premium access.

A commercial billing integration still requires customer creation, checkout sessions, webhook signature verification, subscription synchronization, renewal and cancellation handling, failed-payment behavior, invoice access, and entitlement reconciliation. Until those credentials and flows are configured, checkout returns an explicit provider-configuration error rather than simulating payment.

## Server-enforced entitlement matrix

| Plan | Price | Meal generations | Modifications | Pantry image analyses | Weekly plans |
|---|---:|---:|---:|---:|---:|
| Free trial | $0 for 7 days | Up to 35 | Up to 20 | Up to 30 | Up to 4 |
| Plus | $9.99/month | Up to 35 | Up to 20 | Up to 30 | Up to 4 |
| Pro | $19.99/month | Up to 80 | Up to 40 | Up to 75 | Up to 10 |
| Free after expired trial | $0 | 0 | 0 | 0 | 0 |

The exact caps are centralized in `shared/plans.ts` and enforced by the server guard. Customer-facing ranges are provisional product targets, not provider-cost guarantees. Manual pantry items, saved meals, history, shopping lists, cooking/reconciliation, and personalization are not artificially restricted by these AI allowances.

The seven-day trial grants Plus access only and never Pro access. After expiration, users without an active paid plan receive the Free effective plan. Billing is unavailable and checkout remains fail-closed; no successful subscription state is fabricated.

The shared server guard is the authoritative check; client labels are informational only.
