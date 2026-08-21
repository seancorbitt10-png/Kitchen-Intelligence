import { invokeLLM } from "./_core/llm";

export type StructuredRequest = { operation: string; messages: any[]; schema: Record<string, unknown> };
export interface AIProvider { generateStructured(request: StructuredRequest): Promise<{ data: unknown; model: string; inputTokens: number; outputTokens: number; estimatedCost: string }>; }
export interface VisionProvider { analyzeImages(request: StructuredRequest): Promise<{ data: unknown; model: string; inputTokens: number; outputTokens: number; estimatedCost: string }>; }

async function invokeStructured(request: StructuredRequest) {
  const response = await invokeLLM({ messages: request.messages, response_format: { type: "json_schema", json_schema: { name: request.operation, strict: true, schema: request.schema } } });
  const content = response.choices?.[0]?.message?.content;
  const raw = typeof content === "string" ? content : JSON.stringify(content ?? "");
  return { data: JSON.parse(raw), model: "configured-runtime-model", inputTokens: 0, outputTokens: 0, estimatedCost: "0" };
}

export const aiProvider: AIProvider = { generateStructured: invokeStructured };
export const visionProvider: VisionProvider = { analyzeImages: invokeStructured };
