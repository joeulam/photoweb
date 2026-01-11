import Link from "next/link";
import { Link as HeroLink } from "@heroui/react";

export function Navbar({currentPath}:{currentPath:string}) {
  return (
    <nav className="fixed top-0 z-50 flex w-full items-center justify-between px-6 py-6 mix-blend-difference">
      <Link href="/" className="text-xl font-bold tracking-tighter">
        JL.PHOTO
      </Link>
      <div className="flex gap-6 text-sm font-mono uppercase tracking-widest">
        <HeroLink
          href="/series"
          className={`${
            currentPath === "/series" ? "text-yellow-400" : "text-zinc-500"
          } hover:text-yellow-400 transition-colors`}
        >
          Series
        </HeroLink>
        <HeroLink
          href="/admin"
          className={`${
            currentPath === "/admin" ? "text-yellow-400" : "text-zinc-500"
          } hover:text-yellow-400 transition-colors`}
        >
          Admin
        </HeroLink>
      </div>
    </nav>
  );
}
