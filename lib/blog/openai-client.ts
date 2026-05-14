import OpenAI from "openai";

let client: OpenAI | null = null;

export function getOpenAi(): OpenAI {
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

export const BLOG_MODEL = "gpt-5-nano";
