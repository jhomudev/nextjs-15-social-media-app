"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BellIcon,
  BookmarkIcon,
  HomeIcon,
  MessageCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  classNames?: {
    ul?: string;
    nav?: string;
    container?: string;
  };
};

const menuItems = [
  {
    id: "home",
    label: "Home",
    href: "/",
    icon: HomeIcon,
  },
  {
    id: "notifications",
    label: "Notifications",
    href: "/notifications",
    icon: BellIcon,
  },
  {
    id: "messages",
    label: "Messages",
    href: "/messages",
    icon: MessageCircleIcon,
  },
  {
    id: "bookmarks",
    label: "Bookmarks",
    href: "/bookmarks",
    icon: BookmarkIcon,
  },
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
    icon: BellIcon,
  },
];

function MenuBar({ classNames }: Props) {
  const pathname = usePathname();
  return (
    <div className={cn("relative", classNames?.container)}>
      <nav className={cn("relative", classNames?.nav)}>
        <ul className={cn("relative", classNames?.ul)}>
          {menuItems.map((item) => {
            const isActive = item.href === pathname;
            return (
              <li key={item.id}>
                <Button
                  variant={isActive ? "outline" : "ghost"}
                  className="w-full justify-start"
                  disabled={isActive}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span className="ml-3 hidden lg:inline">{item.label}</span>
                  </Link>
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export default MenuBar;
