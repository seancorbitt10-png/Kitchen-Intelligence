import { describe, expect, it } from "vitest";
import { decodeGeneratedImagePayload } from "./_core/imageGeneration";

describe("generated image payload validation", () => {
  it("accepts a valid image payload and decodes it", () => {
    const result = decodeGeneratedImagePayload({ image: { b64Json: Buffer.from("image-bytes").toString("base64"), mimeType: "image/png" } });
    expect(result.mimeType).toBe("image/png");
    expect(result.buffer.toString()).toBe("image-bytes");
  });

  it("rejects malformed and empty provider responses", () => {
    expect(() => decodeGeneratedImagePayload(null)).toThrow("invalid image payload");
    expect(() => decodeGeneratedImagePayload({ image: { b64Json: "", mimeType: "image/png" } })).toThrow("invalid image payload");
    expect(() => decodeGeneratedImagePayload({ image: { b64Json: Buffer.from("x").toString("base64"), mimeType: "application/json" } })).toThrow("invalid image payload");
  });

  it("rejects an oversized decoded image", () => {
    const oversized = Buffer.alloc(15 * 1024 * 1024 + 1).toString("base64");
    expect(() => decodeGeneratedImagePayload({ image: { b64Json: oversized, mimeType: "image/png" } })).toThrow("oversized image");
  });
});
