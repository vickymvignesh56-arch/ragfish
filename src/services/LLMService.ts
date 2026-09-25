import type {
  GenerateResponseInput,
  LLMResponse,
} from "../interface/LLMClient.js";
import { AnthropicService, anthropicService } from "./AnthropicService.js";
import { geminiService, GeminiService } from "./GeminiService.js";
import {
  llmProviderService,
  LLMProviderService,
} from "./LLMProviderService.js";
import { openAIService, OpenAIService } from "./OpenAiService.js";

export class LLMService {
  constructor(
    private readonly llmProviderService: LLMProviderService,
    private readonly geminiService: GeminiService,
    private readonly openAIService: OpenAIService,
    private readonly anthropicService: AnthropicService,
  ) {}

  async generateResponse(input: GenerateResponseInput): Promise<LLMResponse> {
    const provider = await this.llmProviderService.getActiveProvider(
      input.userId,
    );
    switch (provider.provider) {
      case "GEMINI":
        return await this.geminiService.generateResponse(input);
      case "OPENAI":
        return await this.openAIService.generateResponse(input);
      case "ANTHROPIC":
        return await this.anthropicService.generateResponse(input);
      default:
        throw new Error(`Unsupported LLM provider: ${provider.provider}`);
    }
  }
}
export const llmService = new LLMService(
  llmProviderService,
  geminiService,
  openAIService,
  anthropicService,
);
