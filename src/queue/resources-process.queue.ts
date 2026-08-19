import { Queue } from "bullmq";
import { redisConnection } from "../config/Redies.js";

export type ResourceProcessJob = {
  channelId: string;
  userId: string;
  resourceId: string;
};

export const RESOURCES_PROCESS_QUEUE_NAME = "resources-process";

export const resouresProcessingQueue = new Queue<ResourceProcessJob>(
  RESOURCES_PROCESS_QUEUE_NAME,
  {
    connection: redisConnection,
    defaultJobOptions: {
      attempts: 3,
      removeOnComplete: 1000,
      removeOnFail: 5000,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
    },
  },
);
