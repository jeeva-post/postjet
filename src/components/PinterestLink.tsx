"use client";

import { signIn } from "next-auth/react";

// ఇక్కడ 'export default' ఉండాలి, అప్పుడే వేరే ఫైల్ లో నేరుగా ఇంపోర్ట్ అవుతుంది
export default function PinterestLink({ isLinked }: { isLinked: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {isLinked ? (
        <span style={{ 
          color: "#28a745", 
          fontWeight: "bold", 
          fontSize: "12px" 
        }}>
          Connected ✅
        </span>
      ) : (
        <button
          onClick={() => signIn("pinterest")}
          style={{
            padding: "4px 10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "11px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Link 🔗
        </button>
      )}
    </div>
  );
}