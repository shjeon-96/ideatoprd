"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useUser } from "@/src/features/auth/hooks/use-user";
import { useWorkspace, WorkspaceSwitcher } from "@/src/features/workspace";
import { signOut } from "@/src/features/auth/actions/auth-actions";
import { Coins, Building2, ShoppingCart, Settings, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/shared/ui/dropdown-menu";

/**
 * User menu component with dropdown
 * Shows user email, credits, and navigation options
 */
export function UserMenu() {
  const t = useTranslations();
  const { user, profile, loading, isAuthenticated } = useUser();
  const { currentWorkspace, isWorkspaceMode } = useWorkspace();

  if (loading) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted animate-pulse" />
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const userEmail = user.email ?? "User";
  const userInitial = userEmail.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          {userInitial}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* User email */}
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium truncate">{userEmail}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Credit display */}
        <div className="px-2 py-2">
          <div className="flex items-center gap-2 text-sm">
            <Coins className="size-4 text-green-500" />
            <span className="font-medium">{profile?.credits ?? 0}</span>
            <span className="text-muted-foreground">{t('common.credits')}</span>
          </div>
          {/* Workspace credits when in workspace mode */}
          {isWorkspaceMode && currentWorkspace && (
            <div className="flex items-center gap-2 text-sm mt-2">
              <Building2 className="size-4 text-blue-500" />
              <span className="font-medium">{currentWorkspace.credit_balance}</span>
              <span className="text-muted-foreground">{t('workspace.credits')}</span>
            </div>
          )}
        </div>
        <DropdownMenuSeparator />

        {/* Workspace Switcher */}
        <div className="px-1 py-1">
          <WorkspaceSwitcher className="w-full justify-start" />
        </div>
        <DropdownMenuSeparator />

        {/* Navigation items */}
        <DropdownMenuItem asChild>
          <Link href="/purchase" className="gap-2 cursor-pointer">
            <ShoppingCart className="size-4" />
            {t('userMenu.buyCredits')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings" className="gap-2 cursor-pointer">
            <Settings className="size-4" />
            {t('common.settings')}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Sign out */}
        <form action={signOut}>
          <DropdownMenuItem asChild>
            <button type="submit" className="w-full gap-2 cursor-pointer">
              <LogOut className="size-4" />
              {t('common.signOut')}
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
