"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOff, EyeOffIcon, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
          {...props}
        />
        {!props.disabled && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:text-foreground"
            onClick={() => setShowPassword(!showPassword)}
            type="button"
            aria-checked={showPassword}
            role="checkbox"
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff /> : <EyeIcon />}
          </button>
        )}
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

const SearchField = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const q = (form.q as HTMLInputElement).value.trim();
      if (!q) return;
      router.push(`/search?q=${encodeURIComponent(q)}`);
    };

    return (
      <form
        className="relative"
        onSubmit={handleSubmit}
        method="GET"
        action={"/search"}
      >
        <Input
          {...props}
          type="search"
          ref={ref}
          name="q"
          placeholder="Search..."
        />
        <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:text-foreground" />
      </form>
    );
  },
);
SearchField.displayName = "SearchField";

export { Input, PasswordInput, SearchField };
