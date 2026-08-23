import type {
  GenerateResponseInput,
  LLMResponse,
} from "../interface/LLMClient.js";
import { geminiService, GeminiService } from "./GeminiService.js";
import {
  llmProviderService,
  LLMProviderService,
} from "./LLMProviderService.js";

export class LLMService {
  constructor(
    private readonly llmProviderService: LLMProviderService,
    private readonly geminiService: GeminiService,
  ) {}

  async generateResponse(input: GenerateResponseInput): Promise<LLMResponse> {
    const provider = await this.llmProviderService.getActiveProvider(
      input.userId,
    );
    switch (provider.provider) {
      case "GEMINI":
        return await this.geminiService.generateResponse(input);
      default:
        throw new Error(`Unsupported LLM provider: ${provider.provider}`);
    }
  }
}
export const llmService = new LLMService(llmProviderService, geminiService);
