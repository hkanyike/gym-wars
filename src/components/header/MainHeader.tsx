"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronDown } from "lucide-react";

export default function MainHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Logo / Brand */}
        <Link href="/" className="font-extrabold tracking-wide text-lg">
          GYM WARS
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {/* Home dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 font-medium">
              HOME <ChevronDown size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white text-black shadow-lg">
              <DropdownMenuItem asChild className="hover:bg-gray-100">
                <Link href="/">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-gray-100">
                <Link href="/about">About</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-gray-100">
                <Link href="/events">Events</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Register Gym dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 font-medium">
              REGISTER GYM <ChevronDown size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white text-black shadow-lg">
              <DropdownMenuItem asChild className="hover:bg-gray-100">
                <Link href="/register-gym">Register Gym</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-gray-100">
                <Link href="/trainers-members">Trainers & Members</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-gray-100">
                <Link href="/vendors">Vendors</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Ordered links (no Vendors here) */}
          <Link href="/leaderboard" className="hover:text-accent">
            LEADERBOARD
          </Link>
          <Link href="/challenges" className="hover:text-accent">
            CHALLENGES
          </Link>
          <Link href="/shop" className="hover:text-accent">
            SHOP
          </Link>
        </nav>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu size={20} />
            </Button>
          </SheetTrigger>

          <SheetContent className="bg-bg text-text">
            <nav className="mt-8 flex flex-col gap-3 text-sm">
              {/* Home group */}
              <div className="flex flex-col gap-2">
                <div className="text-xs uppercase tracking-wide text-muted">Home</div>
                <Link href="/" className="font-medium">Home</Link>
                <Link href="/about" className="font-medium">About</Link>
                <Link href="/events" className="font-medium">Events</Link>
              </div>

              <div className="h-px bg-border/60 my-2" />

              {/* Register Gym group with nested items */}
              <div className="flex flex-col gap-2">
                <div className="text-xs uppercase tracking-wide text-muted">Register</div>
                <Link href="/register-gym" className="font-medium">Register Gym</Link>
                <div className="ml-3 flex flex-col gap-2">
                  <Link href="/trainers-members" className="font-medium">Trainers & Members</Link>
                  <Link href="/vendors" className="font-medium">Vendors</Link>
                </div>
              </div>

              <div className="h-px bg-border/60 my-2" />

              {/* Remaining top-level links */}
              <Link href="/leaderboard" className="font-medium">Leaderboard</Link>
              <Link href="/challenges" className="font-medium">Challenges</Link>
              <Link href="/shop" className="font-medium">Shop</Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
