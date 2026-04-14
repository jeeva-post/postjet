import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  // బిల్డ్ టైమ్ లో ఇది ఎర్రర్ ఇచ్చి ఆగిపోకుండా కేవలం వార్నింగ్ ఇస్తుంది
  console.warn('Warning: MONGODB_URI is not defined in environment variables');
}

const uri = process.env.MONGODB_URI || ""; 
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // డెవలప్‌మెంట్ లో కనెక్షన్ పదే పదే అవ్వకుండా ఈ లాజిక్ వాడుతున్నాం
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // ప్రొడక్షన్ (Vercel) లో ఇది కొత్త కనెక్షన్ తీసుకుంటుంది
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. 
export default clientPromise;