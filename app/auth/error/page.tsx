import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/src/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/shared/ui/card";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.error");
  return {
    title: t("metaTitle"),
  };
}

interface ErrorPageProps {
  searchParams: Promise<{ error?: string; error_description?: string }>;
}

export default async function AuthErrorPage({ searchParams }: ErrorPageProps) {
  const t = await getTranslations("auth.error");
  const params = await searchParams;
  const error = params.error || "unknown_error";
  const errorDescription =
    params.error_description || t("defaultDescription");

  return (
    <div className="paper-texture min-h-screen flex flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-destructive">
            {t("title")}
          </CardTitle>
          <CardDescription>
            {decodeURIComponent(errorDescription)}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-md bg-muted px-4 py-3 text-sm">
            <p className="text-muted-foreground">
              <span className="font-medium">{t("errorCode")}:</span>{" "}
              {decodeURIComponent(error)}
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full" variant="outline">
            <Link href="/login">{t("backToLogin")}</Link>
          </Button>
          <Button asChild className="w-full" variant="ghost">
            <Link href="/">{t("goHome")}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
