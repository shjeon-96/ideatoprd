"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/src/shared/ui/button";
import { Input } from "@/src/shared/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/shared/ui/card";
import { OAuthButton } from "./oauth-button";
import { signUpWithEmail } from "../actions/auth-actions";

export function SignupForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const message = searchParams.get("message");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("auth");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordError(null);

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Client-side validation
    if (password.length < 6) {
      setPasswordError(t("passwordMinLength"));
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError(t("passwordMismatch"));
      return;
    }

    startTransition(async () => {
      await signUpWithEmail(formData);
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{t("signup.title")}</CardTitle>
        <CardDescription>
          {t("signup.description")}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Success Message */}
        {message ? (
          <div role="status" className="rounded-md border border-brand-primary/50 bg-brand-secondary px-4 py-3 text-sm text-brand-primary">
            {decodeURIComponent(message)}
          </div>
        ) : null}

        {/* Error Alert */}
        {(error || passwordError) ? (
          <div role="alert" className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {passwordError || (error && decodeURIComponent(error))}
          </div>
        ) : null}

        {/* Google OAuth */}
        <OAuthButton className="w-full" />

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">{t("divider")}</span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t("email")}
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t("password")}
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={t("passwordMinLengthHint")}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t("confirmPassword")}
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder={t("confirmPasswordPlaceholder")}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-brand-primary hover:bg-brand-primary/90"
            size="lg"
            disabled={isPending}
          >
            {isPending ? (
              <span className="size-5 motion-safe:animate-spin rounded-full border-2 border-brand-primary-foreground border-t-transparent" />
            ) : (
              t("signup.button")
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {t("signup.hasAccount")}{" "}
          <Link
            href="/login"
            className="font-medium text-brand-primary underline-offset-4 hover:underline"
          >
            {t("login.link")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
