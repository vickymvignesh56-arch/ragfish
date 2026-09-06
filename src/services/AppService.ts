import type { App } from "../model/app.js";
import {
  AppRepository,
  appRepository,
  type UpdateApp,
} from "../repository/AppRepository.js";
import type { CreateAppRequest } from "../dto/apps/CreateAppRequest.js";

export function createSlugName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function uniqueSlugName(
  name: string,
  userId: string,
): Promise<string> {
  const baseSlug = createSlugName(name);
  const slugs: string[] = await appRepository.findAppSlugs(userId, baseSlug);
  if (slugs.length === 0) {
    return baseSlug;
  }
  let count = 1;
  while (slugs.includes(`${baseSlug}-${count}`)) {
    count++;
  }
  return `${baseSlug}-${count}`;
}

export class AppService {
  constructor(private readonly appRepository: AppRepository) {}

  async createApp(
    userId: string,
    appParam: CreateAppRequest,
  ): Promise<App | null> {
    const slugName = await uniqueSlugName(appParam.name, userId);
    return this.appRepository.create({
      name: appParam.name,
      slug: slugName,
      userId: userId,
      systemPrompt: appParam.systemPrompt,
      description: appParam.description ?? "",
      status: appParam.status ?? true,
      llmProvider: appParam.llmProvider ?? false,
    });
  }

  async getApps(userId: string): Promise<App[]> {
    return this.appRepository.findAppAndUserId(userId);
  }

  async getAppDetails(userId: string, appId: string): Promise<App | null> {
    return this.appRepository.findOne(userId, appId);
  }

  async deleteApp(userId: string, appId: string): Promise<boolean> {
    return this.appRepository.deleteApp(userId, appId);
  }

  async updateApp(
    userId: string,
    appId: string,
    appParam: UpdateApp,
  ): Promise<App | null> {
    const app = await this.appRepository.findOne(userId, appId);
    if (!app) {
      return null;
    }
    if (appParam.name && appParam.name !== app.name) {
      appParam.slug = await uniqueSlugName(appParam.name, userId);
    }
    if (appParam.slug && appParam.slug !== app.slug) {
      appParam.slug = await uniqueSlugName(appParam.slug, userId);
    }
    return this.appRepository.update(userId, appId, appParam);
  }
}
export const appService = new AppService(appRepository);
