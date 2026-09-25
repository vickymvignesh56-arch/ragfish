import OpenAI from "openai";

import type {
  GenerateResponseInput,
  LLMClient,
  LLMResponse,
} from "../interface/LLMClient.js";

import { llmProviderService } from "./LLMProviderService.js";
import { buildPrompt } from "../utils/prompt-builder.js";

export class OpenAIService implements LLMClient {
  async generateResponse(input: GenerateResponseInput): Promise<LLMResponse> {
    const message = input.message.trim();
    if (!message) {
      throw new Error("Message cannot be empty");
    }
    const { provider, decryptedApiKey } =
      await llmProviderService.getActiveProviderWithDecryptedKey(input.userId);
    if (provider.provider !== "OPENAI") {
      throw new Error(
        `Active LLM provider is ${provider.provider}, not OPENAI`,
      );
    }
    const prompt = buildPrompt(input);
    try {
      const openai = new OpenAI({
        apiKey: decryptedApiKey,
      });
      const response = await openai.responses.create({
        model: provider.chatModel,
        input: prompt,
      });
      const content = response.output_text?.trim();
      if (!content) {
        throw new Error("OpenAI returned an empty response");
      }
      return {
        content,
      };
    } catch (error) {
      console.error("OpenAI response generation failed:", error);

      throw new Error("Failed to generate response from OpenAI");
    }
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
      const openai = new OpenAI({
        apiKey: key,
      });

      const response = await openai.responses.create({
        model: chatModel,
        input:
          "Reply with only the word OK. This is a provider validation request.",
      });

      const content = response.output_text?.trim();

      if (!content) {
        throw new Error("OpenAI returned an empty response");
      }
    } catch (error) {
      console.error("OpenAI validation failed:", error);
      throw new Error("Invalid OpenAI API key or chat model");
    }
  }
}

export const openAIService = new OpenAIService();
