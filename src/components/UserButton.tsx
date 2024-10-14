"use client";
import { useSession } from "@/app/(main)/SessionProvider";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import {
  LogOutIcon,
  MonitorIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import { logout } from "@/app/(auth)/actions";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  className?: string;
};

const menuThemes = [
  {
    id: "light",
    label: "Light",
    icon: SunIcon,
  },
  {
    id: "system",
    label: "System",
    icon: MonitorIcon,
  },
  {
    id: "dark",
    label: "Dark",
    icon: MoonIcon,
  },
];

function UserButton({ className }: Props) {
  const { user } = useSession();
  const { setTheme, theme } = useTheme();
  const currentMenuTheme =
    menuThemes.find((t) => t.id === theme) ?? menuThemes[0];

  const queryClient = useQueryClient();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar asChild>
            <button className={cn("h-8 w-8", className)}>
              <AvatarFallback>??</AvatarFallback>
              <AvatarImage src={user.avatarUrl || ""} />
            </button>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Logged as @{user?.username}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/users/${user.username}`}>
              <UserIcon className="mr-2 size-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <currentMenuTheme.icon className="mr-2 size-4" />
              Theme
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {menuThemes.map((theme) => (
                  <DropdownMenuItem
                    key={theme.id}
                    onClick={() => setTheme(theme.id)}
                    className={cn(
                      theme.id === currentMenuTheme.id &&
                        "border-2 border-border",
                    )}
                  >
                    <theme.icon className="mr-2 size-4" />
                    {theme.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              queryClient.clear();
              await logout();
            }}
          >
            <LogOutIcon className="mr-2 size-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default UserButton;
