import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LogOut, LayoutDashboard, Ticket, Gift, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/appContext';

interface DashboardShellProps {
  children: React.ReactNode;
  role: 'BUSINESS' | 'CUSTOMER';
}

export function DashboardShell({ children, role }: DashboardShellProps) {
  const { setToken } = useAuth();
  const router = useRouter();

  const menuItems = role === 'BUSINESS' ? [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/business/dashboard' },
    { name: 'Customers', icon: Users, href: '/business/customers' },
    { name: 'Stamp Requests', icon: Ticket, href: '/business/stamps' },
    { name: 'Reward Requests', icon: Gift, href: '/business/rewards' },
  ] : [
    { name: 'My Cards', icon: Ticket, href: '/dashboard' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="p-6">
          <Link href="/" className="text-xl font-bold text-blue-600">Regulars Club</Link>
        </div>
        <Separator />
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <Button variant="ghost" className="w-full justify-start gap-3 text-slate-600 hover:text-blue-600">
                <item.icon className="w-5 h-5" />
                {item.name}
              </Button>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start gap-3 text-red-600" onClick={() => { setToken(null); router.push('/login'); }}>
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-white flex items-center px-6 justify-between">
            <h2 className="font-semibold text-lg text-slate-800">Overview</h2>
            {/* User profile could go here */}
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
