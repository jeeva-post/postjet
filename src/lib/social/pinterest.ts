export async function postToPinterest(content: string, mediaUrl: string, accessToken: string) {
  try {
    const boardId = process.env.PINTEREST_BOARD_ID;
    if (!mediaUrl) throw new Error("Pinterest needs an image!");

    const res = await fetch("https://api.pinterest.com/v5/pins", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        board_id: boardId,
        media_source: {
          source_type: "image_url",
          url: mediaUrl,
        },
        title: content.substring(0, 100),
        description: content,
      }),
    });

    const data = await res.json();
    if (data.error) throw new Error(data.message);
    return { success: true, id: data.id, platform: "pinterest" };
  } catch (err: any) {
    return { success: false, error: err.message, platform: "pinterest" };
  }
}