import type { EmbeddingProvider } from "./EmbeddingProvider.js";
import { GeminiEmbeddingProvider } from "./embedding/GeminiEmbedding.provider.js";

const embeddingProviders: Record<string, EmbeddingProvider> = {
  GEMINI: new GeminiEmbeddingProvider(),
};

export function getEmbeddingProvider(provider: string) {
  const normalizedProvider = provider.trim().toUpperCase();
  const embeddingProvider = embeddingProviders[normalizedProvider];
  if (!embeddingProvider) {
    throw new Error(`Unsupported embedding provider: ${provider}`);
  }
  return embeddingProvider;
}
