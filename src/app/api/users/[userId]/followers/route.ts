import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { FollowerInfo } from "@/lib/types";

export const GET = async (
  _req: Request,
  { params: { userId } }: { params: { userId: string } },
) => {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        followers: {
          where: {
            followerId: loggedInUser.id,
          },
          select: {
            followingId: true,
          },
        },
        _count: {
          select: {
            followers: true,
          },
        },
      },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const data: FollowerInfo = {
      followers: user._count.followers,
      isFollowedByUser: !!user.followers.length,
    };

    return Response.json(data);
  } catch (error) {
    console.log({ error });
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};

export const POST = async (
  _req: Request,
  { params: { userId } }: { params: { userId: string } },
) => {
  try {
    const { user: loggedInUser } = await validateRequest();
    // throw new Error("Not implemented");
    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.follow.upsert({
      where: {
        followerId_followingId: {
          followerId: loggedInUser.id,
          followingId: userId,
        },
      },
      create: {
        followerId: loggedInUser.id,
        followingId: userId,
      },
      update: {},
    });

    return Response.json({});
  } catch (error) {
    console.log({ error });
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};

export const DELETE = async (
  _req: Request,
  { params: { userId } }: { params: { userId: string } },
) => {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.follow.deleteMany({
      where: {
        followerId: loggedInUser.id,
        followingId: userId,
      },
    });

    return Response.json({});
  } catch (error) {
    console.log({ error });
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};
