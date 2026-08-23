import { AppDataSource } from "../config/database.js";
import { App } from "../model/app.js";

export class AppRepository {
  private repository;
  constructor() {
    this.repository = AppDataSource.getRepository(App);
  }

  findAppAndLlmProvide(userId: string, appId: string): Promise<App | null> {
    return this.repository.findOne({
      where: { userId: userId, id: appId, llmProvider: true },
    });
  }
}
