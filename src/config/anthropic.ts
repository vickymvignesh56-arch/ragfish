import Anthropic from "@anthropic-ai/sdk";

export function createAnthropicClient(apiKey: string): Anthropic {
  if (!apiKey.trim()) {
    throw new Error("Anthropic API key is required");
  }
  return new Anthropic({
    apiKey,
  });
}
