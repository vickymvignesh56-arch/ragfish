import { redisConfig } from "../env.js";

export const redisConnection = {
  url: redisConfig.url,
  maxRetriesPerRequest: null,
};
