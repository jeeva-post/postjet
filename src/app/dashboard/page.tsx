import FacebookPost from "@/components/editor/apps/FacebookPost";
import InstagramPost from "@/components/editor/apps/InstagramPost";
import TelegramPost from "@/components/editor/apps/TelegramPost";
import LinkedInPost from "@/components/editor/apps/LinkedInPost";

export default function Dashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900">PostJet Dashboard 🚀</h1>
        <p className="text-slate-500 mt-2">Manage your social media from one place</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FacebookPost />
        <InstagramPost /> {/* 👈 ఒక ఫేస్‌బుక్, ఒక ఇన్స్టాగ్రామ్ */}
        <TelegramPost />
        <LinkedInPost />
      </div>
    </div>
  );
}