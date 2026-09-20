import { qdrantClient } from "../config/qdrant.js";
import { qdrantServices, QdrantServices } from "./QdrantService.js";
import { EmbeddingService, embeddingService } from "./EmbeddingService.js";
import { chunkText } from "../utils/text-chunker.js";
export class IndexService {
  constructor(
    private readonly qdrantServices: QdrantServices,
    private readonly embeddingService: EmbeddingService,
  ) {}
  async ingestPoint(
    userId: string,
    channelId: string,
    resourceId: string,
    fileName: string,
    filePath: string,
    text: string,
  ): Promise<void> {
    const collectionName = this.qdrantServices.getUserCollectionName(userId);
    const chunks = chunkText(text, 500, 50);
    try {
      for (const chunk of chunks) {
        const embedding = await this.embeddingService.generateEmbedding(
          userId,
          chunk.text,
        );
        await qdrantClient.upsert(collectionName, {
          wait: true,
          points: [
            {
              id: `${resourceId}-${chunk.index}`,
              vector: embedding,
              payload: {
                chunkIndex: chunk.index,
                text: chunk.text,
                channelId,
                resourceId,
                fileName,
                filePath,
              },
            },
          ],
        });
      }
    } catch (error) {
      console.error("Failed to ingest resource:", error);
      throw error;
    }
  }

  async clearIndexPointsResource(userId: string, resourceId: string) {
    const collectionName = this.qdrantServices.getUserCollectionName(userId);
    await qdrantClient.delete(collectionName, {
      wait: true,
      filter: {
        must: [
          {
            key: "resourceId",
            match: {
              value: resourceId,
            },
          },
        ],
      },
    });
  }
}

export const indexService = new IndexService(qdrantServices, embeddingService);
