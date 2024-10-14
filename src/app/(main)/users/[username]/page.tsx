import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import FollowersCount from "@/components/FollowersCount";
import TrendsSidebar from "@/components/TrendsSidebar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { format } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React, { cache } from "react";
import UsersPosts from "./UserPosts";

type Props = {
  params: {
    username: string;
  };
};

const getUser = cache(async (username: string, loggeedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggeedInUserId),
  });
  if (!user) notFound();
  return user;
});

export const generateMetadata = async ({
  params: { username },
}: Props): Promise<Metadata> => {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) return {};
  const user = await getUser(username, loggedInUser.id);
  return {
    title: `${user?.displayName} (@${user?.username})`,
  };
};

type UserProfileProps = {
  user: UserData;
  loggedInUserId: string;
};

async function UserProfile({ loggedInUserId, user }: UserProfileProps) {
  const followInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      (f) => f.followerId === loggedInUserId,
    ),
  };

  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <Avatar className="mx-auto size-full max-w-52">
        <AvatarImage
          src={user.avatarUrl || ""}
          className="aspect-square w-52"
        />
      </Avatar>
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div className="">
            <h1 className="text-3xl font-bold">{user.displayName}</h1>
            <span className="text-muted-foreground">@{user.username}</span>
          </div>
          <br />
          <span className="">
            Member since {format(new Date(user.createdAt), "dd MMM yyyy")}
          </span>
          <div className="flex items-center gap-3">
            <span>
              Posts:{" "}
              <span className="font-semibold">
                {formatNumber(user._count.posts)}
              </span>
            </span>
            <FollowersCount userId={user.id} initialState={followInfo} />
          </div>
        </div>
        {user.id === loggedInUserId ? (
          <Button>Edit profile</Button>
        ) : (
          <FollowButton userId={user.id} initialState={followInfo} />
        )}
      </div>
      {user.bio && (
        <>
          <hr />
          <div className="overflow-hidden whitespace-pre-line break-words">
            {user.bio}
          </div>
        </>
      )}
    </div>
  );
}

async function UserPage({ params: { username } }: Props) {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser)
    return (
      <div className="space-y-2">
        <p>You are not logged in</p>
        <Button variant={"secondary"}>Login</Button>
      </div>
    );

  const user = await getUser(username, loggedInUser.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            {user.displayName}&apos;s posts
          </h2>
        </div>
        <UsersPosts userId={user.id} />
      </div>
      <TrendsSidebar />
    </main>
  );
}

export default UserPage;
