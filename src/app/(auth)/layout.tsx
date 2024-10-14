import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

type Props = Readonly<{
  children: React.ReactNode;
}>;

async function AuthLayout({ children }: Props) {
  const { user } = await validateRequest();
  if (user) redirect("/");

  return <>{children}</>;
}

export default AuthLayout;
