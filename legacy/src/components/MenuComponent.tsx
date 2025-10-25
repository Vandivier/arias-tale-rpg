// src/components/MenuComponent.tsx

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";

interface MenuItemProps {
  label: string;
  href?: string;
  items?: { label: string; href: string }[];
  dropdown?: boolean;
  target?: string;
}

interface MenuComponentProps {
  menuData?: MenuItemProps[];
  topLevelClickableClassname?: string;
}

const defaultMenuData = [
  {
    label: "Gallery",
    href: "/gallery",
  },
  {
    label: "Game Manual",
    href: "/game-manual",
  },
  {
    label: "Games",
    dropdown: true,
    items: [
      { label: "Colosseum", href: "/games/colosseum" },
      { label: "Fighting Game", href: "/games/fighting" },
      { label: "TCG Playmat", href: "/games/tcg-playmat" },
    ],
  },
  {
    label: "GitHub",
    href: "https://github.com/Vandivier/arias-tale-rpg",
    target: "_blank",
  },
  {
    label: "Music",
    href: "https://suno.com/playlist/1d9534bc-ed44-493d-8e02-71ef60b37707",
    target: "_blank",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@arias.tale.game",
    target: "_blank",
  },
];

export const MenuComponent = ({
  menuData = defaultMenuData,
  topLevelClickableClassname = "cursor-pointer text-xl",
}: MenuComponentProps) => {
  return (
    <>
      {menuData.map((item, index) =>
        item.dropdown && item.items ? (
          <DropdownMenu key={index}>
            <DropdownMenuTrigger className={topLevelClickableClassname}>
              {item.label}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col items-center">
              {item.items.map((subItem, subIndex) => (
                <DropdownMenuItem key={subIndex} asChild>
                  <Link href={subItem.href}>{subItem.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            key={index}
            href={item.href!}
            target={item.target}
            className={topLevelClickableClassname}
          >
            {item.label}
          </Link>
        ),
      )}
    </>
  );
};
