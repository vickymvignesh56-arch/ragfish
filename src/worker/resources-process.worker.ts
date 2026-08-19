import { Worker } from "bullmq";
import { RESOURCES_PROCESS_QUEUE_NAME } from "../queue/resources-process.queue.js";
import type { ResourceProcessJob } from "../queue/resources-process.queue.js";
import { redisConnection } from "../config/Redies.js";

export const resouresProcessingWorker = new Worker<ResourceProcessJob>(
  RESOURCES_PROCESS_QUEUE_NAME,
  async () => {
    console.log("resouresProcessingWorker");
  },
  {
    connection: redisConnection,
    concurrency: 5,
  },
);

resouresProcessingWorker.on("completed", (job, result) => {
  console.log(` Job ${job.id} completed`, result);
});

resouresProcessingWorker.on("failed", (job, error) => {
  console.error(`Job ${job?.id} failed:`, error.message);
});
