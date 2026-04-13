"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      identifier,
      password,
      redirect: false, // మనం మాన్యువల్ గా హ్యాండిల్ చేద్దాం
    });

    if (res?.error) {
      setError("Invalid Email/Mobile or Password");
    } else {
      router.push("/dashboard"); // లాగిన్ అయ్యాక డ్యాష్‌బోర్డ్ కి వెళ్తుంది
      router.refresh();
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Login to PostJet</h2>
      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-black">
        <input 
          type="text" 
          placeholder="Email or Mobile Number" 
          required
          onChange={(e) => setIdentifier(e.target.value)}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input 
          type="password" 
          placeholder="Password" 
          required
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-bold transition">
          Login
        </button>
      </form>
    </div>
  );
}