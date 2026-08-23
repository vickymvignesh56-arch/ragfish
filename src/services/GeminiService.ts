import type {
  GenerateResponseInput,
  LLMClient,
  LLMResponse,
} from "../interface/LLMClient.js";
import { llmProviderService } from "./LLMProviderService.js";
import { createGeminiClient } from "../config/gemini.js";
export class GeminiService implements LLMClient {
  async generateResponse(input: GenerateResponseInput): Promise<LLMResponse> {
    const message = input.message.trim();
    if (!message) {
      throw new Error("Message cannot be empty");
    }
    const { provider, decryptedApiKey } =
      await llmProviderService.getActiveProviderWithDecryptedKey(input.userId);
    if (provider.provider !== "GEMINI") {
      throw new Error(
        `Active LLM provider is ${provider.provider}, not GEMINI`,
      );
    }
    const contents = this.buildPrompt(input);
    try {
      const gemini = createGeminiClient(decryptedApiKey);
      const response = await gemini.models.generateContent({
        model: provider.chatModel,
        contents,
      });
      const content = response.text?.trim();
      if (!content) {
        throw new Error("Gemini returned an empty response");
      }
      return {
        content,
      };
    } catch (err) {
      throw new Error("Failed to generate response from Gemini");
    }
  }

  private buildPrompt(input: GenerateResponseInput): string {
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

  async validateConnection(apiKey: string, chatModel: string): Promise<void> {
    const key = apiKey.trim();
    if (!key) {
      throw new Error("API key is required");
    }
    if (!chatModel.trim()) {
      throw new Error("Chat model is required");
    }
    try {
      const gemini = createGeminiClient(key);
      const response = await gemini.models.generateContent({
        model: chatModel,
        contents:
          "Reply with only the word OK. This is a provider validation request.",
      });
      const content = response.text?.trim();
      if (!content) {
        throw new Error("Gemini returned an empty response");
      }
    } catch (error) {
      console.error("Gemini validation failed:", error);
      throw new Error("Invalid Gemini API key or chat model");
    }
  }
}
export const geminiService = new GeminiService();
