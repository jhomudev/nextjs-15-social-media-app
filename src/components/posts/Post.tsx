"use client";
import { PostData } from "@/lib/types";
import Link from "next/link";
import React from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow, subDays, format } from "date-fns";
import { useSession } from "@/app/(main)/SessionProvider";
import PostMoreButton from "./PostMoreButton";

type Props = {
  post: PostData;
};

function Post({ post }: Props) {
  const { user } = useSession();
  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <Link href={`/users/${post.user.username}`}>
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.user.avatarUrl || ""} />
            </Avatar>
          </Link>
          <div className="flex flex-col">
            <Link
              href={`/users/${post.user.username}`}
              className="text-lg font-semibold hover:underline"
            >
              {post.user.displayName}
            </Link>
            <time
              className="text-sm text-muted-foreground"
              dateTime={format(new Date(post.createdAt), "yyyy-MM-dd")}
            >
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </time>
          </div>
        </div>
        {user?.id === post.user.id && (
          <PostMoreButton
            post={post}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )}
      </div>
      <div className="whitespace-pre-line break-words">{post.content}</div>
    </article>
  );
}

export default Post;
