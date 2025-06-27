import { LoginForm } from '@/components/auth/login-form';
import { Truck } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sidebar-background">
            <Truck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground font-headline">Welcome to Rabit</h1>
          <p className="mt-2 text-muted-foreground">Your smart shipping solution.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
