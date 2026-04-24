import { NextResponse } from 'next/server';
import { linkAccount } from "../../../../actions/account-actions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) return NextResponse.json({ error: 'No code provided' }, { status: 400 });

  try {
    // 1. Exchange code for Access Token
    const res = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: process.env.LINKEDIN_CLIENT_ID!,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
        redirect_uri: 'https://postjet.vercel.app/api/auth/callback/linkedin',
      }),
    });

    const data = await res.json();

    if (data.access_token) {
      // 2. Save to MongoDB using our existing action
      await linkAccount({
        platform: "LinkedIn",
        accountName: "LinkedIn Professional Profile",
        config: { token: data.access_token }
      });
      
      // 3. Redirect back to accounts page
      return NextResponse.redirect(new URL('/dashboard/accounts', request.url));
    } else {
      return NextResponse.json({ error: 'Failed to fetch access token' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}