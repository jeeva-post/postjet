"use client";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      style={{
        padding: "10px",
        width: "100%",
        backgroundColor: "#ff4444",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
        marginTop: "20px"
      }}
    >
      Logout
    </button>
  );
}