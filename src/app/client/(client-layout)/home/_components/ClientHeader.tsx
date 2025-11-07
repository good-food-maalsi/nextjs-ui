"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { User } from 'lucide-react';

export function ClientHeader() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/client/home" },
    { label: "Parcourir le menu", href: "/client/menu" },
    { label: "Offres spéciales", href: "/client/offers" },
    { label: "Restaurants", href: "/client/restaurants" },
    { label: "Suivre la commande", href: "/client/track" },
  ];

  return (
    <header className="bg-off-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/client/home" className="flex items-center">
            <Icons.logo className="w-20 h-16" />
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-6 py-2.5 rounded-full font-medium transition-colors text-sm",
                    isActive
                      ? "bg-secondary-500 text-white"
                      : "bg-transparent text-black-500 hover:bg-secondary-100"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Login/Signup Button */}
          <Link
            href="/client/login"
            className="flex items-center gap-2 bg-black-500 text-white px-6 py-2.5 rounded-full font-medium hover:bg-black-400 transition-colors"
          >
            <User className="text-primary-500 text-xl" />
            <span>Login / SignUp</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
