"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
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
import { signInWithEmail } from "../actions/auth-actions";
import { useTransition } from "react";

export function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("auth");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      await signInWithEmail(formData);
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{t("login.title")}</CardTitle>
        <CardDescription>
          {t("login.description")}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Error Alert */}
        {error ? (
          <div role="alert" className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {decodeURIComponent(error)}
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
              placeholder={t("passwordPlaceholder")}
              required
              autoComplete="current-password"
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
              t("login.button")
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {t("login.noAccount")}{" "}
          <Link
            href="/signup"
            className="font-medium text-brand-primary underline-offset-4 hover:underline"
          >
            {t("signup.link")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
