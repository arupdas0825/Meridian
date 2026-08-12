import { Sidebar } from '@/shared/layout/Sidebar';
import { MobileNav } from '@/shared/layout/MobileNav';
import { Breadcrumb } from '@/shared/layout/Breadcrumb';
import { OfflineIndicator } from '@/shared/ui/OfflineIndicator';
import { PwaInstallBanner } from '@/shared/ui/PwaInstallBanner';
import { Toaster } from 'sonner';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-surface-0 text-ink-900">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        <OfflineIndicator />
        <Breadcrumb />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* PWA Install Banner */}
      <PwaInstallBanner />

      {/* Toast Notifications */}
      <Toaster position="top-right" richColors />
    </div>
  );
}

