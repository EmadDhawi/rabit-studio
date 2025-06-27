import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full">
      <header className="mb-6 flex items-center gap-2">
        <h1 className="text-3xl font-bold font-headline text-foreground">Dashboard</h1>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Rabit</CardTitle>
          <CardDescription>
            Your smart shipping solution. Manage your products and settings from here.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground p-12">
            <Home className="h-16 w-16 mb-4" />
            <p className="mb-4">You can manage your products by navigating to the products page.</p>
            <Link href="/dashboard/products">
                <Button>Go to Products</Button>
            </Link>
        </CardContent>
      </Card>
    </div>
  );
}
