"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EVENT_DATE_ISO, EVENT_LOCATION } from "@/config/site"; // <-- import

export function HeroSplash() {
  return (
    <section className="relative">
      <div className="relative aspect-video w-full bg-card">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/hero-fallback.jpg"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-bg/30 to-transparent" />

        <div className="absolute bottom-0 left-0 p-6 md:p-10">
          <div className="text-base md:text-lg font-semibold text-white drop-shadow">
            {new Date(EVENT_DATE_ISO).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="mt-1 text-sm md:text-base text-muted drop-shadow">
            {EVENT_LOCATION}
          </div>

          <h1 className="mt-3 text-3xl font-extrabold md:text-5xl">GYM WARS</h1>

          <div className="mt-4 flex flex-wrap gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="px-4 py-2">REGISTER GYM</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card text-white border-border">
                <DropdownMenuItem asChild>
                  <a href="/register-gym">Register Gym</a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/trainers-members">Trainers &amp; Members</a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/vendors">Vendors</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </section>
  );
}
