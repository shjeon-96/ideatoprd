"use client";

// Re-export from context for backward compatibility
// All components using useUser will now share the same global state
export { useUserContext as useUser } from "../context/user-context";
export { UserProvider } from "../context/user-context";
