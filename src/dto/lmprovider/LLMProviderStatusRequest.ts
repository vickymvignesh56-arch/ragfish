import { IsBoolean } from "class-validator";

export class LLMProviderStatusRequest {
  @IsBoolean()
  isActive!: boolean;
}
