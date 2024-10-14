"use server";
import prisma from "@/lib/prisma";
import { loginSchema, LoginValues } from "@/lib/validation";
import { verify } from "argon2";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { createSession } from "../actions";

export const login = async (
  credentials: LoginValues,
): Promise<{ error: string }> => {
  try {
    const { username, password } = loginSchema.parse(credentials);

    const existUser = await prisma.user.findFirst({
      where: {
        username: { equals: username, mode: "insensitive" },
      },
    });
    if (!existUser || !existUser.passwordHash) {
      return {
        error: "Incorrect username or password",
      };
    }
    const passwordMatch = await verify(existUser.passwordHash, password);
    if (!passwordMatch) {
      return {
        error: "Incorrect username or password",
      };
    }
    await createSession({
      type: "default",
      userId: existUser.id,
    });

    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.log({ error });
    return { error: "Something went wrong. Please try again" };
  }
};
