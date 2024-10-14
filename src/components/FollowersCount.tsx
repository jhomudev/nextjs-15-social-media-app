"use client";
import useFollowerInfo from "@/hooks/useFollowerInfo";
import { FollowerInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import React from "react";

type Props = {
  userId: string;
  initialState: FollowerInfo;
};

function FollowersCount({ initialState, userId }: Props) {
  const { data } = useFollowerInfo(userId, initialState);

  return (
    <span>
      Followers:{" "}
      <span className="font-semibold">{formatNumber(data.followers)}</span>
    </span>
  );
}

export default FollowersCount;
