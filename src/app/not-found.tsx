import Image from 'next/image';
import { HomeButton } from '@/app/ui/buttons';

export default function NotFound() {
  return (
    <main className="h-full w-full">
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center justify-self-center">
          <Image src="/img/404.png" width={220} height={220} alt="AITA logo" />
          <p>Not found a page you requested.</p>
          <HomeButton href="/" className="mt-6">
            HOME
          </HomeButton>
        </div>
      </div>
    </main>
  );
}
