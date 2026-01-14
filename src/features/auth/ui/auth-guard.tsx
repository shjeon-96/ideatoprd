import { redirect } from "next/navigation";
import { createClient } from "@/src/shared/lib/supabase/server";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Server component that protects routes from unauthenticated access
 * Redirects to /login if user is not authenticated
 */
export async function AuthGuard({ children }: AuthGuardProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <>{children}</>;
}
