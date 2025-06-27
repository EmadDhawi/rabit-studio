import { NavBar } from "@/components/layout/nav-bar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <NavBar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
