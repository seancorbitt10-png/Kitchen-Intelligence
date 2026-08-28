# Cost and Approvals

No paid services were purchased or activated during implementation. Current platform-provided authentication, database, hosting, storage helpers, and built-in AI runtime are available in the managed project, but pricing and quotas must be verified against the active account.

Before commercial launch, verify pricing for AI inference and vision, hosting, database, storage, billing transactions, monitoring, email, domain registration, and any retailer/product provider. Retailer inventory and direct checkout may require approval or a commercial agreement. Do not publish a gross-margin claim until actual token pricing, scan volume, generation volume, and transaction costs are recorded.

Current image-cost accounting boundaries:

- Pantry image analysis uses the vision/LLM provider and estimates text-token cost from `AI_INPUT_COST_PER_1K_TOKENS` and `AI_OUTPUT_COST_PER_1K_TOKENS`. Image-token billing is provider-dependent and is not separately modeled unless the active provider exposes it through the response metadata.
- Generated images use the managed ImageService. The generation helper returns model, quality, MIME type, and optional `IMAGE_GENERATION_COST_PER_IMAGE` metadata, but no price is assumed when the variable is unset.
- Storage and bandwidth costs are separate from provider inference costs and require verification against the active managed-service account.
