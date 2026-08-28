# AI System

AI calls run server-side through `AIProvider` and `VisionProvider` interfaces. Structured JSON schemas are requested and parsed before data is persisted or rendered. The relevant user context includes profile preferences, allergies, dislikes, pantry state, current request, occasion, and recent meal context rather than an unbounded history dump.

Vision output contains candidate name, category, quantity, unit, confidence, and variants. Candidates are filtered by a configurable threshold and require confirmation. Meal output contains title, description, timings, servings, difficulty, ingredients, pantry matches, missing ingredients, substitutions, instructions, and dietary tags.

Allergy conflicts are hard constraints. Unknown product, price, expiration, nutrition, and safety facts remain unknown. AI usage is recorded per operation with provider, model, token fields, cost estimate, success, and timestamp.

Generated images use the managed ImageService through `server/_core/imageGeneration.ts`. The boundary applies a request timeout, validates the returned MIME type and decoded payload, rejects empty or oversized images, uses collision-resistant storage keys, and returns optional usage metadata. A provider-verified per-image rate may be supplied through `IMAGE_GENERATION_COST_PER_IMAGE`; the application does not invent a price when that variable is absent. Generated-image ownership, retention, and deletion policy remain production configuration decisions because the current V1 flows do not persist generated-image records.
