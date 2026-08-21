import { describe, expect, it, vi, beforeEach } from "vitest";

const { invokeLLM } = vi.hoisted(() => ({ invokeLLM: vi.fn() }));
vi.mock("./_core/llm", () => ({ invokeLLM }));

import { aiProvider } from "./providers";

describe("AI provider usage metadata", () => {
  beforeEach(() => {
    invokeLLM.mockReset();
    process.env.AI_INPUT_COST_PER_1K_TOKENS = "1";
    process.env.AI_OUTPUT_COST_PER_1K_TOKENS = "2";
  });

  it("propagates model and token usage and calculates estimated cost", async () => {
    invokeLLM.mockResolvedValue({ model: "test-model", usage: { prompt_tokens: 500, completion_tokens: 250 }, choices: [{ message: { content: "{\"ok\":true}" } }] });
    const result = await aiProvider.generateStructured({ operation: "test", messages: [], schema: { type: "object" } });
    expect(result.model).toBe("test-model");
    expect(result.inputTokens).toBe(500);
    expect(result.outputTokens).toBe(250);
    expect(result.estimatedCost).toBe("1.00000000");
  });
});
