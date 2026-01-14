import Link from "next/link";
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

export const metadata: Metadata = {
  title: "인증 오류 | IdeaToPRD",
};

interface ErrorPageProps {
  searchParams: Promise<{ error?: string; error_description?: string }>;
}

export default async function AuthErrorPage({ searchParams }: ErrorPageProps) {
  const params = await searchParams;
  const error = params.error || "unknown_error";
  const errorDescription =
    params.error_description || "인증 과정에서 오류가 발생했습니다.";

  return (
    <div className="paper-texture min-h-screen flex flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-destructive">
            인증 오류
          </CardTitle>
          <CardDescription>
            {decodeURIComponent(errorDescription)}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-md bg-muted px-4 py-3 text-sm">
            <p className="text-muted-foreground">
              <span className="font-medium">오류 코드:</span>{" "}
              {decodeURIComponent(error)}
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full" variant="outline">
            <Link href="/login">로그인으로 돌아가기</Link>
          </Button>
          <Button asChild className="w-full" variant="ghost">
            <Link href="/">홈으로 이동</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
