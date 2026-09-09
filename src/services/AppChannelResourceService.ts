import type { UserAppChannelResource } from "../model/user-app-channel-resource.js";
import { appService, AppService } from "./AppService.js";
import { AppChannelService, appChannelService } from "./AppChannelService.js";
import {
  AppChannelResourceRepository,
  appChannelResourceRepository,
} from "../repository/AppChannelResourceRepository.js";
import {
  ChannelResourceService,
  channelResourceService,
} from "./ChannelResourceService.js";

export class AppChannelResourceService {
  constructor(
    private readonly appService: AppService,
    private readonly appChannelService: AppChannelService,
    private readonly appChannelResourceRepository: AppChannelResourceRepository,
    private readonly channelResourceService: ChannelResourceService,
  ) {}

  findById(id: string): Promise<UserAppChannelResource | null> {
    return this.appChannelResourceRepository.findById(id);
  }
  async findByAppChannelIdAndResourceId(
    userAppChannelId: string,
    channelResourceId: string,
  ): Promise<UserAppChannelResource | null> {
    return await this.appChannelResourceRepository.findByAppChannelIdAndResourceId(
      channelResourceId,
      userAppChannelId,
    );
  }

  async findByIdAndResourceId(
    userAppChannelId: string,
    id: string,
  ): Promise<UserAppChannelResource | null> {
    return await this.appChannelResourceRepository.findByIdAndResourceId(
      id,
      userAppChannelId,
    );
  }

  async createAppChannelResource(
    resourceId: string,
    appId: string,
    userId: string,
    appChannelId: string,
  ): Promise<UserAppChannelResource | null> {
    const app = await this.appService.getAppDetails(userId, appId);
    if (!app) {
      return null;
    }
    const appChannel = await this.appChannelService.findOneByIdAndAppId(
      appId,
      appChannelId,
    );
    if (!appChannel) {
      return null;
    }
    const resource = await this.channelResourceService.findByIdandChannelId(
      appChannel.channelId,
      resourceId,
    );
    if (!resource) {
      return null;
    }
    return await this.appChannelResourceRepository.create(
      appChannelId,
      resourceId,
    );
  }

  async getAppChannelResource(
    resourceId: string,
    appId: string,
    userId: string,
    appChannelId: string,
  ): Promise<UserAppChannelResource | null> {
    const app = await this.appService.getAppDetails(userId, appId);
    if (!app) {
      return null;
    }
    const appChannel = await this.appChannelService.findOneByIdAndAppId(
      appId,
      appChannelId,
    );
    if (!appChannel) {
      return null;
    }
    const resource = await this.channelResourceService.findByIdandChannelId(
      appChannel.channelId,
      resourceId,
    );
    if (!resource) {
      return null;
    }
    return await this.appChannelResourceRepository.findByAppChannelIdAndResourceId(
      appChannelId,
      resourceId,
    );
  }
}

export const appChannelResourceService = new AppChannelResourceService(
  appService,
  appChannelService,
  appChannelResourceRepository,
  channelResourceService,
);
