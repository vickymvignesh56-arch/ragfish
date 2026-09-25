import { BadRequestError } from "routing-controllers";
import {
  chatMessageRepository,
  ChatMessageRepository,
} from "../repository/ChatMessageRepository.js";
import {
  chatRepository,
  ChatRepository,
  type messageRequest,
  type updateChatRequest,
} from "../repository/ChatRepository.js";
import {
  AppChannelResourceService,
  appChannelResourceService,
} from "./AppChannelResourceService.js";
import { IndexService, indexService } from "./IndexService.js";
import { EmbeddingService, embeddingService } from "./EmbeddingService.js";
import { LLMService, llmService } from "./LLMService.js";
import { AppService, appService } from "./AppService.js";
import type { Chat } from "../model/chat.js";
import type { ChatMessage } from "../model/chat.message.js";

export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly chatMessageRepository: ChatMessageRepository,
    private readonly appChannelResourceService: AppChannelResourceService,
    private readonly embeddingService: EmbeddingService,
    private readonly indexService: IndexService,
    private readonly llmService: LLMService,
    private readonly appService: AppService,
  ) {}

  async sendMessage(userId: string, chatParam: messageRequest, appId: string) {
    const app = await this.appService.getAppDetails(userId, appId);
    if (!app) {
      throw new BadRequestError("app not found");
    }
    const message = chatParam.message.trim();
    if (!message) {
      throw new BadRequestError("message is required");
    }
    let resourceIds: string[] | undefined;
    let chatId: string;
    if (chatParam.chatId) {
      const chat = await this.chatRepository.findByIdForContext(
        chatParam.chatId,
        userId,
        appId,
      );
      if (!chat) {
        throw new BadRequestError("Chat not found");
      }
      chatId = chat.id;
      resourceIds = chat?.resourceId;
    } else {
      resourceIds = await this.appChannelResourceService.getResourcesForApp(
        userId,
        appId,
      );
      if (!resourceIds.length) {
        throw new BadRequestError("No resources found for this app");
      }
      const chat = await this.chatRepository.create({
        userId: userId,
        appId: appId,
        title: message.slice(0, 20).toLowerCase().trim(),
        resourceId: resourceIds,
      });
      chatId = chat.id;
    }
    const queryEmbedding = await this.embeddingService.generateEmbedding(
      userId,
      message,
    );
    const searchResults = await this.indexService.searchResource(
      userId,
      resourceIds,
      queryEmbedding,
      5,
    );
    if (!searchResults.length) {
      throw new BadRequestError(
        "No relevant information found in your resources",
      );
    }
    const context = this.buildContext(searchResults);
    const llmResponse = await this.llmService.generateResponse({
      userId,
      message,
      systemPrompt: app.systemPrompt,
      context,
    });
    await this.chatMessageRepository.create({
      chatId,
      role: "user",
      content: message,
    });
    await this.chatMessageRepository.create({
      chatId,
      role: "assistant",
      content: llmResponse.content,
    });
    return {
      chatId,
      message,
      answer: llmResponse.content,
    };
  }

  private buildContext(searchResults: any[]): string {
    return searchResults
      .map((result, index) => {
        const payload = result.payload as {
          text?: string;
          fileName?: string;
          resourceId?: string;
        };
        return `
            SOURCE ${index + 1}
            File:
            ${payload.fileName ?? "Unknown"}
           Resource ID:
           ${payload.resourceId ?? "Unknown"}
          Content:
             ${payload.text ?? ""}
          `;
      })
      .join("\n\n");
  }

  async getMessage(userId: string, appId: string): Promise<Chat[]> {
    return await this.chatRepository.findByUserIdAndAppId(userId, appId);
  }
  async getChatMessage(
    userId: string,
    appId: string,
    chatId: string,
  ): Promise<ChatMessage[]> {
    const chat = await this.chatRepository.findOne(userId, appId, chatId);
    if (!chat) return [];
    return await this.chatMessageRepository.find(chatId);
  }

  async deleteMessage(
    userId: string,
    appId: string,
    chatId: string,
  ): Promise<boolean> {
    const chat = await this.chatRepository.findOne(userId, appId, chatId);
    if (!chat) {
      return false;
    }
    await this.chatMessageRepository.delete(chatId);
    return await this.chatRepository.delete(chatId);
  }

  async updateChat(
    userId: string,
    appId: string,
    chatId: string,
    body: updateChatRequest,
  ): Promise<Chat | null> {
    const chat = await this.chatRepository.findOne(userId, appId, chatId);
    if (!chat) {
      return null;
    }
    return await this.chatRepository.update(body, chatId);
  }
}

export const chatService = new ChatService(
  chatRepository,
  chatMessageRepository,
  appChannelResourceService,
  embeddingService,
  indexService,
  llmService,
  appService,
);
