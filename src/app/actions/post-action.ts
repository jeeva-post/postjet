"use server";

export async function postToAllPlatforms(formData: FormData): Promise<void> {
  const content = formData.get("content") as string;
  const file = formData.get("media") as File; // ఇక్కడ Image లేదా Video ఏదైనా రావచ్చు

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) return;

  try {
    const isVideo = file && file.type.startsWith("video/");
    const isImage = file && file.type.startsWith("image/");

    // 1. VIDEO అయితే
    if (isVideo) {
      const vidData = new FormData();
      vidData.append("chat_id", chatId);
      vidData.append("caption", content);
      vidData.append("video", file);

      await fetch(`https://api.telegram.org/bot${botToken}/sendVideo`, {
        method: "POST",
        body: vidData,
      });
    } 
    // 2. IMAGE అయితే
    else if (isImage) {
      const imgData = new FormData();
      imgData.append("chat_id", chatId);
      imgData.append("caption", content);
      imgData.append("photo", file);

      await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: "POST",
        body: imgData,
      });
    } 
    // 3. కేవలం TEXT అయితే
    else if (content) {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: content }),
      });
    }
    console.log("Post successful everywhere!");
  } catch (error) {
    console.error("Posting Error:", error);
  }
}