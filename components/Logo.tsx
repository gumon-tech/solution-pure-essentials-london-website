import Image from "next/image";
import Link from "next/link";

const ASPECT = 629 / 289;
const DESKTOP_WIDTH = 150;

export default function Logo() {
  return (
    <Link href="/" className="inline-flex shrink-0 items-center">
      <Image
        src="/logo/pel-logo-full-espresso.svg"
        alt="Pure Essentials London"
        unoptimized
        width={DESKTOP_WIDTH}
        height={Math.round(DESKTOP_WIDTH / ASPECT)}
        className="h-auto w-[120px] lg:w-[150px]"
        priority
      />
    </Link>
  );
}
