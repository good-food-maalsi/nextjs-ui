"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { User, ShoppingBag, LogOut, ChevronDown, History } from "lucide-react";
import { useSelector } from "@legendapp/state/react";
import { cartState$ } from "@/lib/store/cart.store";
import { useProfileGateway, useLogoutGateway } from "@/hooks/use-auth-gateway";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function ClientHeader() {
    const pathname = usePathname();
    const cartItems = useSelector(cartState$.items);
    const totalItems = (cartItems || []).reduce(
        (acc, item) => acc + (item?.quantity || 0),
        0,
    );
    const { data: profile, isLoading: profileLoading } = useProfileGateway();
    const { mutate: logout, isPending: logoutPending } = useLogoutGateway();

    const navItems = [
        { label: "Home", href: "/home" },
        // { label: "Offres spéciales", href: "/client/offers" },
        { label: "Restaurants", href: "/restaurants" },
        { label: "Suivre la commande", href: "/track" },
    ];

    return (
        <header className="bg-off-white sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/home" className="flex items-center">
                        <Icons.logo className="w-20 h-16" />
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center gap-2 md:flex">
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
                                            : "bg-transparent text-black-500 hover:bg-secondary-100",
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
                        <Link
                            href="/cart"
                            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ShoppingBag className="w-6 h-6 text-black-500" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {/* User menu ou Login/Signup */}
                        {profileLoading ? (
                            <div className="w-32 h-9 rounded-full bg-gray-200 animate-pulse" />
                        ) : profile ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-2 rounded-full border-black-500 bg-off-white px-4 py-2 hover:bg-gray-100"
                                    >
                                        <User className="text-primary-500 text-lg" />
                                        <span className="font-medium text-black-500 max-w-28 truncate">
                                            {profile.username}
                                        </span>
                                        <ChevronDown className="size-4 text-black-400" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-56"
                                >
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/orders"
                                            className="cursor-pointer flex items-center"
                                        >
                                            <History className="mr-2 size-4" />
                                            Historique des commandes
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            logout(undefined, {
                                                onSuccess: () => {
                                                    window.location.href =
                                                        "/login";
                                                },
                                            })
                                        }
                                        disabled={logoutPending}
                                        variant="destructive"
                                        className="cursor-pointer"
                                    >
                                        <LogOut className="mr-2 size-4" />
                                        Se déconnecter
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center gap-2 bg-black-500 text-white px-5 py-2 rounded-full font-medium hover:bg-black-400 transition-colors text-sm"
                            >
                                <User className="text-primary-500 text-lg" />
                                <span>Login / SignUp</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
