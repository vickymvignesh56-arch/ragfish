import crypto from "crypto";
import { cryptoConfig } from "../env.js";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const MIN_ENCRYPTED_DATA_LENGTH = IV_LENGTH + AUTH_TAG_LENGTH + 1;

function getEncryptionKey(): Buffer {
  if (!cryptoConfig.secretKey) {
    throw new Error("CRYPTO_SECRET_KEY is not configured");
  }
  return crypto.createHash("sha256").update(cryptoConfig.secretKey).digest();
}

export function encrypt(text: string): string {
  if (!text.trim()) {
    throw new Error("Text to encrypt cannot be empty");
  }
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString("base64");
}

export function decrypt(encryptedText: string): string {
  if (!encryptedText.trim()) {
    throw new Error("Encrypted text cannot be empty");
  }
  const key = getEncryptionKey();
  const data = Buffer.from(encryptedText, "base64");
  if (data.length < MIN_ENCRYPTED_DATA_LENGTH) {
    throw new Error("Invalid encrypted data");
  }
  const iv = data.subarray(0, IV_LENGTH);
  const authTag = data.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = data.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}
