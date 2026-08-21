# Billing

The data model separates users, subscriptions, plans, entitlements, and usage. The server currently enforces a free-plan monthly meal-generation limit and returns the subscription status from the server. The client does not decide premium access.

A commercial billing integration still requires customer creation, checkout sessions, webhook signature verification, subscription synchronization, renewal and cancellation handling, failed-payment behavior, invoice access, and entitlement reconciliation. Until those credentials and flows are configured, checkout returns an explicit provider-configuration error rather than simulating payment.

## Server-enforced entitlement matrix

| Capability | Free plan | Paid plans | Enforcement procedure |
|---|---:|---:|---|
| Meal generation | 8 operations per calendar month | Provider-configured paid allowance | `meals.generate` |
| Pantry vision scan | 3 operations per calendar month | Provider-configured paid allowance | `pantry.scan` |
| Weekly planning | 1 operation per calendar month | Provider-configured paid allowance | `meals.weekly` |
| AI recipe modification | 4 operations per calendar month | Provider-configured paid allowance | `meals.modify` |
| Pantry, shopping, history, privacy, and local interaction controls | Available | Available | Protected procedures plus user ownership checks |
| Checkout | Disabled until a billing connector is configured | Disabled until a billing connector is configured | `billing.startCheckout` fails closed |

The shared server guard is the authoritative check; client labels are informational only.
