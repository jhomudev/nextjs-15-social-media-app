"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import { hash } from "argon2";
import { generateIdFromEntropySize } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSession } from "../actions";

export const signup = async (
  credentilas: SignUpValues,
): Promise<{ error: string }> => {
  try {
    const { username, email, password } = signUpSchema.parse(credentilas);
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
      hashLength: 32,
    });

    const userId = generateIdFromEntropySize(10);

    const existUsername = await prisma.user.findFirst({
      where: {
        username: { equals: username, mode: "insensitive" },
      },
    });

    if (existUsername) {
      return {
        error: "Username already taken",
      };
    }

    const existEmail = await prisma.user.findFirst({
      where: {
        email: { equals: email, mode: "insensitive" },
      },
    });

    if (existEmail) {
      return {
        error: "Email already taken",
      };
    }

    await prisma.user.create({
      data: {
        id: userId,
        username,
        displayName: username,
        email,
        passwordHash,
      },
    });

    createSession({
      type: "default",
      userId,
    });
    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.log({ error });
    return { error: "Something went wrong" };
  }
};
