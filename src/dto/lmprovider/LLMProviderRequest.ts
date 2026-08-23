import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { LLMProviderType } from "../../model/LLMProvider.js";

export class LLMProviderRequest {
  @IsEnum(LLMProviderType)
  @IsNotEmpty()
  provider!: LLMProviderType;

  @IsOptional()
  @IsString()
  apiKey?: string;

  @IsString()
  @IsNotEmpty()
  embeddingModel!: string;

  @IsString()
  @IsNotEmpty()
  chatModel!: string;
}
