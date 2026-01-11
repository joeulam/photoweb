import React from "react";

export const BrutalistInput = ({ label, className = "", ...props }: { label?: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className={`group ${className}`}>
    {label && <label className="block text-zinc-600 font-mono text-[10px] uppercase tracking-widest mb-2">{label}</label>}
    <input {...props} className="w-full bg-transparent border border-zinc-800 h-12 px-3 text-white text-sm focus:border-yellow-400 outline-none rounded-none" />
  </div>
);

export const BrutalistButton = ({ children, isLoading = false, className = "", ...props }: { children: React.ReactNode; isLoading?: boolean; className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button disabled={isLoading} className={`mt-4 w-full h-12 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-none hover:bg-yellow-400 hover:text-black transition-colors ${className}`} {...props}>
    {isLoading ? "Processing..." : children}
  </button>
);