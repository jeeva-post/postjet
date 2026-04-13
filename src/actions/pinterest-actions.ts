"use server";

export async function postToPinterest(message: string, mediaUrl: string) {
  const accessToken = process.env.PINTEREST_ACCESS_TOKEN;
  const boardId = process.env.PINTEREST_BOARD_ID; // నువ్వు క్రియేట్ చేసిన బోర్డ్ ఐడి

  if (!accessToken || !boardId || !mediaUrl) {
    console.error("Pinterest credentials or media missing!");
    return { success: false, error: "Missing Pinterest data" };
  }

  try {
    const response = await fetch("https://api.pinterest.com/v5/pins", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: message.substring(0, 100), // టైటిల్ 100 అక్షరాల లోపు ఉండాలి
        description: message,
        board_id: boardId,
        media_source: {
          source_type: "image_url",
          url: mediaUrl,
        },
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, id: data.id };
    } else {
      console.error("Pinterest API Error:", data);
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.error("Pinterest Network Error:", error);
    return { success: false, error: "Network error" };
  }
}