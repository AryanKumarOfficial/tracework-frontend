'use client';

import { LayoutDashboard, UserCircle, FileText, MessageSquare, HelpCircle, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: 'My Dashboard', href: '/users/dashboard', key: 'dashboard' },
    { icon: UserCircle, label: 'My Profile', href: '/users/basicinfo', key: 'basicinfo' },
    { icon: FileText, label: 'Leads', href: '/users/leads', key: 'leads' },
    { icon: MessageSquare, label: 'My Response', href: '/users/response', key: 'response' },
    { icon: HelpCircle, label: 'Support', href: '/users/support', key: 'support' },
    { icon: Settings, label: 'Settings', href: '/users/settings', key: 'settings' },
    { icon: LogOut, label: 'Logout', href: '/users/logout', key: 'logout' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-full bg-white shadow-lg w-64 transform transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="py-6">
          {/* Logo in Sidebar */}
          <div className="px-6 mb-8 flex items-center gap-2">
            <div className="bg-orange-500 text-white px-2 py-1 font-bold text-sm">
              T+
            </div>
            <span className="font-semibold text-sm">
              TRACKLWAAR<span className="text-orange-500">jobs</span>
            </span>
          </div>

          {/* Menu Items */}
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => onClose()}
                className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                  isActive(item.href)
                    ? 'text-orange-500 border-r-4 border-orange-500 bg-orange-50'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden top-16"
          onClick={onClose}
        ></div>
      )}
    </>
  );
}