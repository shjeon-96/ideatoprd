import { Suspense } from "react";
import { LoginForm } from "@/src/features/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인 | IdeaToPRD",
  description: "IdeaToPRD에 로그인하여 AI 기반 PRD 작성을 시작하세요",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFormSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginFormSkeleton() {
  return (
    <div className="w-full max-w-md animate-pulse">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded w-1/3 mx-auto" />
          <div className="h-4 bg-muted rounded w-2/3 mx-auto" />
          <div className="h-10 bg-muted rounded w-full" />
          <div className="h-10 bg-muted rounded w-full" />
          <div className="h-10 bg-muted rounded w-full" />
        </div>
      </div>
    </div>
  );
}
