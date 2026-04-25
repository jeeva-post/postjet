"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateAICaption(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { success: false, text: "API Key is missing!" };

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const fullPrompt = `Generate a high-engagement social media caption for: "${prompt}". 
    Include emojis and relevant hashtags. Format it for Facebook and Instagram.`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return { success: true, text: response.text() };
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return { success: false, text: "AI is currently busy. Please try again." };
  }
}