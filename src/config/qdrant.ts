import { QdrantClient } from "@qdrant/js-client-rest";
import { qdrantConfig } from "../env.js";

export const qdrantClient = new QdrantClient({
  url: qdrantConfig.url,
});
