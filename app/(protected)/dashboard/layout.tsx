import { Sidebar } from '@/src/widgets/dashboard';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Dashboard layout with enhanced sidebar navigation
 * Uses glass morphism and gradient accents for a modern look
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)]">
      {/* Background gradient mesh */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-brand-primary/[0.03] blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-brand-accent/[0.03] blur-[100px]" />
      </div>

      {/* Sidebar */}
      <Sidebar className="hidden w-72 shrink-0 border-r border-border/40 md:flex" />

      {/* Main content area */}
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
