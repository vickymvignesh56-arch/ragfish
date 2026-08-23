import type {
  EmbeddingProvider,
  EmbeddingProviderConfig,
} from "../EmbeddingProvider.js";
import { createGeminiClient } from "../../config/gemini.js";
import { llmProviderService } from "../../services/LLMProviderService.js";

export class GeminiEmbeddingProvider implements EmbeddingProvider {
  async generateEmbedding(
    text: string,
    config: EmbeddingProviderConfig,
  ): Promise<number[]> {
    if (!config.apiKey) {
      throw new Error("Gemini API key is not configured");
    }
    if (!config.model) {
      throw new Error("Gemini embedding model is not configured");
    }
    try {
      const { provider, decryptedApiKey } =
        await llmProviderService.getActiveProviderWithDecryptedKey(
          config.userId,
        );
      const gemini = await createGeminiClient(decryptedApiKey);
      const respones = await gemini.models.embedContent({
        model: provider.embeddingModel,
        contents: text,
      });
      const embedding = await respones.embeddings?.[0]?.values;
      if (!embedding || embedding.length === 0) {
        throw new Error("Gemini returned an empty embedding");
      }
      return embedding;
    } catch (error) {
      console.error("Gemini embedding generation failed:", error);
      throw new Error("Failed to generate Gemini embedding");
    }
  }
}
