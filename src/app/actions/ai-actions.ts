"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateAICaption(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return { success: false, text: "API Key is missing in Vercel. Please check settings." };
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  // ప్లాన్ A: Gemini 1.5 Flash
  // ప్లాన్ B: Gemini Pro (ఒకవేళ Flash 404 వస్తే ఇది పనిచేస్తుంది)
  const models = ["gemini-1.5-flash", "gemini-pro"];

  for (const modelName of models) {
    try {
      console.log(`Attempting AI generation with: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });

      const fullPrompt = `Generate a viral social media caption for: "${prompt}". Include emojis and hashtags.`;

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      if (text) {
        return { success: true, text: text };
      }
    } catch (error: any) {
      console.error(`Model ${modelName} failed:`, error.message);
      // ఒకవేళ ఇది చివరి మోడల్ అయితే ఎర్రర్ రిటర్న్ చెయ్యి
      if (modelName === "gemini-pro") {
        return { success: false, text: "AI is currently unavailable. Check your API key in Google AI Studio." };
      }
    }
  }

  return { success: false, text: "Something went wrong. Please try again." };
}