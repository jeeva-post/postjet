import { Resend } from 'resend';

// API Key ni process.env nundi teesukuntunnam
const resend = new Resend(process.env.RESEND_API_KEY);

export async function postToResend(content: string, mediaUrl?: string) {
  console.log("🚀 Resend: Starting email blast...");

  try {
    // 1. Safety Check: API Key undha ledha?
    if (!process.env.RESEND_API_KEY) {
      console.error("❌ Resend: Missing RESEND_API_KEY in .env");
      throw new Error("Missing API Key");
    }

    // 2. Sending Email
    const response = await resend.emails.send({
      from: 'PostJet <onboarding@resend.dev>', // Initial ga idhe undali
      to: ['delivered@resend.dev'], // Testing kosam idhi vaadachu leda mee email ivvandi
      subject: 'PostJet: New Content Blast',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #333; background: #000; color: #fff; border-radius: 15px;">
          <h2 style="color: #22d3ee;">PostJet Blast Engine</h2>
          <p style="font-size: 16px; line-height: 1.5;">${content}</p>
          ${mediaUrl ? `<img src="${mediaUrl}" style="width: 100%; border-radius: 10px; margin-top: 20px; border: 1px solid #444;" />` : ''}
          <div style="margin-top: 30px; font-size: 10px; color: #666; border-top: 1px solid #222; pt-10px;">
            Sent via PostJet Dashboard
          </div>
        </div>
      `,
    });

    // 3. Resend response handle cheyadam
    if (response.error) {
      console.error("❌ Resend API Error:", response.error.message);
      throw new Error(response.error.message);
    }

    console.log("✅ Resend: Email sent successfully!", response.data?.id);
    return { success: true, id: response.data?.id };

  } catch (error: any) {
    console.error("🔴 Resend Exception:", error.message);
    // Dashboard ki 400 error vellela ikkada throw chestunnam
    throw new Error(error.message || "Failed to send email via Resend");
  }
}