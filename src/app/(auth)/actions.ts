"use server";

import { lucia, validateRequest } from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type CreateSessionProps =
  | {
      userId: string;
      type: "default";
    }
  | {
      type: "blank";
    };

export const createSession = async (props: CreateSessionProps) => {
  if (props.type === "blank") {
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return sessionCookie;
  }
  if (props.type === "default") {
    const session = await lucia.createSession(props.userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return sessionCookie;
  }
};

export const logout = async () => {
  const { session, user } = await validateRequest();

  if (!session) {
    throw new Error("Unauthorized");
  }

  await lucia.invalidateSession(session.id);

  createSession({ type: "blank" });

  return redirect("/login");
};
