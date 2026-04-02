import { Outlet } from 'react-router';
import { Header } from './Header';
import { Navigation } from './Navigation';

export function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-blue-50 dark:from-[#0a0e14] dark:via-[#0f1419] dark:to-[#13182b] transition-colors">
      <Header />
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}