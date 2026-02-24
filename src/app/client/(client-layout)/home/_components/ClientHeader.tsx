"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { User, ShoppingBag } from 'lucide-react';
import { useSelector } from "@legendapp/state/react";
import { cartState$ } from "@/lib/store/cart.store";

export function ClientHeader() {
  const pathname = usePathname();
  const cartItems = useSelector(cartState$.items);
  const totalItems = (cartItems || []).reduce((acc, item) => acc + (item?.quantity || 0), 0);

  const navItems = [
    { label: "Home", href: "/client/home" },
    { label: "Parcourir le menu", href: "/client/menu" },
    { label: "Offres spéciales", href: "/client/offers" },
    { label: "Restaurants", href: "/client/restaurants" },
    { label: "Suivre la commande", href: "/client/track" },
  ];

  return (
    <header className="bg-off-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/client/home" className="flex items-center">
            <Icons.logo className="w-20 h-16" />
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-2 hidden md:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 rounded-full font-medium transition-colors text-sm",
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

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            <Link href="/client/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ShoppingBag className="w-6 h-6 text-black-500" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Login/Signup Button */}
            <Link
              href="/client/login"
              className="flex items-center gap-2 bg-black-500 text-white px-5 py-2 rounded-full font-medium hover:bg-black-400 transition-colors text-sm"
            >
              <User className="text-primary-500 text-lg" />
              <span>Login / SignUp</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
