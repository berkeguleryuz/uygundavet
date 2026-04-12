"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
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
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Mail,
  Users,
  ClipboardCheck,
  Image,
  BookHeart,
  Settings,
  ChevronsUpDown,
  LogOut,
  ArrowLeft,
  Lock,
} from "lucide-react";
import { Logo } from "@/app/components/Logo";
import { authClient } from "@/lib/auth-client";
import { useOrderStore } from "@/store/order-store";
import { canAccess } from "@/lib/package-gating";
import type { SelectedPackage } from "@/models/Order";

const navItemDefs = [
  { key: "overview", icon: LayoutDashboard, href: "", feature: null },
  { key: "myInvitation", icon: Mail, href: "/davetiyem", feature: null },
  { key: "guestList", icon: Users, href: "/misafirler", feature: null },
  { key: "rsvpTracking", icon: ClipboardCheck, href: "/lcv", feature: null },
  { key: "gallery", icon: Image, href: "/galeri", feature: "gallery" },
  { key: "memoryBook", icon: BookHeart, href: "/ani-defteri", feature: "memoryBook" },
  { key: "settings", icon: Settings, href: "/ayarlar", feature: null },
];

interface DashboardSidebarProps extends React.ComponentProps<typeof Sidebar> {
  isDemo?: boolean;
}

export function DashboardSidebar({
  isDemo,
  ...props
}: DashboardSidebarProps) {
  const t = useTranslations("Dashboard");
  const { data: session } = authClient.useSession();
  const { order } = useOrderStore();
  const pathname = usePathname();
  const prefix = isDemo ? "/demo" : "/dashboard";
  const userPackage = (order?.selectedPackage || "starter") as SelectedPackage;

  const isActive = (href: string) => {
    const fullPath = `${prefix}${href}`;
    if (href === "") {
      return pathname.endsWith("/dashboard") || pathname.endsWith("/demo");
    }
    return pathname.includes(fullPath);
  };

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  return (
    <Sidebar className="lg:border-r-0!" collapsible="icon" {...props}>
      <SidebarHeader className="px-2.5 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 w-full hover:bg-sidebar-accent rounded-md p-1 -m-1 transition-colors shrink-0">
              <div className="flex size-7 items-center justify-center rounded-lg bg-foreground text-background shrink-0 overflow-hidden">
                <Logo className="size-7" />
              </div>
              <div className="flex items-center gap-1 group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium">Uygun Davet</span>
                <ChevronsUpDown className="size-3 text-muted-foreground" />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem asChild>
              <Link href={`${prefix}/ayarlar`}>
                <Settings className="size-4" />
                <span>{t("settings")}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
              <span>{t("logout")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>

      <SidebarContent className="px-2.5">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {navItemDefs.map((item) => {
                const locked = !isDemo && item.feature && !canAccess(item.feature, userPackage);
                return (
                  <SidebarMenuItem key={item.key}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive(item.href)}
                          className={`h-7 ${locked ? "opacity-40" : ""}`}
                        >
                          <Link href={locked ? "#" : `${prefix}${item.href}`}>
                            <item.icon className="size-3.5" />
                            <span className="text-sm">{t(item.key)}</span>
                            {locked && <Lock className="size-3 ml-auto text-muted-foreground" />}
                          </Link>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="group-data-[collapsible=icon]:block hidden">
                        {locked ? t("featureLocked") : t(item.key)}
                      </TooltipContent>
                    </Tooltip>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="p-0 mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-7">
                  <Link href="/">
                    <ArrowLeft className="size-3.5" />
                    <span className="text-sm">{t("backToHome")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-2.5 pb-3">
        <Separator className="mb-2" />
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <Avatar className="size-7 shrink-0">
            <AvatarImage
              src={
                isDemo
                  ? "https://api.dicebear.com/9.x/glass/svg?seed=demo"
                  : "https://api.dicebear.com/9.x/glass/svg?seed=user"
              }
            />
            <AvatarFallback>{isDemo ? "DK" : "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium truncate">
              {isDemo ? t("demoUser") : (session?.user?.name || session?.user?.email?.split("@")[0] || t("user"))}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {isDemo ? "davet@uygundavet.com" : (session?.user?.email || "")}
            </span>
          </div>
          {!isDemo && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  className="ml-auto shrink-0 flex items-center justify-center size-7 rounded-md hover:bg-sidebar-accent transition-colors group-data-[collapsible=icon]:hidden"
                  aria-label={t("logout")}
                >
                  <LogOut className="size-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">{t("logout")}</TooltipContent>
            </Tooltip>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
