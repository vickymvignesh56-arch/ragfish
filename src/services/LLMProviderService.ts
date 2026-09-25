import type { LLMProviderRequest } from "../dto/lmprovider/LLMProviderRequest.js";
import { LLMProvider, LLMProviderType } from "../model/LLMProvider.js";
import {
  LLMProviderRepository,
  llmProviderRepository,
} from "../repository/LLMProviderRepository.js";
import { BadRequestError, NotFoundError } from "routing-controllers";
import { decrypt, encrypt } from "../utils/crypto.js";
import { GeminiService, geminiService } from "./GeminiService.js";
import { OpenAIService, openAIService } from "./OpenAiService.js";
import { AnthropicService, anthropicService } from "./AnthropicService.js";
export interface LLMProviderResponse {
  id: string;
  provider: string;
  apiKey: string;
  embeddingModel: string;
  chatModel: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class LLMProviderService {
  constructor(
    private readonly llmProvider: LLMProviderRepository,
    private readonly geminiService: GeminiService,
    private readonly openAIService: OpenAIService,
    private readonly anthropicService: AnthropicService,
  ) {}

  async getActiveProvider(userId: string): Promise<LLMProvider> {
    const provider = await this.llmProvider.findActiveByUserId(userId);
    if (!provider) {
      throw new Error("No active LLM provider configured");
    }
    return provider;
  }

  async upsertProvider(userId: string, llmProviderRequest: LLMProviderRequest) {
    const existingProvider = await this.llmProvider.findByUserId(userId);
    if (!existingProvider) {
      const apiKey = llmProviderRequest.apiKey?.trim();
      if (!apiKey) {
        throw new BadRequestError("API key is required");
      }
      // Validate API key BEFORE saving
      await this.validateProvider(
        llmProviderRequest.provider,
        apiKey,
        llmProviderRequest.chatModel,
      );
      const provider = new LLMProvider();
      provider.userId = userId;
      provider.provider = llmProviderRequest.provider;
      provider.apiKey = encrypt(apiKey);
      provider.embeddingModel = llmProviderRequest.embeddingModel;
      provider.chatModel = llmProviderRequest.chatModel;
      // New provider always inactive
      provider.isActive = false;
      const savedProvider = await this.llmProvider.create(provider);
      return this.toResponse(savedProvider);
    }
    let apiKey: string;
    if (llmProviderRequest.apiKey?.trim()) {
      apiKey = llmProviderRequest.apiKey.trim();
    } else {
      apiKey = decrypt(existingProvider.apiKey);
    }
    await this.validateProvider(
      llmProviderRequest.provider,
      apiKey,
      llmProviderRequest.chatModel,
    );
    existingProvider.provider =
      llmProviderRequest.provider ?? existingProvider.provider;
    existingProvider.apiKey = encrypt(apiKey) ?? existingProvider.apiKey;
    existingProvider.embeddingModel =
      llmProviderRequest.embeddingModel ?? existingProvider.embeddingModel;
    existingProvider.chatModel =
      llmProviderRequest.chatModel ?? existingProvider.chatModel;
    existingProvider.isActive = false;
    const savedProvider = await this.llmProvider.create(existingProvider);
    return this.toResponse(savedProvider);
  }

  async updateStatus(userId: string, isActive: boolean) {
    const provider = await this.llmProvider.findByUserId(userId);
    if (!provider) {
      throw new NotFoundError("LLM provider not configured");
    }
    if (!isActive) {
      provider.isActive = false;
      const savedProvider = await this.llmProvider.create(provider);
      return this.toResponse(savedProvider);
    }
    const apiKey = decrypt(provider.apiKey);
    await this.validateProvider(provider.provider, apiKey, provider.chatModel);
    provider.isActive = true;
    const savedProvider = await this.llmProvider.create(provider);
    return this.toResponse(savedProvider);
  }

  async getProvider(userId: string): Promise<LLMProvider[]> {
    const provider = await this.llmProvider.findAllByUserId(userId);
    if (provider.length === 0) {
      throw new Error("LLM provider not configured");
    }
    return provider;
  }

  async getActiveProviderWithDecryptedKey(userId: string): Promise<{
    provider: LLMProvider;
    decryptedApiKey: string;
  }> {
    const provider = await this.getActiveProvider(userId);
    return {
      provider,
      decryptedApiKey: decrypt(provider.apiKey),
    };
  }

  private toResponse(provider: LLMProvider): LLMProviderResponse {
    const originalApiKey = provider.apiKey;
    return {
      id: provider.id,
      provider: provider.provider,
      apiKey: this.maskApiKey(originalApiKey),
      embeddingModel: provider.embeddingModel,
      chatModel: provider.chatModel,
      isActive: provider.isActive,
      createdAt: provider.createdAt,
      updatedAt: provider.updatedAt,
    };
  }

  private maskApiKey(apiKey: string): string {
    if (apiKey.length <= 9) {
      return "********";
    }
    const firstFive = apiKey.slice(0, 5);
    const lastFour = apiKey.slice(-4);
    return `${firstFive}********${lastFour}`;
  }

  async validateProvider(
    provider: LLMProviderType,
    apiKey: string,
    chatModel: string,
  ) {
    const key = apiKey.trim();
    if (!key) {
      throw new Error("API key is required");
    }
    if (!chatModel.trim()) {
      throw new Error("Chat model is required");
    }
    switch (provider) {
      case LLMProviderType.GEMINI:
        await this.geminiService.validateConnection(apiKey, chatModel);
        return;
      case LLMProviderType.OPENAI:
        await this.openAIService.validateConnection(apiKey, chatModel);
        return;
      case LLMProviderType.GEMINI:
        await this.anthropicService.validateConnection(apiKey, chatModel);
        return;
      default:
        throw new Error(`Unsupported LLM provider: ${provider}`);
    }
  }
}
export const llmProviderService = new LLMProviderService(
  llmProviderRepository,
  geminiService,
  openAIService,
  anthropicService,
);
