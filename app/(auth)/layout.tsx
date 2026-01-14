import { createClient } from "@/src/shared/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  // Redirect authenticated users to dashboard
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="paper-texture min-h-screen flex flex-col">
      {/* Header with branding */}
      <header className="flex items-center justify-center py-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight">
            Idea
            <span className="text-brand-primary">to</span>
            PRD
          </span>
        </Link>
      </header>

      {/* Centered content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} IdeaToPRD. All rights reserved.</p>
      </footer>
    </div>
  );
}
