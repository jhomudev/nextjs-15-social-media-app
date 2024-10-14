"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, PostData } from "@/lib/types";
import { createPostSchema } from "@/lib/validation";

export const submitPost = async (input: string): Promise<PostData> => {
  const { user } = await validateRequest();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { content } = createPostSchema.parse({ content: input });
  const newPost = await prisma.post.create({
    data: {
      content,
      userId: user.id,
    },
    include: getPostDataInclude(user.id),
  });
  return newPost;
};
