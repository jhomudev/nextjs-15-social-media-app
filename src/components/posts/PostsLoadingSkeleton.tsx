import React from "react";
import { Skeleton } from "../ui/skeleton";

type Props = {
  count?: number;
};

function PostsLoadingSkeleton({ count = 3 }: Props) {
  return (
    <div className="space-y-5">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <PostLoadingSkeleton key={index} />
        ))}
    </div>
  );
}

function PostLoadingSkeleton({}: Props) {
  return (
    <div className="w-full space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex flex-wrap gap-3">
        <Skeleton className="size-12 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
      </div>
      <Skeleton className="h-10 rounded" />
    </div>
  );
}

export default PostsLoadingSkeleton;
