"use server";

import { createClient } from "@/src/shared/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { ErrorCodes } from "@/src/shared/lib/errors";

/**
 * Sign in with email and password
 */
export async function signInWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || (await headers()).get("origin");

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${appUrl}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect(
    `/signup?message=${encodeURIComponent(ErrorCodes.AUTH_CHECK_EMAIL)}`
  );
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle() {
  const supabase = await createClient();
  const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${appUrl}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  if (data.url) {
    redirect(data.url);
  }

  // OAuth URL not returned - this shouldn't happen
  console.error("[AUTH] Google OAuth URL not returned");
  redirect(`/login?error=${encodeURIComponent("Google 로그인 URL을 받지 못했습니다.")}`);
}

/**
 * Sign out and redirect to home
 */
export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("[AUTH] Sign out failed:", {
      errorCode: error.code,
      errorMessage: error.message,
    });
    // Still redirect but session might not be fully cleared
  }

  revalidatePath("/", "layout");
  redirect("/");
}
