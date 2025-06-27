import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full">
      <header className="mb-6 flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-3xl font-bold font-headline text-foreground">Settings</h1>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Manage your account preferences and information. This feature is coming soon.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground p-12">
            <Settings className="h-16 w-16 mb-4" />
            <p>Your account settings will be managed from this page.</p>
        </CardContent>
      </Card>
    </div>
  );
}
