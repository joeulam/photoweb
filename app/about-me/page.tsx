"use client";

import { motion } from "framer-motion";
import FilmGrainOverlay from "../components/FilmGrainOverlay";
import { Navbar } from "../components/NavBar";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { Highlighter } from "@/components/ui/highlighter";
import { Link } from "@heroui/react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-400 selection:text-black relative overflow-x-hidden">
      <FilmGrainOverlay />
      <AnimatedGridPattern />
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[24px_24px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-size-[96px_96px]"></div>
        <div className="absolute inset-0 bg-black mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,transparent_70%,black_100%)]"></div>
        <motion.div
          initial={{ top: "-10%" }}
          animate={{ top: "120%" }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 2,
          }}
          className="absolute left-0 w-full h-px bg-linear-to-r from-transparent via-yellow-400/20 to-transparent drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]"
        />
      </div>

      <Navbar currentPath={"/about-me"} />
      <main className="container mx-auto max-w-7xl px-6 pb-24 pt-32 relative z-10">
        <header className="mb-24 flex flex-col gap-8 md:flex-row md:items-end md:justify-between border-b border-zinc-800/50 pb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl font-bold leading-none tracking-tighter md:text-9xl relative">
              About <br />
              <span className="text-yellow-400">Me.</span>
            </h1>
          </motion.div>
        </header>
        <div className="font-mono">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 items-center gap-2 w-2xl"
          >
            <p>
              Hi, I&apos;m a current student at Boston University studying
              Computer Science and Economics. I love creating fun silly websites
              that I can express myself in. I love learning and improving on
              things that Im working on. While creating this website my main
              idea was to create an full stack application that I can show off
              my newly improved skills. If you wanna see my other works
            </p>
          </motion.div>
          <Highlighter action="highlight" color="#757500">
            <Link href="https://joeyresume.vercel.app/">click here</Link>
          </Highlighter>
        </div>

        <footer className="mt-32 border-t border-zinc-800 py-12 flex justify-between items-end text-zinc-600">
          <div>
            <p className="font-bold text-white tracking-tighter">JL.PHOTO</p>
            <p className="text-xs mt-2">Visual database & portfolio.</p>
          </div>
          <p className="text-[10px] uppercase tracking-widest font-mono">
            © {new Date().getFullYear()} / All rights reserved
          </p>
        </footer>
      </main>
    </div>
  );
}
