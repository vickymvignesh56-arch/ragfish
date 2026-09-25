import type {
  GenerateResponseInput,
  LLMClient,
  LLMResponse,
} from "../interface/LLMClient.js";

import { llmProviderService } from "./LLMProviderService.js";

import { createAnthropicClient } from "../config/anthropic.js";
import { buildPrompt } from "../utils/prompt-builder.js";

export class AnthropicService implements LLMClient {
  async generateResponse(input: GenerateResponseInput): Promise<LLMResponse> {
    const message = input.message.trim();

    if (!message) {
      throw new Error("Message cannot be empty");
    }

    const { provider, decryptedApiKey } =
      await llmProviderService.getActiveProviderWithDecryptedKey(input.userId);

    if (provider.provider !== "ANTHROPIC") {
      throw new Error(
        `Active LLM provider is ${provider.provider}, not ANTHROPIC`,
      );
    }

    try {
      const anthropic = createAnthropicClient(decryptedApiKey);

      const prompt = buildPrompt(input);

      const response = await anthropic.messages.create({
        model: provider.chatModel,
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const content = response.content
        .filter((block) => block.type === "text")
        .map((block) => block.text)
        .join("")
        .trim();

      if (!content) {
        throw new Error("Anthropic returned an empty response");
      }

      return {
        content,
      };
    } catch (error) {
      console.error("Anthropic response generation failed:", error);

      throw new Error("Failed to generate response from Anthropic");
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
      const anthropic = createAnthropicClient(key);

      const response = await anthropic.messages.create({
        model: chatModel,
        max_tokens: 20,
        messages: [
          {
            role: "user",
            content:
              "Reply with only the word OK. This is a provider validation request.",
          },
        ],
      });

      const content = response.content
        .filter((block) => block.type === "text")
        .map((block) => block.text)
        .join("")
        .trim();

      if (!content) {
        throw new Error("Anthropic returned an empty response");
      }
    } catch (error) {
      console.error("Anthropic validation failed:", error);
      throw new Error("Invalid Anthropic API key or chat model");
    }
  }
}

export const anthropicService = new AnthropicService();
