import type { GenerateResponseInput } from "../interface/LLMClient.js";

export function buildPrompt(input: GenerateResponseInput): string {
  const parts: string[] = [];
  if (input.systemPrompt?.trim()) {
    parts.push(`System Instructions:\n${input.systemPrompt.trim()}`);
  }
  if (input.context?.trim()) {
    parts.push(`Context:\n${input.context.trim()}`);
  }
  parts.push(`User Message:\n${input.message.trim()}`);
  return parts.join("\n\n");
}
