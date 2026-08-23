import { GoogleGenAI } from "@google/genai";

export function createGeminiClient(apiKey: string): GoogleGenAI {
  if (!apiKey.trim()) {
    throw new Error("Gemini API key is required");
  }

  return new GoogleGenAI({
    apiKey,
  });
}
