import { MobileNav } from "@/components/dashboard/mobile-nav";
import DashboardNav from "@/components/dashboard/nav";
import { Toaster } from "@/components/ui/toaster";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* header */}
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center px-4">
          <MobileNav />
          <h1 className="text-lg font-bold">AI Image Generator</h1>
        </div>
      </header>

      <div className="flex-1">
        <div className="flex gap-6 lg:gap-10">
          {/* sidebar */}
          <aside className="hidden md:block w-[220px] lg:w-[240px] flex-shrink-0">
            <div className="fixed h-[calc(100vh-4rem)] w-[220px] lg:w-[240px] border-r">
              <div className="h-full overflow-y-auto py-4 px-2 lg:py-6">
                <DashboardNav />
              </div>
            </div>
          </aside>

          {/* main content */}
          <main className="flex-1 overflow-y-auto p-3">{children}</main>
        </div>

        <Toaster />
      </div>
    </div>
  );
}
