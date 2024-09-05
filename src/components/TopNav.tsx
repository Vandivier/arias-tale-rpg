import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";

function TopNav() {
  return (
    <nav className="w-full bg-white text-custom-primary shadow">
      <div className="container mx-auto px-6 py-3 md:flex md:items-center md:justify-between">
        <div className="flex">
          <Link className="m-auto block" href="/" title="Home Page Link">
            <Image
              alt="Aria's Tale Dice Logo"
              height={40}
              width={40}
              src="/arias-tale-d20-logo.png"
            />
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center md:mx-6 md:flex-row">
          <Link className="my-1 cursor-pointer md:mx-4 md:my-0" href="/gallery">
            Gallery
          </Link>
          <Link
            className="my-1 cursor-pointer md:mx-4 md:my-0"
            href="/game-manual"
          >
            Game Manual
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="my-1 cursor-pointer md:mx-4 md:my-0">
              Games
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href="/games/colosseum">Colosseum</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/games/fighting">Fighting Game</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/games/tcg-playmat">TCG Playmat</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            className="my-1 cursor-pointer md:mx-4 md:my-0"
            href="https://github.com/Vandivier/arias-tale-rpg"
            target="_blank"
          >
            GitHub
          </Link>

          <Link
            className="my-1 cursor-pointer md:mx-4 md:my-0"
            href="https://suno.com/playlist/1d9534bc-ed44-493d-8e02-71ef60b37707"
            target="_blank"
          >
            Music
          </Link>

          <Link
            className="my-1 cursor-pointer md:mx-4 md:my-0"
            href="https://www.tiktok.com/@arias.tale.game"
            target="_blank"
          >
            TikTok
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default TopNav;
