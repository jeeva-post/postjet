// get-token.js
const clientId = '1553520';
const clientSecret = 'f3db7a7fd9caa0444b07152f805d47d75d71732c';
const code = 'bbfee7ef47e17c5c0661468a53eb513c43a470da';
const redirectUri = 'https://postjet.vercel.app/';

const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

console.log("Fetching Refresh Token...");

fetch('https://api.pinterest.com/v5/oauth/token', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri,
  }),
})
.then(res => res.json())
.then(data => {
  console.log("--- RESULTS ---");
  console.log(JSON.stringify(data, null, 2));
})
.catch(err => console.error("Error:", err));