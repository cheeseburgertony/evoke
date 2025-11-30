"use client";

import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { UserControl } from "@/components/user-control";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";

export const NavBar = () => {
  const isScrolled = useScroll();

  return (
    <nav
      className={cn(
        "p-4 fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-white/10 shadow-lg shadow-black/5"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="max-w-5xl mx-auto w-full flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Evoke" width={24} height={24} />
          <span className="font-semibold text-lg">Evoke</span>
        </Link>
        <SignedOut>
          <div className="flex gap-2">
            <SignUpButton>
              <Button variant="outline" size="sm">
                注册
              </Button>
            </SignUpButton>
            <SignInButton>
              <Button size="sm">登录</Button>
            </SignInButton>
          </div>
        </SignedOut>
        <SignedIn>
          <UserControl showName />
        </SignedIn>
      </div>
    </nav>
  );
};
