import { geminiConfig } from "../env.js";
import { gemini } from "../config/gemini.js";

export class EmbeddingService {
  async generateEmbedding(text: string): Promise<number[]> {
    const trimedText = text.trim();
    if (!trimedText) {
      throw new Error("Embedding text cannot be empty");
    }
    if (!geminiConfig.apiKey) {
      throw new Error("Gemini API key is not configured");
    }
    if (!geminiConfig.embeddingModel) {
      throw new Error("Gemini embedding model is not configured");
    }
    try {
      const respones = await gemini.models.embedContent({
        model: geminiConfig.embeddingModel,
        contents: trimedText,
      });
      const embedding = respones.embeddings?.[0]?.values;
      if (!embedding || embedding.length === 0) {
        throw new Error("Gemini returned an empty embedding");
      }
      return embedding;
    } catch (err) {
      console.error("Gemini embedding generation failed");
      throw new Error("Failed to generate text embedding");
    }
  }
}
export const embeddingService = new EmbeddingService();
