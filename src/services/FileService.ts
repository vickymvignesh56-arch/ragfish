import fs from "fs/promises";
import path from "path";
import { storage } from "../env.js";
import {
  ChannelResourceService,
  channelResourceService,
} from "./ChannelResourceService.js";
import { ChannelService, channelService } from "./ChannelService.js";
import {
  ChannelResource,
  type ChannelResourceType,
} from "../model/channel-resource.js";

export class FileService {
  constructor(
    private readonly channelResourceService: ChannelResourceService,
    private readonly channelService: ChannelService,
  ) {}

  async fileUpload(
    file: Express.Multer.File,
    channelId: string,
    userId: string,
  ): Promise<ChannelResource | null> {
    if (!file) {
      throw new Error("File is required");
    }
    const existchannel = await this.channelService.findBychannelIdAndUserId(
      userId,
      channelId,
    );
    if (!existchannel) {
      throw new Error("Channel not found");
    }
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = [".pdf", ".docx"];
    if (!allowedExtensions.includes(ext)) {
      throw new Error(
        "Invalid file type. Only PDF and DOCX files are allowed.",
      );
    }
    const folderName = path.join(storage.uploadDir, channelId);
    await fs.mkdir(folderName, { recursive: true });
    const safeOriginalName = path.basename(file.originalname);
    const uniqueId = crypto.randomUUID();
    const fileName = `${uniqueId}-${safeOriginalName}`;
    const filePath = path.join(folderName, fileName);
    await fs.writeFile(filePath, file.buffer);
    try {
      const resource = await this.channelResourceService.create(
        {
          fileName,
          filePath,
          size: file.size,
          fileType: ext.slice(1) as ChannelResourceType,
          status: "pending",
          additionalInfo: {
            originalName: safeOriginalName,
            mimeType: file.mimetype,
          },
        },
        channelId,
      );
      return resource;
    } catch (error) {
      try {
        await fs.unlink(filePath);
      } catch {
        // Ignore cleanup error
      }
      throw error;
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error: any) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
  }
}
export const fileService = new FileService(
  channelResourceService,
  channelService,
);
