import Link from "next/link";
import { CustomPage } from "~/components/CustomPage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";

export default function MobileMenu() {
  return (
    <CustomPage mainHeading="Mobile Menu">
      <div className="text-l my-4 flex flex-col gap-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <Link className="text-xl" href="/gallery">
            Gallery
          </Link>
          <Link className="text-xl" href="/game-manual">
            Game Manual
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer text-xl">
              Games
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col items-center">
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
            className="text-xl"
            href="https://github.com/Vandivier/arias-tale-rpg"
            target="_blank"
          >
            GitHub
          </Link>
          <Link
            className="text-xl"
            href="https://suno.com/playlist/1d9534bc-ed44-493d-8e02-71ef60b37707"
            target="_blank"
          >
            Music
          </Link>
          <Link
            className="text-xl"
            href="https://www.tiktok.com/@arias.tale.game"
            target="_blank"
          >
            TikTok
          </Link>
        </div>
      </div>
    </CustomPage>
  );
}
