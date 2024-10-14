"use client";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";

type Props = {
  userId: string;
};

function UsersPosts({ userId }: Props) {
  const {
    isPending,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "user-posts", userId],
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/users/${userId}/posts`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<PostsPage>(),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
  if (isPending) return <PostsLoadingSkeleton />;
  if (error) {
    return (
      <div className="text-center text-destructive">
        <p>An error occured while loading posts.</p>
      </div>
    );
  }

  const posts = data.pages.flatMap((page) => page.posts) || [];
  if (status === "success" && posts.length === 0)
    return (
      <div className="text-center text-muted-foreground">
        <p>This user has not posted anything yet.</p>
      </div>
    );

  return (
    <InfiniteScrollContainer
      className="space-y-5 pb-5"
      onBottomReached={() => hasNextPage && !isPending && fetchNextPage()}
    >
      {posts?.map((post) => <Post key={post.id} post={post} />)}
      {isFetchingNextPage && (
        <div className="flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <Loader2Icon className="animate-spin" />
          Loading more posts...
        </div>
      )}
    </InfiniteScrollContainer>
  );
}

export default UsersPosts;
