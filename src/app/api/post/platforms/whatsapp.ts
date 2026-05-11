export async function postToWhatsApp(content: string, mediaUrl: string, token: string, phoneNumberId?: string, recipientNumber?: string) {
  if (!token) throw new Error("Missing Access Token");
  if (!phoneNumberId) throw new Error("Missing WhatsApp Phone Number ID");
  if (!recipientNumber) throw new Error("Missing WhatsApp recipient number");

  const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;

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
  console.log('WhatsApp API Request:', { url, body });
  console.log('WhatsApp API Response:', data);

  if (!res.ok) {
    throw new Error(data.error?.message || `WhatsApp delivery failed: ${JSON.stringify(data)}`);
  }

  return { success: true, data };
}