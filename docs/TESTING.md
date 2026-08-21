# Testing

`pnpm check`, `pnpm test`, and `pnpm build` are the baseline gates. Current Vitest coverage includes auth logout and deterministic kitchen-domain utilities.

Before commercial launch, add isolated-database integration tests for auth authorization, user isolation, pantry CRUD and deduplication, scan confirmation, AI schema validation and allergy filtering, shopping consolidation, entitlements, deletion, and admin authorization. Add provider-contract tests for AI, billing, and retailer adapters.

## New-user QA flow

1. Open the public landing page and verify the primary sign-in action, workflow copy, pricing disclosure, FAQ, terms destination, and responsive layout.
2. Sign in with a fresh Manus account and complete all onboarding steps: household size, dietary preferences, allergies, cuisines, dislikes, skill, time, budget, and meal priorities.
3. Add pantry ingredients manually, search the inventory, edit name/quantity/expiration inline, consume and replenish an item, then verify the list refreshes.
4. Open pantry scanning, select multiple images, adjust the confidence threshold, review candidates, edit or remove candidates, and confirm only reviewed items are committed.
5. Generate a natural-language meal for an occasion, verify allergy rejection and pantry-fit context, scale servings, build a consolidated shopping list, favorite or reject the meal, modify it, and open it from history.
6. Generate a weekly plan and verify day-by-day meals, consolidated grocery items, and explicit leftover carry-forward instructions.
7. Edit cook quantities, mark the recipe cooked, verify pantry reconciliation, and undo the latest cook action.
8. Open profile controls, verify plan status and the fail-closed checkout message, delete scan history and recommendation feedback, then verify the account-deletion confirmation guard.
9. For an admin account, verify protected observability metrics, subscription mix, failure rate, funnel conversion, and degraded/error states.

The release-candidate automated suite covers authentication logout, deterministic domain safety and scaling, provider usage metadata, protected router access, billing fail-closed behavior, privacy fallbacks, shopping consolidation, and cook confirmation boundaries. Live provider credentials and a real billing connector remain launch prerequisites.
