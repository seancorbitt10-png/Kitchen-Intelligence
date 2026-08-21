# Provider Integrations

The AI and vision layers use `AIProvider` and `VisionProvider` interfaces in `server/providers.ts`. The current implementation delegates to the managed built-in runtime. A billing provider must implement customer, checkout, subscription, webhook, cancellation, and entitlement synchronization operations. A retailer provider must implement verified product search, product details, price, availability, store locations, and optionally cart creation.

Provider adapters must return explicit unavailable states when current data cannot be verified. The domain layer must never depend on a single retailer or model vendor, and no adapter may fabricate products, prices, inventory, URLs, checkout results, or shipping information.
