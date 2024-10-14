import LoginImage from "@/assets/login-image.jpg";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login",
};

function LoginPage() {
  return (
    <div className="flex h-dvh items-center justify-center p-5">
      <main className="flex h-full max-h-[40rem] w-full max-w-[64rem] justify-center overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full max-w-xl space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">Log in to bugbook</h1>
            <p className="text-muted-foreground">
              A place where even <span className="italic">you</span> can find a
              friend.
            </p>
          </div>
          <div className="space-y-5">
            <LoginForm />
            <Link
              href={"/signup"}
              className="block text-center text-sm hover:underline"
            >
              Don&apos;t you have an account? Sign up
            </Link>
          </div>
        </div>
        <Image
          src={LoginImage}
          alt="Log in image"
          className="hidden w-1/2 object-cover md:block"
        />
      </main>
    </div>
  );
}

export default LoginPage;
