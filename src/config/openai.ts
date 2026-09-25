import OpenAI from "openai";

export function createOpenAIClient(apiKey: string): OpenAI {
  if (!apiKey.trim()) {
    throw new Error("OpenAI API key is required");
  }
  return new OpenAI({
    apiKey,
  });
}
