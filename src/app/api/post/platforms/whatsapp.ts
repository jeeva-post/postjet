export async function postToWhatsApp(content: string, mediaUrl: string) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN?.trim();
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
  const recipientNumber = process.env.WHATSAPP_RECIPIENT_NUMBER?.trim();

  // Credentials check
  if (!token || !phoneNumberId || !recipientNumber) {
    throw new Error("WhatsApp credentials (Token, Phone ID, or Recipient) missing in .env");
  }

  const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;

  // WhatsApp Message Body
  const body: any = {
    messaging_product: "whatsapp",
    to: recipientNumber,
  };

  if (mediaUrl) {
    // Image post logic
    body.type = "image";
    body.image = { 
      link: mediaUrl, 
      caption: content 
    };
  } else {
    // Text only post logic
    body.type = "text";
    body.text = { body: content };
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("WhatsApp API Error:", JSON.stringify(data));
    throw new Error(data.error?.message || "WhatsApp delivery failed");
  }

  return data;
}