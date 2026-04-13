// src/lib/mongodb.ts
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // డెవలప్‌మెంట్ మోడ్‌లో కనెక్షన్ మళ్ళీ మళ్ళీ అవ్వకుండా గ్లోబల్ వేరియబుల్ వాడుతున్నాం
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // ప్రొడక్షన్ మోడ్‌లో నేరుగా కనెక్ట్ అవుతాం
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// దీన్ని default export చేస్తున్నాం, అప్పుడు ఇంపోర్ట్ చేయడం ఈజీ
export default clientPromise;