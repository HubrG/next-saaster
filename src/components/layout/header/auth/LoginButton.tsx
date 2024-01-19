'use client';

import { Button } from '@/src/components/ui/button';
import { Loader } from '@/src/components/ui/loader';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'lucide-react';

export const LoginButton = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      size="lg"
      variant="ghost"
      onClick={() => {
        startTransition(() => router.push("/"));
      }}
    >
      {isPending ? (
        <Loader className="mr-2 h-4 w-4" />
      ) : (
        <User className="mr-2 h-4 w-4" />
      )}
      <span className="lg:block md:hidden block">Login</span>
    </Button>
  );
};