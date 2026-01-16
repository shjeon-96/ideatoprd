import { AuthGuard } from "@/src/features/auth";
import { UserMenu } from "@/src/widgets/common";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout for protected routes
 * Wraps all children with AuthGuard for authentication check
 */
export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-14 items-center justify-between px-4">
            <a
              href="/"
              className="font-editorial text-lg font-medium tracking-tight"
            >
              IdeaToPRD
            </a>
            <UserMenu />
          </div>
        </header>
        {children}
      </div>
    </AuthGuard>
  );
}
