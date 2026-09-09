import type { UserAppChannel } from "../model/user-app-channel.js";
import {
  AppChannelRepository,
  appChannelRepository,
} from "../repository/AppChannelRepository.js";
import { appService, AppService } from "./AppService.js";
import { ChannelService, channelService } from "./ChannelService.js";

export class AppChannelService {
  constructor(
    private readonly repository: AppChannelRepository,
    private readonly appService: AppService,
    private readonly channelService: ChannelService,
  ) {}

  findById(id: string): Promise<UserAppChannel | null> {
    return this.repository.findById(id);
  }

  findByAppId(appId: string): Promise<UserAppChannel[]> {
    return this.repository.findByAppId(appId);
  }

  findByAppIdAndChannelId(
    appId: string,
    channelId: string,
  ): Promise<UserAppChannel | null> {
    return this.repository.findByAppIdAndChannelId(appId, channelId);
  }

  findAppIdAndChannelId(
    appId: string,
    channelId: string,
    id: string,
  ): Promise<UserAppChannel[]> {
    return this.repository.findAppIdAndChannelId(id, appId, channelId);
  }

  findByIdAndAppId(appId: string, id: string) {
    return this.repository.findByIdAndAppId(appId, id);
  }

  findOneByIdAndAppId(appId: string, id: string) {
    return this.repository.findOneByIdAndAppId(appId, id);
  }

  async createAppChannel(
    channelId: string,
    appId: string,
    userId: string,
  ): Promise<UserAppChannel | null> {
    const app = await this.appService.getAppDetails(userId, appId);
    if (!app) {
      return null;
    }
    const channel = await this.channelService.findBychannelIdAndUserId(
      userId,
      channelId,
    );
    if (!channel) {
      return null;
    }
    return await this.repository.create(channel.id, app.id);
  }

  async getAppChannel(
    appChannelId: string,
    appId: string,
    userId: string,
  ): Promise<UserAppChannel | null> {
    const app = await this.appService.getAppDetails(userId, appId);
    if (!app) {
      return null;
    }
    return await this.repository.findOneByIdAndAppId(appId, appChannelId);
  }
}

export const appChannelService = new AppChannelService(
  appChannelRepository,
  appService,
  channelService,
);
