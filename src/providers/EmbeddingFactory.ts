import type { EmbeddingProvider } from "./EmbeddingProvider.js";
import { GeminiEmbeddingProvider } from "./embedding/GeminiEmbedding.provider.js";
import { OpenAiEmbeddingProvider } from "./embedding/OpenAiEmbeddingProvider.js";

const embeddingProviders: Record<string, EmbeddingProvider> = {
  GEMINI: new GeminiEmbeddingProvider(),
  OPENAI: new OpenAiEmbeddingProvider(),
  ANTHROPIC: new OpenAiEmbeddingProvider(),
};

export function getEmbeddingProvider(provider: string) {
  const normalizedProvider = provider.trim().toUpperCase();
  const embeddingProvider = embeddingProviders[normalizedProvider];
  if (!embeddingProvider) {
    throw new Error(`Unsupported embedding provider: ${provider}`);
  }
  return embeddingProvider;
}
