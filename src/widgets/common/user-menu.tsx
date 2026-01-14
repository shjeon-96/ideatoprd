"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@/src/features/auth/hooks/use-user";
import { signOut } from "@/src/features/auth/actions/auth-actions";

/**
 * User menu component with dropdown
 * Shows user email and logout option
 */
export function UserMenu() {
  const { user, loading, isAuthenticated } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

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
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {userInitial}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-popover shadow-lg z-50">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-medium text-foreground truncate">
              {userEmail}
            </p>
          </div>
          <div className="py-1">
            <a
              href="/settings"
              className="block px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Settings
            </a>
            <form action={signOut}>
              <button
                type="submit"
                className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-accent transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
