"use client";
import useFollowerInfo from "@/hooks/useFollowerInfo";
import kyInstance from "@/lib/ky";
import { FollowerInfo } from "@/lib/types";
import {
  QueryFilters,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

type Props = {
  userId: string;
  initialState: FollowerInfo;
} & Pick<React.HTMLAttributes<HTMLButtonElement>, "className">;

export default function FollowButton({
  initialState,
  userId,
  className,
}: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data } = useFollowerInfo(userId, initialState);

  const queryKey: QueryKey = ["follower-info", userId];
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      data?.isFollowedByUser
        ? kyInstance.delete(`/api/users/${userId}/followers`)
        : kyInstance.post(`/api/users/${userId}/followers`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData<FollowerInfo>(queryKey);
      queryClient.setQueriesData<FollowerInfo>({ queryKey }, (oldData) => ({
        followers:
          (previousState?.followers || 0) +
          (previousState?.isFollowedByUser ? -1 : 1),
        isFollowedByUser: !previousState?.isFollowedByUser,
      }));

      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.log({ error });
      toast({
        variant: "destructive",
        description: "Failed to follow. Please try again.",
      });
    },
  });

  return (
    <Button
      variant={data?.isFollowedByUser ? "destructive" : "default"}
      onClick={() => mutate()}
      disabled={isPending}
      className={className}
    >
      {data?.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
}
