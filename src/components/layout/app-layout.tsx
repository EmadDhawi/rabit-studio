import { SidebarNav } from "@/components/layout/sidebar-nav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <SidebarNav />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
