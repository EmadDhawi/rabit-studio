import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/layout/sidebar-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
        <SidebarNav />
        <SidebarInset className="bg-background">
            {children}
        </SidebarInset>
    </SidebarProvider>
  );
}
