import { postToFacebook } from "./facebook";
import { postToInstagram } from "./instagram";
import { postToTelegram } from "./telegram";
import { postToLinkedIn } from "./linkedin";
import { postToPinterest } from "./pinterest";
import { postToResend } from "./resend";
import { postToDevTo } from "./devto";
import { postToDiscord } from "./discord";
import { postToWhatsApp } from "./whatsapp";
import { postToSlack } from "./slack"; // <--- New Import

export const platformHandlers: Record<string, (content: string, mediaUrl: string) => Promise<any>> = {
  facebook: postToFacebook,
  instagram: postToInstagram,
  telegram: postToTelegram,
  linkedin: postToLinkedIn,
  pinterest: postToPinterest,
  discord: postToDiscord,
  whatsapp: postToWhatsApp,
  slack: postToSlack, // <--- Added to the list
};