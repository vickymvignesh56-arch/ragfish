import type {
  ChannelResource,
  UploadStatus,
} from "../model/channel-resource.js";
import {
  ChannelResourceRepository,
  channelResourceRepository,
  type ChannelResourceRequest,
} from "../repository/channelResourceRepository.js";
import {
  ChannelRepository,
  channelRepository,
} from "../repository/ChannelRepository.js";
import { fileHandler } from "../channel-handler/file.handler.js";
export class ChannelResourceService {
  constructor(
    private readonly repository: ChannelResourceRepository,
    private readonly channelRepository: ChannelRepository,
  ) {}

  findByChannelId(channelId: string): Promise<any[]> {
    return this.repository.findByChannelId(channelId);
  }

  findById(id: string): Promise<any | null> {
    return this.repository.findById(id);
  }

  findByIdandChannelId(channelId: string, id: string): Promise<any | null> {
    return this.repository.findByIdandChannelId(id, channelId);
  }

  async delete(channelId: string, id: string): Promise<boolean> {
    return this.repository.delete(id, channelId);
  }

  async updateStatus(
    id: string,
    status: UploadStatus,
    channelId: string,
  ): Promise<ChannelResource> {
    return this.repository.updateStatus(id, status, channelId);
  }

  create(
    channelResource: ChannelResourceRequest,
    channelId: string,
  ): Promise<ChannelResource | null> {
    return this.repository.create({ ...channelResource }, channelId);
  }

  async deleteResource(
    channelId: string,
    resourceId: string,
    userId: string,
  ): Promise<ChannelResource | null> {
    const channel = await this.channelRepository.findChannelIdByUserId(
      userId,
      channelId,
    );
    if (!channel) {
      return null;
    }
    const resource = await this.repository.findByIdandChannelId(
      channelId,
      resourceId,
    );
    if (!resource) {
      return null;
    }
    await fileHandler.clearIndexPointsResource(userId, resourceId);

    return resource;
  }
}
export const channelResourceService = new ChannelResourceService(
  channelResourceRepository,
  channelRepository,
);
