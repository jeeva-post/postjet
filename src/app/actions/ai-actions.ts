"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateAICaption(prompt: string) {
  // వెర్సెల్ లో మనం యాడ్ చేసిన కీ ని ఇక్కడ తీసుకుంటుంది
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("DEBUG: GEMINI_API_KEY is missing on server!");
    return { success: false, text: "Error: AI Key is not configured on Vercel." };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // లేటెస్ట్ ఫ్లాష్ మోడల్ వాడుతున్నాం
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const fullPrompt = `Create a short, viral social media caption for: "${prompt}". 
    Add emojis and 3 trending hashtags. Format it for Facebook/Instagram.`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return { success: true, text: text };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return { success: false, text: "AI is busy. Please try in 10 seconds!" };
  }
}