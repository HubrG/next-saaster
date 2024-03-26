"use client";
import { Button } from '@/src/components/ui/button';
import { useRouter } from '@/src/lib/intl/navigation';

type PriceCardContactUsButtonProps = {
}

export const PriceCardContactUsButton = ({}: PriceCardContactUsButtonProps) => {
  const router = useRouter();
  const handleRedirect = () => {
    router.push('/contact');
  }
  return (
    <Button variant={"second"} className="w-full" onClick={handleRedirect}>Contact us</Button>
  )
}
