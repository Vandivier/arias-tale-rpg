import Link from "next/link";

function TopNav() {
  return (
    <nav className="w-full bg-white text-custom-primary shadow">
      <div className="container mx-auto px-6 py-3 md:flex md:items-center md:justify-between">
        <div className="flex items-center justify-between">
          <Link href="/">
            <span className="cursor-pointer text-xl font-bold md:text-2xl">
              Aria's Tale
            </span>
          </Link>
        </div>

        <div className="flex flex-col md:mx-6 md:flex-row">
          <Link className="my-1 cursor-pointer md:mx-4 md:my-0" href="/">
            Home
          </Link>
          <Link
            className="my-1 cursor-pointer md:mx-4 md:my-0"
            href="/game-manual"
          >
            Game Manual
          </Link>
          <Link className="my-1 cursor-pointer md:mx-4 md:my-0" href="/gallery">
            Gallery
          </Link>
          <Link
            className="my-1 cursor-pointer md:mx-4 md:my-0"
            href="https://github.com/Vandivier/arias-tale-rpg"
            target="_blank"
          >
            GitHub
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
