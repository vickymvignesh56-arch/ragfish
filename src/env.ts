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
};

export const geminiConfig: GeminiConfig = {
  apiKey: getEnv("GEMINI_API_KEY"),
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
