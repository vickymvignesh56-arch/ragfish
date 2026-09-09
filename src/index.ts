import "reflect-metadata";
import "dotenv/config";
import { AppDataSource } from "./config/database.js";
import app from "./config/express.js";
import { PORT } from "./env.js";
import { showServerInfo } from "./info/server-info.js";
import { resouresProcessingWorker } from "./worker/resources-process.worker.js";
import { resouresProcessingQueue } from "./queue/resources-process.queue.js";
const shutdown = async (signal: string) => {
  await resouresProcessingWorker.close();
  await resouresProcessingQueue.close();
};
await AppDataSource.initialize();
app.listen(PORT, () => {
  showServerInfo(PORT);
});
const shutdownSignals = ["SIGINT", "SIGTERM"];

export const setupShutdown = (shutdown: (signal: string) => Promise<void>) => {
  for (const signal of shutdownSignals) {
    process.on(signal, () => {
      void shutdown(signal);
    });
  }
};

setupShutdown(shutdown);
