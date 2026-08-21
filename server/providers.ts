import { invokeLLM, type InvokeResult } from "./_core/llm";

export type StructuredRequest = { operation: string; messages: any[]; schema: Record<string, unknown> };
export interface AIProvider { generateStructured(request: StructuredRequest): Promise<{ data: unknown; model: string; inputTokens: number; outputTokens: number; estimatedCost: string }>; }
export interface VisionProvider { analyzeImages(request: StructuredRequest): Promise<{ data: unknown; model: string; inputTokens: number; outputTokens: number; estimatedCost: string }>; }

async function invokeStructured(request: StructuredRequest) {
  const response: InvokeResult = await invokeLLM({ messages: request.messages, response_format: { type: "json_schema", json_schema: { name: request.operation, strict: true, schema: request.schema } } });
  const content = response.choices?.[0]?.message?.content;
  const raw = typeof content === "string" ? content : JSON.stringify(content ?? "");
  const inputTokens = response.usage?.prompt_tokens ?? 0;
  const outputTokens = response.usage?.completion_tokens ?? 0;
  const inputRate = Number(process.env.AI_INPUT_COST_PER_1K_TOKENS ?? "0");
  const outputRate = Number(process.env.AI_OUTPUT_COST_PER_1K_TOKENS ?? "0");
  const estimatedCost = ((inputTokens / 1000) * inputRate + (outputTokens / 1000) * outputRate).toFixed(8);
  return { data: JSON.parse(raw), model: response.model, inputTokens, outputTokens, estimatedCost };
}

export const aiProvider: AIProvider = { generateStructured: invokeStructured };
export const visionProvider: VisionProvider = { analyzeImages: invokeStructured };

export type RetailerProduct = { retailer: string; productId: string; name: string; price: string; currency: string; availability: "in_stock" | "out_of_stock" | "unknown"; url: string };
export interface RetailerProvider { search(query: string): Promise<RetailerProduct[]>; }
export const disabledRetailerProvider: RetailerProvider = { async search() { return []; } };
