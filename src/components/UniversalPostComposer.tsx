"use client";
import { useState } from "react";
import { Clock3, ShieldCheck, Sparkles, UploadCloud } from "lucide-react";

const platformOptions = [
  { id: "facebook", label: "Facebook", color: "from-blue-600 to-sky-500" },
  { id: "instagram", label: "Instagram", color: "from-pink-500 to-violet-600" },
  { id: "linkedin", label: "LinkedIn", color: "from-sky-700 to-cyan-500" },
  { id: "telegram", label: "Telegram", color: "from-cyan-500 to-blue-500" },
  { id: "youtube", label: "YouTube", color: "from-red-600 to-orange-500" },
  { id: "whatsapp", label: "WhatsApp", color: "from-emerald-500 to-lime-500" },
];

export default function UniversalPostComposer() {
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["facebook", "instagram"]);
  const [scheduledAt, setScheduledAt] = useState("");
  const [status, setStatus] = useState("Ready to publish to the world.");
  const [loading, setLoading] = useState(false);
  const subscriptionTier = "Free";

  const videoBlocked = subscriptionTier === "Free";

  const canPostVideo = (selected?: File | null) => {
    if (!selected) return true;
    return !selected.type.startsWith("video/") || subscriptionTier !== "Free";
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    if (!canPostVideo(selected)) {
      setStatus("Video uploads are reserved for Pro and Enterprise plans.");
      return;
    }
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setStatus("Media ready for upload.");
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((current) =>
      current.includes(platform) ? current.filter((item) => item !== platform) : [...current, platform]
    );
  };

  const handlePublish = async () => {
    if (!content && !file) {
      setStatus("Please add text or upload an asset before publishing.");
      return;
    }
    if (!canPostVideo(file)) {
      setStatus("Upgrade to Pro to publish video content.");
      return;
    }
    setLoading(true);
    setStatus("Uploading media and triggering platform delivery...");
    try {
      let uploadedUrl = "";
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        const uploadData = await uploadRes.json();
        uploadedUrl = uploadData.url || "";
      }
      const response = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          mediaUrl: uploadedUrl,
          platforms: selectedPlatforms,
          scheduledAt: scheduledAt || undefined,
          subscriptionTier,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setStatus(result.scheduled ? "Post scheduled successfully." : "Post published to selected channels.");
        setContent("");
        setFile(null);
        setPreviewUrl("");
        setScheduledAt("");
      } else {
        setStatus(result.error || "Publish failed. Please try again.");
      }
    } catch (error) {
      setStatus("Unexpected server error during publishing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[3rem] border border-white/10 bg-slate-950/95 p-10 shadow-2xl">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-300">
            <Sparkles size={14} /> Universal Composer
          </span>
          <h2 className="mt-4 text-4xl font-black text-white">Enterprise-grade publishing for every channel.</h2>
          <p className="mt-3 max-w-2xl text-slate-400">Build text, image, and video posts with multi-platform delivery, scheduling, and subscription gating in one place.</p>
        </div>
        <div className="rounded-3xl bg-slate-900/80 px-6 py-5 text-sm text-slate-300 border border-white/10">
          <p className="font-bold">Plan</p>
          <p className="mt-1 text-cyan-300">{subscriptionTier}</p>
          <p className="text-slate-500 mt-3">Video and advanced channels unlock at Pro/Enterprise.</p>
        </div>
      </div>

      <div className="space-y-6">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Create your primary social message..."
          className="min-h-[220px] w-full rounded-[2rem] border border-slate-800 bg-slate-950/60 px-6 py-5 text-lg text-white outline-none transition focus:border-cyan-400"
        />

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-4">
            <label className="block rounded-[2rem] border border-dashed border-slate-800 bg-slate-900/70 p-6 text-slate-400 hover:border-cyan-400 hover:text-white transition cursor-pointer">
              <div className="flex items-center gap-3">
                <UploadCloud size={24} />
                <div>
                  <p className="font-bold text-white">Upload image or video</p>
                  <p className="text-sm text-slate-400">PNG, JPG, MP4, MOV supported. Video uploads require Pro+</p>
                </div>
              </div>
              <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
            </label>

            {previewUrl && (
              <div className="rounded-[2rem] overflow-hidden border border-slate-800 bg-slate-950 shadow-xl">
                {file?.type.startsWith("video/") ? (
                  <video src={previewUrl} className="w-full" controls />
                ) : (
                  <img src={previewUrl} alt="Media preview" className="w-full object-cover" />
                )}
              </div>
            )}

            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-5">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Schedule</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="datetime-local"
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-white outline-none"
                  value={scheduledAt}
                  onChange={(event) => setScheduledAt(event.target.value)}
                />
                <div className="rounded-3xl bg-slate-800 px-4 py-3 text-sm text-slate-400 flex items-center gap-2">
                  <Clock3 size={16} />{scheduledAt ? "Scheduled for delivery" : "Post immediately"}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Channel targets</p>
              <div className="mt-4 grid gap-3">
                {platformOptions.map((platform) => {
                  const disabled = videoBlocked && platform.id === "youtube";
                  const selected = selectedPlatforms.includes(platform.id);
                  return (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => togglePlatform(platform.id)}
                      disabled={disabled}
                      className={`flex items-center justify-between gap-3 rounded-3xl border px-5 py-4 text-left transition ${selected ? "border-cyan-400 bg-cyan-500/10 text-white" : "border-slate-800 bg-slate-950 text-slate-300"} ${disabled ? "cursor-not-allowed opacity-50" : "hover:border-cyan-300"}`}
                    >
                      <div>
                        <p className="font-bold capitalize">{platform.label}</p>
                        <p className="text-sm text-slate-500">{disabled ? "Requires Pro / Enterprise" : "Instant multi-post"}</p>
                      </div>
                      <span className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${platform.color} text-white`}>
                        {platform.label[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[2rem] bg-slate-950/80 border border-slate-800 p-5">
              <div className="flex items-center gap-3 text-slate-300">
                <ShieldCheck size={20} />
                <div>
                  <p className="font-bold">Security and storage</p>
                  <p className="text-sm text-slate-500">Media is uploaded only once and removed after successful delivery for immediate posts.</p>
                </div>
              </div>
            </div>

            <button
              onClick={handlePublish}
              disabled={loading}
              className="w-full rounded-[2rem] bg-cyan-500 px-6 py-4 font-black uppercase tracking-[0.2em] text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Publishing..." : "Publish to Channels"}
            </button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 text-slate-300">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Status</p>
          <p className="mt-4 text-base leading-7">{status}</p>
          {videoBlocked && (
            <div className="mt-5 rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-cyan-100">
              <strong>Upgrade to Pro</strong> to unlock video publishing and premium channel scheduling.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
