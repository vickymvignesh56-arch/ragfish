import { channelResourceService } from "./ChannelResourceService.js";
import { channelService } from "./ChannelService.js";
import { indexService } from "./IndexService.js";
import type { ChannelProcess } from "../channel-handler/index.js";
import { fileHandler } from "../channel-handler/file.handler.js";

export class ProcessResourceService {
  async processResource(
    channelId: string,
    userId: string,
    resourceId: string,
  ): Promise<void> {
    const existchannel = await channelService.findBychannelIdAndUserId(
      userId,
      channelId,
    );
    if (!existchannel) {
      throw new Error("Channel not found");
    }
    const channelResource = await channelResourceService.findById(resourceId);
    if (!channelResource) {
      throw new Error("Resource not found");
    }
    await channelResourceService.updateStatus(
      resourceId,
      "processing",
      channelId,
    );
    try {
      const process: ChannelProcess = {
        userId,
        channelId,
        resourceId,
        ingestPoint: async (text, fileName, filePath) => {
          await indexService.ingestPoint(
            userId,
            channelId,
            resourceId,
            fileName,
            filePath,
            text,
          );
        },
        clearIndexPointsResource: async () => {
          await indexService.clearIndexPointsResource(userId, resourceId);
        },
      };
      await fileHandler.processResource(process);
      await channelResourceService.updateStatus(resourceId, "ready", channelId);
    } catch (error) {
      await channelResourceService.updateStatus(
        resourceId,
        "failed",
        channelId,
      );
      throw error;
    }
  }
}

export const processResourceService = new ProcessResourceService();
