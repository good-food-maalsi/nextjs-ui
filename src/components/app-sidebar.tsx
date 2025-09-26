"use client";

import { useMutation } from "@tanstack/react-query";
import { BadgeCheck, ChevronsUpDown, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import type { Session } from "@/lib/types/session.types";
import { cn } from "@/lib/utils";
import { renderRoleName } from "@/lib/utils/role.utils";

import { authService } from "../services/auth.service";
import { AccountSettingsDialog } from "./account-settings-dialog";
import { Icons } from "./icons";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "./ui/sidebar";

interface AppSidebarProps {
  session: Session;
}

export function AppSidebar({ session }: AppSidebarProps) {
  const pathname = usePathname();

  const firstGroupItems = [
    {
      title: "Tableau de bord",
      url: "/",
      icon: pathname === "/" ? Icons.homeOutline : Icons.home,
    },
    {
      title: "Commandes",
      url: "/commmandes",
      icon: pathname === "/commmandes" ? Icons.commandOutline : Icons.command,
    },
    {
      title: "Plats",
      url: "/plats",
      icon: pathname === "/plats" ? Icons.productOutline : Icons.product,
    },
    {
      title: "Finance",
      url: "/finance",
      icon: pathname === "/finance" ? Icons.financeOutline : Icons.finance,
    },
    {
      title: "Analyses des données",
      url: "/analyses",
      icon: pathname === "/analyses" ? Icons.analyticsOutline : Icons.analytics,
    },
    {
      title: "Réductions",
      url: "/reductions",
      icon: pathname === "/reductions" ? Icons.discountOutline : Icons.discount,
    },
    {
      title: "Gestion du personnel",
      url: "/membres",
      icon: pathname === "/membres" ? Icons.clientOutline : Icons.client,
    },
  ];

  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);

  const router = useRouter();

  const { isMobile, state } = useSidebar();

  const { mutate, isPending } = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      router.push("/login");
    },
    onError: () => {
      toast.error("Une erreur est survenue lors de la déconnexion");
    },
  });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href="/"
              className={cn("flex items-center gap-2 p-2", {
                "p-0": state === "collapsed",
              })}
            >
              <div
                className={cn(
                  "flex aspect-square size-16 items-center justify-center rounded-lg",
                  { "size-8": state === "collapsed" }
                )}
              >
                <Icons.logo
                  className={cn({ "size-6": state === "collapsed" })}
                />
              </div>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {firstGroupItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    variant="default"
                    asChild
                    isActive={pathname === item.url}
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span className="truncate">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="size-8 rounded-lg">
                    {session.picture ? (
                      <AvatarImage
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${session.picture}`}
                        alt={session.username}
                      />
                    ) : (
                      <AvatarFallback>
                        {session.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {session.username}
                    </span>
                    <span className="truncate text-xs">
                      {renderRoleName(session.role)}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="size-8 rounded-lg">
                      {session.picture ? (
                        <AvatarImage
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${session.picture}`}
                          alt={session.username}
                        />
                      ) : (
                        <AvatarFallback>
                          {session.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {session.username}
                      </span>
                      <span className="truncate text-xs">
                        {renderRoleName(session.role)}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      setIsAccountDialogOpen(true);
                    }}
                  >
                    <BadgeCheck />
                    Mon compte
                  </DropdownMenuItem>
                  <AccountSettingsDialog
                    open={isAccountDialogOpen}
                    onOpenChange={setIsAccountDialogOpen}
                  />
                  {/* <DropdownMenuItem>
                    <Bell />
                    Notifications
                  </DropdownMenuItem> */}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => mutate()} disabled={isPending}>
                  <LogOut />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
