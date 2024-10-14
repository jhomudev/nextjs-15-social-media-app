import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { unstable_cache } from "next/cache";
import { formatNumber } from "@/lib/utils";
import FollowButton from "./FollowButton";
import { getUserDataSelect } from "@/lib/types";

function TrendsSidebar() {
  return (
    <div className="sticky top-24 hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <React.Suspense
        fallback={<Loader2 className="mx-auto h-5 w-5 animate-spin" />}
      >
        <WhoToFollow />
        <TrendingTopics />
      </React.Suspense>
    </div>
  );
}

export default TrendsSidebar;

async function WhoToFollow() {
  const { user } = await validateRequest();
  if (!user) return null;

  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
      followers: {
        none: {
          followerId: user.id,
        },
      },
    },
    select: getUserDataSelect(user.id),
    take: 5,
  });

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <h3 className="text-lg font-semibold">Who to follow</h3>
      <ul className="w-full space-y-3">
        {usersToFollow.map((user) => (
          <li key={user.id} className="flex items-center gap-3">
            <Link
              href={`/users/${user.username}`}
              className="flex items-center gap-3"
            >
              <Avatar>
                <AvatarImage src={user.avatarUrl || ""} />
              </Avatar>
              <div className="flex flex-col">
                <p className="line-clamp-1 break-all font-semibold hover:underline">
                  {user.displayName}
                </p>
                <small className="line-clamp-1 break-all text-sm text-muted-foreground">
                  @{user.username}
                </small>
              </div>
            </Link>
            <FollowButton
              userId={user.id}
              className="ms-auto"
              initialState={{
                followers: user._count.followers,
                isFollowedByUser: user.followers.some(
                  ({ followerId }) => followerId === user.id,
                ),
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

const getTrendingTopics = unstable_cache(
  async () => {
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
            SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
            FROM posts
            GROUP BY (hashtag)
            ORDER BY count DESC, hashtag ASC
            LIMIT 5
        `;

    return result.map((row) => ({
      hashtag: row.hashtag,
      count: Number(row.count),
    }));
  },
  ["trending-topics"],
  {
    revalidate: 3 * 60 * 60,
  },
);

async function TrendingTopics() {
  const trendingTopics = await getTrendingTopics();

  return (
    <div className="w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <h3 className="text-lg font-semibold">Trendings Topics</h3>
      <ul className="flex w-full flex-col gap-3">
        {trendingTopics.map((topic) => (
          <li key={topic.hashtag} className="flex flex-col">
            <Link
              href={`/search?q=${topic.hashtag}`}
              className="font-semibold hover:underline"
            >
              {topic.hashtag}
            </Link>
            <small className="text-sm text-muted-foreground">
              {formatNumber(topic.count)} {topic.count === 1 ? "post" : "posts"}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}
