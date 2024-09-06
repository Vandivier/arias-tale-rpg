import { Cross2Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

interface TopNavProps {
  theme: string;
  toggleTheme: () => void;
}

function TopNav({ theme, toggleTheme }: TopNavProps) {
  const router = useRouter();
  const isMobileMenu = router.pathname.includes("mobile-menu");

  return (
    <nav className="w-full bg-white text-custom-primary shadow">
      <div className="container mx-auto px-6 py-3 md:flex md:items-center md:justify-between">
        <div className="flex items-center">
          <div className="mr-auto flex items-center">
            <Link href="/" title="Home Page Link">
              <Image
                alt="Aria's Tale Dice Logo"
                height={40}
                width={40}
                src="/arias-tale-d20-logo.png"
              />
            </Link>

            <button
              onClick={toggleTheme}
              className={`mx-4 h-8 w-8 rounded-full border-4 ${
                theme === "black-map"
                  ? "border-black bg-black"
                  : "border-gray-400 bg-custom-primary"
              }`}
              aria-label="Toggle Theme"
            ></button>
          </div>

          <Link
            className="ml-auto block md:hidden"
            href={isMobileMenu ? "/" : "/mobile-menu"}
          >
            {isMobileMenu ? (
              <Cross2Icon className="h-6 w-6" />
            ) : (
              <HamburgerMenuIcon className="h-6 w-6" />
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default TopNav;
