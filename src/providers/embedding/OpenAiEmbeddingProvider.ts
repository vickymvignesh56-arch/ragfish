import { createOpenAIClient } from "../../config/openai.js";
import { llmProviderService } from "../../services/LLMProviderService.js";
import type {
  EmbeddingProvider,
  EmbeddingProviderConfig,
} from "../EmbeddingProvider.js";

export class OpenAiEmbeddingProvider implements EmbeddingProvider {
  async generateEmbedding(
    text: string,
    config: EmbeddingProviderConfig,
  ): Promise<number[]> {
    if (!config.apiKey) {
      throw new Error("OpenAI API key is not configured");
    }
    if (!config.model) {
      throw new Error("OpenAI embedding model is not configured");
    }
    try {
      const { provider, decryptedApiKey } =
        await llmProviderService.getActiveProviderWithDecryptedKey(
          config.userId,
        );
      const openai = createOpenAIClient(decryptedApiKey);
      const response = await openai.embeddings.create({
        model: provider.embeddingModel,
        input: text,
      });
      const embedding = response.data?.[0]?.embedding;
      if (!embedding || embedding.length === 0) {
        throw new Error("OpenAI returned an empty embedding");
      }
      return embedding;
    } catch (err) {
      console.error("OpenAI embedding generation failed:", err);
      throw new Error("Failed to generate OpenAI embedding");
    }
  }
}
