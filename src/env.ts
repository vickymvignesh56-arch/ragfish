export function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
}

export function getEnvOrDefault(key: string, defaultValue: string): string {
  const value = process.env[key];
  return value !== undefined ? value : defaultValue;
}

export function isBoolean(key: string): boolean {
  return process.env[key] === "true";
}

export function isNumber(key: string): number {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) {
    throw new Error(`Environment variable ${key} must be a valid number`);
  }
  return numberValue;
}

export type DbConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

export const dbConfig: DbConfig = {
  host: getEnv("HOST"),
  port: Number(getEnv("DB_PORT")),
  username: getEnv("DB_USERNAME"),
  password: getEnv("DB_PASSWORD"),
  database: getEnv("DB_NAME"),
};

export const PORT = parseInt(getEnvOrDefault("PORT", "3000"));

export type AuthConfig = {
  jwtSecretKey: string;
};

export const authConfig: AuthConfig = {
  jwtSecretKey: getEnv("JWT_SECRET"),
};

export type QdrantConfig = {
  url: string;
};

export const qdrantConfig: QdrantConfig = {
  url: getEnv("QDRANT_URL"),
};

export type GeminiConfig = {
  apiKey: string;
  embeddingModel: string;
  generationModel: string;
};

export const geminiConfig: GeminiConfig = {
  apiKey: getEnv("GEMINI_API_KEY"),
  embeddingModel: getEnv("GEMINI_EMBEDDING_MODEL"),
  generationModel: getEnv("GEMINI_GENERATION_MODEL"),
};

type QdrantDistance = "Cosine" | "Euclid" | "Dot" | "Manhattan";

export type QdrantVectorConfig = {
  size: number;
  distance: QdrantDistance;
};
export const qdrantVectorConfig: QdrantVectorConfig = {
  size: Number(getEnvOrDefault("QDRANT_SIZE", "3072")),
  distance: getEnvOrDefault("QDRANT_DISTANCE", "Cosine") as QdrantDistance,
};

export type MailConfig = {
  host: string;
  port: number;
  secure: boolean;
  from: string;
  auth: {
    user: string;
    password: string;
  };
};

export const mailConfig: MailConfig = {
  host: getEnv("MAIL_HOST"),
  port: Number(getEnv("MAIL_PORT")),
  secure: getEnv("MAIL_SECURE") === "true",
  from: getEnv("MAIL_FROM"),
  auth: {
    user: getEnv("MAIL_USER"),
    password: getEnv("MAIL_PASSWORD"),
  },
};

export type RedisConfig = {
  url: string;
};

export const redisConfig: RedisConfig = {
  url: getEnv("REDIS_URL"),
};
