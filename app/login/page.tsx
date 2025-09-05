// app/login/page.tsx
"use client";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e: any) {
    e.preventDefault();
    // Demo-only: redirect home. Wire real auth later.
    window.location.href = "/";
  }

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Sign in</h1>
      <p className="text-sm opacity-80 mb-6">Demo login placeholder</p>

      <form onSubmit={onSubmit}>
        <label className="block mb-2 font-medium">Email</label>
        <input
          className="w-full border rounded p-3 mb-4"
          type="email"
          placeholder="you@postara.one"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block mb-2 font-medium">Password</label>
        <input
          className="w-full border rounded p-3 mb-4"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="px-4 py-2 rounded bg-black text-white"
        >
          Sign in
        </button>
      </form>
    </main>
  );
}
