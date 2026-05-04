"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase"; // Nee supabase client path chusko
import { useRouter } from "next/navigation";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Registration Successful!");
      router.push("/dashboard"); // Direct ga dashboard ki velthundi
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020617] text-white">
      <form onSubmit={handleRegister} className="bg-[#0f172a] p-8 rounded-2xl border border-white/10 w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <input 
          type="email" placeholder="Email" 
          className="w-full p-3 mb-4 bg-black/20 border border-white/10 rounded-lg"
          onChange={(e) => setEmail(e.target.value)} required
        />
        <input 
          type="password" placeholder="Password" 
          className="w-full p-3 mb-6 bg-black/20 border border-white/10 rounded-lg"
          onChange={(e) => setPassword(e.target.value)} required
        />
        <button 
          disabled={loading}
          className="w-full bg-cyan-500 p-3 rounded-lg font-bold text-black hover:bg-cyan-400"
        >
          {loading ? "Creating..." : "Register"}
        </button>
      </form>
    </div>
  );
}