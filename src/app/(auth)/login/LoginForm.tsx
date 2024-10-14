"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, PasswordInput } from "@/components/ui/input";
import { loginSchema, LoginValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { login } from "./actions";

function LoginForm() {
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>();

  const handleSubmit = form.handleSubmit((data) => {
    setError(undefined);
    startTransition(async () => {
      const { error } = await login(data);
      if (error) setError(error);
    });
  });

  return (
    <div>
      {error && (
        <Alert variant="destructive" className="mb-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Write your username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="Write a password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button isLoading={isPending} type="submit" className="w-full">
            Log in
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default LoginForm;
