"use client";

import { postToTelegram } from "@/lib/actions/telegram-actions";
import { useState } from "react";

export default function TelegramForm() {
  const [status, setStatus] = useState<string | null>(null);

  async function clientAction(formData: FormData) {
    setStatus("పంపుతున్నాను...");
    const result = await postToTelegram(formData);
    
    if (result.success) {
      setStatus("✅ మెసేజ్ విజయవంతంగా పంపబడింది!");
      // ఫామ్ ని రీసెట్ చేస్తుంది
      const form = document.getElementById("tele-form") as HTMLFormElement;
      form.reset();
    } else {
      setStatus("❌ ఎర్rర్: " + (result.error || "సమస్య వచ్చింది"));
    }
  }

  return (
    <section style={{
      backgroundColor: "white",
      padding: "25px",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}>
      <h3 style={{ marginTop: 0, color: "#0088cc" }}>🚀 Telegram కి మెసేజ్ పంపండి</h3>
      <form id="tele-form" action={clientAction}>
        <textarea
          name="message"
          placeholder="మీ మెసేజ్‌ని ఇక్కడ టైప్ చేయండి..."
          required
          style={{
            width: "100%",
            height: "120px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            marginBottom: "15px",
            fontSize: "14px",
            boxSizing: "border-box"
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#0088cc",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            width: "100%",
            fontWeight: "bold"
          }}
        >
          Send to Telegram
        </button>
      </form>
      {status && (
        <p style={{ 
          marginTop: "10px", 
          padding: "10px", 
          borderRadius: "5px",
          backgroundColor: status.includes("✅") ? "#e6fffa" : "#fff5f5",
          color: status.includes("✅") ? "#2c7a7b" : "#c53030",
          fontWeight: "bold" 
        }}>
          {status}
        </p>
      )}
    </section>
  );
}