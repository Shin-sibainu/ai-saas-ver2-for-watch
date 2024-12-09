import { UserButton } from "@clerk/nextjs";
import { Home, ImagePlus, Settings } from "lucide-react";
import Link from "next/link";

const routes = [
  {
    icon: Home,
    href: "/dashboard",
    label: "ホーム",
  },
  {
    icon: ImagePlus,
    href: "/dashboard/image",
    label: "画像生成",
  },
  {
    icon: Settings,
    href: "/dashboard/settings",
    label: "設定",
  },
];

export function Sidebar() {
  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-gray-900 text-white">
      <div className="px-3 py-2 flex-1">
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              <div className="flex items-center flex-1">
                <route.icon className="h-5 w-5 mr-3" />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2">
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-[48px] w-[48px]"
            }
          }}
        />
      </div>
    </div>
  );
}
