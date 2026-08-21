# Publish Readiness Handoff

## Scope

This document records the work that can be completed inside Kitchen Intelligence before connecting a billing provider. The application is a responsive web SaaS, not an Expo mobile project. Billing remains an explicit external dependency because checkout, subscription lifecycle, refunds, and payment webhooks require a selected provider account and credentials.

## Completed non-billing hardening

The Express server now disables the `X-Powered-By` fingerprint, emits defensive security headers, limits JSON and URL-encoded request sizes, exposes `/healthz` and `/readyz` endpoints, and applies a bounded in-process API burst limiter to tRPC traffic. The limiter is an instance-level safeguard, not a replacement for a distributed edge/WAF policy in production.

The application includes user-scoped procedures, server-side entitlement checks, scan-history and feedback deletion controls, account deletion confirmation, structured AI output validation, usage-event accounting, provider boundaries, a disabled retailer adapter, and explicit non-fabrication behavior for commerce and AI-derived facts. Support contact language and an operational provider handoff are documented in the project references.

## User/provider-owned inputs

| Input | Why it is needed | Owner |
|---|---|---|
| Billing provider account and secret | Checkout, subscriptions, invoices, refunds, webhooks, cancellations, failed payments, and entitlement synchronization | User/business owner |
| AI/vision production quotas and rate card | Cost controls, pricing, usage limits, and gross-margin validation | User/business owner plus provider |
| Production domain | Branded acquisition URL and permanent QR code | User/business owner |
| Transactional email provider | Billing notices, support replies, privacy notices, and account communications | User/business owner plus provider |
| Error monitoring destination | Production alerts and incident triage | User/business owner plus provider |
| Final Terms and Privacy approval | Consumer-facing legal launch requirements | User/business owner and counsel |

## Required pre-public checks

Run the health and readiness endpoints, verify OAuth with a fresh account, complete onboarding, add and edit pantry items, test scan review with representative images, generate and modify meals, create a weekly plan, consolidate a shopping list, cook and undo a meal, exercise privacy deletion, and confirm admin access restrictions. Then repeat the flow with production AI and vision credentials while recording actual usage costs.

Before charging any customer, connect billing and test successful payment, webhook signature verification, activation, renewal, cancellation, failed payment, refund, downgrade, entitlement expiry, and account deletion. Configure monitoring and transactional email, confirm backups and restore procedures, and run a small paid beta before public social acquisition.

## Important limitation

A successful build and checkpoint do not prove production readiness by themselves. The final launch decision depends on real provider credentials, legal approval, operational ownership, and a verified paid-billing lifecycle. The project is suitable for a private beta before those final commercial gates are complete.

## Data lifecycle policy for launch

The current product supports user-controlled deletion of feedback, scan history, and the full account. A production launch owner must set and publish retention periods for analytics, AI usage metadata, and operational logs, including the legal basis and deletion schedule for each category. Database backups and restore drills must be configured through the managed hosting/database controls and tested before public launch; the application does not claim backup or restore guarantees on its own. A self-service data-export package is not implemented in this release candidate. Until export is added, support must handle validated export requests manually and the privacy surface must state that limitation clearly.

## Edge protection and operational adapters

The server includes an in-process per-IP limiter and per-user/per-operation AI burst limiter. These controls are useful for local and single-instance protection but are not a substitute for a distributed edge or WAF policy. Before public acquisition, configure the hosting edge or WAF to enforce distributed IP and bot protection, request-size limits, TLS enforcement, abuse detection, and log retention. The in-process limiter must remain a secondary safeguard because autoscaled instances do not share memory.

AI and vision provider failures now emit sanitized `provider_failure` operational events through the disabled-by-default monitoring adapter. Connect a real monitoring destination before launch to receive alerts, escalation, and incident history. The disabled email adapter defines the eventual boundary for account notices, privacy-request confirmations, support replies, and incident notifications; no outbound email is sent until a verified transactional-email provider and sender domain are configured.
