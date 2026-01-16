import { Sidebar } from '@/src/widgets/dashboard';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Dashboard layout with sidebar navigation
 * Nested under the protected layout which handles authentication
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <Sidebar className="hidden md:flex w-64 shrink-0 border-r border-border" />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
