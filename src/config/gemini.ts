import { GoogleGenAI } from "@google/genai";
import { geminiConfig } from "../env.js";

export const gemini = new GoogleGenAI({
  apiKey: geminiConfig.apiKey,
});
