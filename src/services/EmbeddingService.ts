import { getEmbeddingProvider } from "../providers/EmbeddingFactory.js";
import { llmProviderService } from "./LLMProviderService.js";

export class EmbeddingService {
  async generateEmbedding(userId: string, text: string): Promise<number[]> {
    const trimmedText = text.trim();
    if (!trimmedText) {
      throw new Error("Embedding text cannot be empty");
    }
    const llmProvider = await llmProviderService.getActiveProvider(userId);
    if (!llmProvider.apiKey) {
      throw new Error("LLM provider API key is not configured");
    }
    if (!llmProvider.embeddingModel) {
      throw new Error("LLM provider embedding model is not configured");
    }
    const embeddingProvider = getEmbeddingProvider(llmProvider.provider);
    const config = {
      userId: userId,
      apiKey: llmProvider.apiKey,
      model: llmProvider.embeddingModel,
    };
    const embedding = await embeddingProvider.generateEmbedding(
      trimmedText,
      config,
    );
    return embedding;
  }
}

export const embeddingService = new EmbeddingService();
