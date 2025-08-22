import { LoaderCircle } from 'lucide-react';

export function PageLoading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
