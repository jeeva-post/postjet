"use client";

import { useState } from 'react';

export type PlatformStatus = 'pending' | 'loading' | 'success' | 'error';

interface StatusState {
  [key: string]: { status: PlatformStatus; message?: string };
}

export function useDashboard() {
  const [postContent, setPostContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [platformStatuses, setPlatformStatuses] = useState<StatusState>({});
  const [showStatusModal, setShowStatusModal] = useState(false);

  const handlePostSubmit = async (e: React.FormEvent, selectedApps: string[], file?: File | null) => {
    e.preventDefault();
    if (!postContent.trim() || selectedApps.length === 0) {
      alert("Please select apps and enter content!");
      return;
    }

    setIsPosting(true);
    setShowStatusModal(true);

    // Initial state setting
    const initialStatus: StatusState = {};
    selectedApps.forEach(app => initialStatus[app] = { status: 'pending' });
    setPlatformStatuses(initialStatus);

    try {
      let mediaUrl = "";
      let mediaType = "";

      // 1. Cloudinary Upload
      if (file) {
        const cloudData = new FormData();
        cloudData.append("file", file);
        cloudData.append("upload_preset", "postjetjeeva");
        
        const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/dd0kewyk5/upload`, {
          method: "POST",
          body: cloudData,
        });
        const cloudJson = await cloudRes.json();
        if (cloudJson.secure_url) {
          mediaUrl = cloudJson.secure_url;
          mediaType = file.type.startsWith('video') ? 'video' : 'image';
        }
      }

      // 2. Sequential Posting
      for (const app of selectedApps) {
        setPlatformStatuses(prev => ({ ...prev, [app]: { status: 'loading' } }));

        try {
          const response = await fetch('/api/post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              content: postContent,
              platform: app,
              mediaUrl,
              mediaType
            }),
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.error || "Failed");

          setPlatformStatuses(prev => ({ ...prev, [app]: { status: 'success' } }));
        } catch (err: any) {
          setPlatformStatuses(prev => ({ 
            ...prev, 
            [app]: { status: 'error', message: err.message } 
          }));
        }
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (error: any) {
      console.error("Posting Error:", error);
    } finally {
      setIsPosting(false);
    }
  };

  return { 
    postContent, setPostContent, isPosting, showSuccess, 
    platformStatuses, showStatusModal, setShowStatusModal, 
    handlePostSubmit 
  };
}