"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  LayoutDashboard,
  Image,
  ImageDown,
  Settings,
  Layers,
  Sparkles,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { AuthButton } from "../auth/auth-button";

interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    title: "ダッシュボード",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "画像生成",
    href: "/dashboard/tools/image-generator",
    icon: Image,
  },
  {
    title: "背景削除",
    href: "/dashboard/tools/remove-bg",
    icon: Layers,
  },
  {
    title: "画像圧縮",
    href: "/dashboard/tools/optimize",
    icon: ImageDown,
  },
  {
    title: "設定",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

const DashboardNav = () => {
  const pathname = usePathname();

  // 現在のプランを取得する（実際の実装に応じて修正してください）
  const currentPlan = "free"; // 例: "free" | "pro" | "business"

  return (
    <div className="flex flex-col h-full">
      <nav className="grid items-start gap-2">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={cn(
              "justify-start",
              pathname === item.href && "bg-accent"
            )}
            asChild
          >
            <Link href={item.href}>
              {item.icon && <item.icon className="mr-2 h-4 w-4" />}
              {item.title}
            </Link>
          </Button>
        ))}
      </nav>

      <div className="px-3 py-2 mt-auto">
        {currentPlan === "free" && (
          <Button
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white"
            asChild
          >
            <Link
              href="/dashboard/plans"
              className="flex items-center justify-center"
            >
              <Sparkles />
              アップグレード
            </Link>
          </Button>
        )}
        <div className="mt-6">
          {/* <UserButton
            appearance={{
              elements: {
                avatarBox: "h-10 w-10",
                userButtonTrigger: "focus:shadow-none"
              }
            }}
          /> */}
          <AuthButton/>
        </div>
      </div>
    </div>
  );
};

export default DashboardNav;
