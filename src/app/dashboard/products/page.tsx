import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Warehouse } from "lucide-react";

export default function ProductsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full">
      <header className="mb-6 flex items-center gap-2">
        <h1 className="text-3xl font-bold font-headline text-foreground">Products</h1>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Products Management</CardTitle>
          <CardDescription>
            Here you can manage your brand's products. This feature is coming soon.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground p-12">
            <Warehouse className="h-16 w-16 mb-4" />
            <p>Product listing and management will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
