"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const nav = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/challenges", label: "Challenges" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/shop", label: "Shop" },
];

export function MainHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-extrabold tracking-wide">GYM WARS</Link>

        {/* Desktop nav */}
        <nav className="hidden gap-6 md:flex">
          {nav.map((i) => (
            <Link key={i.href} href={i.href} className="text-sm text-muted hover:text-white">
              {i.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild>
            <Link href="/register-gym">Register Gym</Link>
          </Button>
          <Button asChild variant="outline" className="border-accent text-white">
            <Link href="/trainers-members">Trainers & Members</Link>
          </Button>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon"><Menu /></Button>
            </SheetTrigger>
            <SheetContent className="bg-bg text-text">
              <div className="mt-8 flex flex-col gap-4">
                {nav.map((i) => (
                  <Link key={i.href} href={i.href} className="text-lg">
                    {i.label}
                  </Link>
                ))}
                <hr className="border-border my-2" />
                <Button asChild><Link href="/register-gym">Register Gym</Link></Button>
                <Button asChild variant="outline" className="border-accent text-white">
                  <Link href="/trainers-members">Trainers & Members</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
