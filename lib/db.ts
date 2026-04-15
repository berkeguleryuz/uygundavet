import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("MONGODB_URI is not defined");

interface MongoCache {
  client: MongoClient | null;
}

declare global {
  var mongoClient: MongoCache | undefined;
}

const cached: MongoCache = global.mongoClient ?? { client: null };
if (!global.mongoClient) global.mongoClient = cached;

if (!cached.client) {
  cached.client = new MongoClient(MONGODB_URI, {
    maxPoolSize: 5,
    minPoolSize: 1,
    maxIdleTimeMS: 30000,
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    socketTimeoutMS: 45000,
  });
}

export const client = cached.client;
export const db = cached.client.db();
