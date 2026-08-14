import { qdrantClient } from "../config/qdrant.js";
import { qdrantVectorConfig } from "../env.js";

export class QdrantServices {
  getUserCollectionName(userId: string): string {
    return `users_${userId}`;
  }

  async checkCollectionExists(collectionName: string): Promise<boolean> {
    const result = await qdrantClient.collectionExists(collectionName);
    return result.exists;
  }

  async createQdrantCollection(userId: string): Promise<void> {
    const collectionName = await this.getUserCollectionName(userId);
    const exists = await this.checkCollectionExists(collectionName);
    if (exists) {
      return;
    }
    await qdrantClient.createCollection(collectionName, {
      vectors: {
        size: qdrantVectorConfig.size,
        distance: qdrantVectorConfig.distance,
      },
    });
  }
}

export const qdrantServices = new QdrantServices();
