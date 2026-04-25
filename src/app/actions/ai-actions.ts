"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateAICaption(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return { success: false, text: "API Key missing in Vercel settings!" };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // మోడల్ పేరుని 'gemini-1.5-flash' కి మార్చాను
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const fullPrompt = `You are a social media expert. Create a catchy, viral caption for: "${prompt}". 
    Include emojis and 3-5 hashtags. Keep it professional and engaging.`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    if (!text) throw new Error("No response from AI");

    return { success: true, text: text };
  } catch (error: any) {
    console.error("Gemini API Error Detail:", error);
    
    // ఒకవేళ 1.5-flash పనిచేయకపోతే, పాత స్థిరమైన మోడల్ కి మారుద్దాం
    if (error.message.includes("404") || error.message.includes("not found")) {
      return { success: false, text: "Model error. Please check if Gemini API is enabled in AI Studio." };
    }
    
    return { success: false, text: "AI is currently busy. Try in a moment!" };
  }
}