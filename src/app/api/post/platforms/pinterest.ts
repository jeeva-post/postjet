// src/app/api/post/platforms/pinterest.ts

export async function postToPinterest(content: string, mediaUrl: string) {
  const token = process.env.PINTEREST_ACCESS_TOKEN?.trim();
  const boardId = process.env.PINTEREST_BOARD_ID?.trim();

  if (!token || !boardId) {
    throw new Error("Pinterest credentials missing in .env");
  }

  const res = await fetch('https://api.pinterest.com/v5/pins', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`, // Bearer space tharvatha token undali
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      board_id: boardId,
      media_source: {
        source_type: "image_url",
        url: mediaUrl
      },
      title: "PostJet New Pin",
      description: content
    })
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Pinterest Detail Error:", JSON.stringify(data));
    throw new Error(data.message || "Pinterest Authentication/API failed");
  }

  return data;
}