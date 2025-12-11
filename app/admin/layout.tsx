'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Package, label: 'Produits', href: '/admin/products' },
    { icon: ShoppingCart, label: 'Commandes', href: '/admin/orders' },
    { icon: Users, label: 'Clients', href: '/admin/customers' },
    { icon: Settings, label: 'Paramètres', href: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-black text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">FASHION Admin</h1>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm hover:underline">
              Voir le site
            </Link>
            <button className="text-sm hover:underline">Déconnexion</button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors
                    ${isActive
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
