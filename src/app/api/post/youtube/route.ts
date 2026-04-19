// 1. Access Token సంపాదించడం
const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    client_id: process.env.YOUTUBE_CLIENT_ID,
    client_secret: process.env.YOUTUBE_CLIENT_SECRET,
    refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
    grant_type: "refresh_token",
  }),
});

const tokenData = await tokenRes.json();

if (!tokenRes.ok) {
  // ఇక్కడ మనకు అసలు ఎర్రర్ ఏంటో తెలుస్తుంది (ఉదా: invalid_grant అంటే టోకెన్ తప్పు అని)
  return NextResponse.json({ 
    success: false, 
    error: "Google API Error", 
    details: tokenData 
  });
}
const accessToken = tokenData.access_token;