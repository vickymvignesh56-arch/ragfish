export interface EmbeddingProviderConfig {
  userId: string;
  apiKey: string;
  model: string;
}

export interface EmbeddingProvider {
  generateEmbedding(
    text: string,
    config: EmbeddingProviderConfig,
  ): Promise<number[]>;
}
