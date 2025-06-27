import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full">
      <header className="mb-6 flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-3xl font-bold font-headline text-foreground">Admin</h1>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Admin Overview</CardTitle>
          <CardDescription>
            Admin tools for reviewing orders, setting user access, and managing brand/product information. This feature is coming soon.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground p-12">
            <Users className="h-16 w-16 mb-4" />
            <p>Administrative controls will be available here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
