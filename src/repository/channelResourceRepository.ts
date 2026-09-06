import { AppDataSource } from "../config/database.js";
import {
  ChannelResource,
  type ChannelResourceType,
  type UploadStatus,
} from "../model/channel-resource.js";

export type ChannelResourceRequest = {
  fileName: string;
  filePath: string;
  size: number;
  fileType: ChannelResourceType;
  additionalInfo: any;
  status: UploadStatus;
};

export class ChannelResourceRepository {
  private repository;
  constructor() {
    this.repository = AppDataSource.getRepository(ChannelResource);
  }
  findById(id: string): Promise<ChannelResource | null> {
    return this.repository.findOne({ where: { id } });
  }

  findByChannelId(channelId: string): Promise<ChannelResource[]> {
    return this.repository.find({ where: { channelId } });
  }

  async create(
    channelResource: ChannelResourceRequest,
    channelId: string,
  ): Promise<ChannelResource | null> {
    const newResource = {
      fileName: channelResource.fileName,
      filePath: channelResource.filePath,
      size: channelResource.size,
      fileType: channelResource.fileType,
      additionalInfo: channelResource.additionalInfo ?? "",
      status: channelResource.status,
      channelId: channelId,
    };
    return this.repository.save(newResource);
  }

  update(channelResource: ChannelResource): Promise<ChannelResource> {
    return this.repository.save(channelResource);
  }

  async updateStatus(
    id: string,
    status: UploadStatus,
    channelId: string,
  ): Promise<ChannelResource> {
    const resource = await this.repository.findOne({
      where: { id, channelId },
    });
    if (!resource) {
      throw new Error("Resource not found");
    }
    resource.status = status;
    return this.repository.save(resource);
  }

  async delete(id: string, channelId: string): Promise<boolean> {
    const result = await this.repository.delete({ id, channelId });
    return (result.affected ?? 0) > 0;
  }

  async findByIdandChannelId(
    id: string,
    channelId: string,
  ): Promise<ChannelResource | null> {
    const result = await this.repository.findOne({ where: { id, channelId } });
    return result;
  }
}
export const channelResourceRepository = new ChannelResourceRepository();
