export interface GenerateResponseInput {
  userId: string;
  message: string;
  systemPrompt?: string;
  context?: string;
}

export interface LLMResponse {
  content: string;
}

export interface LLMClient {
  generateResponse(input: GenerateResponseInput): Promise<LLMResponse>;
}
