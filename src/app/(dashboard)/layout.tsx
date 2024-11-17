import { MobileNav } from "@/components/dashboard/mobile-nav";
import DashboardNav from "@/components/dashboard/nav";
import { Toaster } from "@/components/ui/toaster";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex max-h-screen flex-col bg-background overflow-hidden">
      {/* header */}
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center px-4">
          <MobileNav />
          <h1 className="text-lg font-bold">AI Image Generator</h1>
        </div>
      </header>

      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        {/* sidebar */}
        <aside className="fixed top-14 z-30 hidden h-[calc(100vh-4.1rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
          <div className="h-full py-6 px-2 lg:py-8">
            <DashboardNav />
          </div>
        </aside>

        {/* main content */}
        <main className="flex w-full flex-col p-3">{children}</main>

        <Toaster />
      </div>
    </div>
  );
}
