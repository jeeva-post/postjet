export { default } from "next-auth/middleware";

export const config = { 
  matcher: ["/dashboard/:path*"] // డ్యాష్‌బోర్డ్ లోపల ఏ పేజీకైనా లాగిన్ తప్పనిసరి
};