import { channelResourceService } from "../services/ChannelResourceService.js";
import { channelService } from "../services/ChannelService.js";
import { indexService } from "../services/IndexService.js";
import type { ChannelHandler, ChannelProcess } from "./index.js";
import fs from "fs/promises";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export class FileHandler implements ChannelHandler {
  async processResource(resource: ChannelProcess): Promise<void> {
    const { userId, channelId, resourceId } = resource;
    try {
      const extistChannel = await channelService.findBychannelIdAndUserId(
        userId,
        channelId,
      );
      if (!extistChannel) {
        throw new Error("Channel not found");
      }
      const channelResource = await channelResourceService.findByIdandChannelId(
        channelId,
        resourceId,
      );
      if (!channelResource) {
        throw new Error("Resource not found");
      }
      await this.clearIndexPointsResource(userId, resourceId);
      const fileName = channelResource.fileName;
      const filePath = channelResource.filePath;
      const text = await this.extractText(filePath, channelResource.fileType);
      if (!text.trim()) {
        throw new Error("No text found in the uploaded file");
      }
      await indexService.ingestPoint(
        userId,
        channelId,
        resourceId,
        fileName,
        filePath,
        text,
      );
    } catch (error) {
      console.error("Error processing resource:", error);
    }
  }

  async clearIndexPointsResource(
    userId: string,
    resourceId: string,
  ): Promise<void> {
    return await indexService.clearIndexPointsResource(userId, resourceId);
  }

  private async extractText(
    filePath: string,
    fileType: string,
  ): Promise<string> {
    if (fileType === "pdf") {
      const buffer = await fs.readFile(filePath);
      const parser = new PDFParse({
        data: buffer,
      });
      const result = await parser.getText();
      await parser.destroy();
      return result.text;
    }
    if (fileType === "docx") {
      const result = await mammoth.extractRawText({
        path: filePath,
      });

      return result.value;
    }
    throw new Error(`Unsupported file type: ${fileType}`);
  }
}
export const fileHandler = new FileHandler();
