"use server";
const { GoogleGenerativeAI } = require("@google/generative-ai");

export async function generateAICaption(prompt: string) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const fullPrompt = `Create a catchy, professional social media caption for this topic: "${prompt}". 
    Include relevant hashtags and emojis. Keep it engaging for Facebook and Instagram.`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return { success: true, text: response.text() };
  } catch (error) {
    console.error("AI Error:", error);
    return { success: false, text: "AI is sleeping. Try again later!" };
  }
}