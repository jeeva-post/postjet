import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { userId, userEmail, variantId } = await req.json();

  const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json'
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: { 
            email: userEmail,
            custom: { user_id: userId } 
          }
        },
        relationships: {
          store: { data: { type: 'stores', id: process.env.LEMON_STORE_ID } },
          variant: { data: { type: 'variants', id: variantId } }
        }
      }
    })
  });

  const checkout = await response.json();
  return NextResponse.json({ url: checkout.data.attributes.url });
}