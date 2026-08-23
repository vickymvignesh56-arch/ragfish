import { AppDataSource } from "../config/database.js";
import { LLMProvider } from "../model/LLMProvider.js";

export class LLMProviderRepository {
  private repository;
  constructor() {
    this.repository = AppDataSource.getRepository(LLMProvider);
  }

  findActiveByUserId(userId: string): Promise<LLMProvider | null> {
    return this.repository.findOne({
      where: { userId: userId, isActive: true },
    });
  }

  find(userId: string): Promise<LLMProvider[] | null> {
    return this.repository.find({ where: { userId: userId, isActive: true } });
  }

  findByUserId(userId: string): Promise<LLMProvider | null> {
    return this.repository.findOne({
      where: { userId: userId },
    });
  }

  async findAllByUserId(userId: string): Promise<LLMProvider[]> {
    return this.repository.find({
      where: {
        userId,
      },
      order: {
        createdAt: "ASC",
      },
    });
  }

  async create(provider: LLMProvider): Promise<LLMProvider> {
    return this.repository.save(provider);
  }
  async findByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<LLMProvider | null> {
    return this.repository.findOne({ where: { id, userId } });
  }

  async findByUserIdAndSlug(
    userId: string,
    slug: string,
  ): Promise<LLMProvider | null> {
    return this.repository.findOne({
      where: {
        userId,
        slug,
      },
    });
  }
  async update(id: string, data: Partial<LLMProvider>): Promise<LLMProvider> {
    await this.repository.update(id, data);
    const updatedProvider = await this.repository.findOne({
      where: {
        id,
      },
    });
    if (!updatedProvider) {
      throw new Error("LLM provider not found after update");
    }
    return updatedProvider;
  }
}

export const llmProviderRepository = new LLMProviderRepository();
