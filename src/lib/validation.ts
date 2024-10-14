import { z } from "zod";

export const requiredString = z.string().trim().min(1, { message: "Required" });

export const signUpSchema = z.object({
  email: requiredString.email("Invalid email address"),
  username: requiredString.regex(/^[a-zA-Z0-9_-]+$/, {
    message: "Username can only contain letters and numbers, - and _ allowed",
  }),
  password: requiredString.min(
    8,
    "Password must be at least 8 characters long",
  ),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export type LoginValues = z.infer<typeof loginSchema>;

export const createPostSchema = z.object({
  content: requiredString,
});
