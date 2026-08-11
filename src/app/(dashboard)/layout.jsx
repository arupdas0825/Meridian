import { Sidebar } from '@/shared/layout/Sidebar';
import { MobileNav } from '@/shared/layout/MobileNav';
import { Breadcrumb } from '@/shared/layout/Breadcrumb';
import { Toaster } from 'sonner';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Breadcrumb />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Toast Notifications */}
      <Toaster position="top-right" richColors />
    </div>
  );
}
