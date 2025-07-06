import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Frown } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-background p-4">
      <Frown className="h-24 w-24 text-primary mb-4" />
      <h1 className="text-6xl font-extrabold text-foreground mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-muted-foreground mb-6">Page Not Found</h2>
      <p className="max-w-md text-muted-foreground mb-8">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or maybe it never existed.
      </p>
      <Button asChild>
        <Link href="/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  );
}
