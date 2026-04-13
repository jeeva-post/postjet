"use client";

import { signIn } from "next-auth/react";

export default function FacebookLink({ isLinked }: { isLinked: boolean }) {
  if (isLinked) {
    return <span style={{ color: "green", fontWeight: "bold" }}>Connected ✅</span>;
  }

  return (
    <button
      onClick={() => signIn("facebook")}
      style={{
        backgroundColor: "#1877F2",
        color: "white",
        border: "none",
        padding: "5px 12px",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: "bold"
      }}
    >
      Link Facebook
    </button>
  );
}