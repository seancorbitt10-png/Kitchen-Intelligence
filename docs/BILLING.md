# Billing

The data model separates users, subscriptions, plans, entitlements, and usage. The server currently enforces a free-plan monthly meal-generation limit and returns the subscription status from the server. The client does not decide premium access.

A commercial billing integration still requires customer creation, checkout sessions, webhook signature verification, subscription synchronization, renewal and cancellation handling, failed-payment behavior, invoice access, and entitlement reconciliation. Until those credentials and flows are configured, checkout returns an explicit provider-configuration error rather than simulating payment.
