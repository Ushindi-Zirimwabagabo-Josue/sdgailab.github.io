import { useState } from 'react';
import Sidebar from './Sidebar';
import { ToastProvider } from './Toast';
import { useAuth } from '../auth/AuthProvider';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPath: string;
}

export default function AdminLayout({ children, currentPath }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <ToastProvider>
      <div className="flex h-screen bg-lab-base">
        {sidebarOpen && (
          <div
            onClick={closeSidebar}
            className="fixed inset-0 z-30 bg-black/30 md:hidden"
            aria-hidden="true"
          />
        )}

        <div className="hidden md:flex md:flex-shrink-0">
          <Sidebar currentPath={currentPath} />
        </div>
        <div className="md:hidden">
          <Sidebar currentPath={currentPath} isOpen={sidebarOpen} />
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-16 items-center justify-between border-b border-lab-border bg-lab-section px-4 md:px-6">
            <button
              type="button"
              onClick={toggleSidebar}
              className="md:hidden inline-flex items-center justify-center rounded p-2 text-lab-muted hover:bg-lab-section hover:text-lab-text focus:outline-none focus:ring-2 focus:ring-inset focus:ring-lab-accent"
              aria-label="Toggle navigation"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div className="flex-1 truncate text-center md:text-left">
              <p className="text-sm font-bold text-lab-text">Content Management System</p>
              <p className="mt-0.5 text-xs text-lab-muted">{user?.email}</p>
            </div>
            <button
              type="button"
              onClick={signOut}
              className="shrink-0 rounded-full border border-lab-border px-3 py-1.5 text-sm font-semibold text-lab-muted transition hover:border-lab-accent/50 hover:bg-lab-surface hover:text-lab-text"
            >
              Sign Out
            </button>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
