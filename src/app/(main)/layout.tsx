import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import SessionProvider from "./SessionProvider";
import Navbar from "./Navbar";
import MenuBar from "./MenuBar";

type Props = Readonly<{
  children: React.ReactNode;
}>;

async function AuthLayout({ children }: Props) {
  const auth = await validateRequest();
  if (!auth.user) redirect("/login");

  return (
    <SessionProvider value={auth}>
      <div className="flex min-h-dvh flex-col">
        <Navbar />
        <div className="container flex w-full grow gap-5 p-5">
          <MenuBar
            classNames={{
              ul: "space-y-2",
              container:
                "sticky top-24 hidden h-fit rounded-2xl bg-card px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80",
            }}
          />
          {children}
        </div>
        <MenuBar
          classNames={{
            container: "sticky bottom-0 w-full border-t bg-card sm:hidden p-3",
            ul: "flex gap-1 justify-center items-center",
          }}
        />
      </div>
    </SessionProvider>
  );
}

export default AuthLayout;
