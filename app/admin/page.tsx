"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { BrutalistInput, BrutalistButton } from "./dashboard/components/BrutalistUI";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      router.push("/admin/dashboard"); 
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white selection:bg-yellow-400 selection:text-black relative">
      
      <div className="fixed top-8 left-8 z-50">
        <span className="font-bold tracking-tighter text-lg">STUDIO<span className="text-yellow-400">.ADMIN</span></span>
      </div>

      <div className="fixed top-8 right-8 z-50">
        <Link 
            href="/" 
            className="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
        >
            <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
            <span>Return to Index</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="z-10 w-full max-w-100 px-6"
      >
        <div className="mb-8 border-l-2 border-yellow-400 pl-4">
          <h1 className="text-3xl font-bold tracking-tighter text-white">ACCESS</h1>
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mt-1">Authorized Personnel Only</p>
        </div>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <BrutalistInput
            required
            label="ID / EMAIL"
            placeholder="enter credentials"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />
          
          <BrutalistInput
            required
            label="PASSWORD"
            placeholder="••••••••"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
          
          <BrutalistButton 
            type="submit" 
            isLoading={loading}
          >
            {loading ? "Authenticating..." : "Enter System"}
          </BrutalistButton>
        </form>

        <div className="mt-8 flex justify-center">
            <span className="font-mono text-[9px] text-zinc-700 uppercase tracking-widest">
                Secure Connection {new Date().getFullYear()}
            </span>
        </div>
      </motion.div>
    </div>
  );
}