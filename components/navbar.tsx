'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, QrCode, BarChart2, Settings, LogOut } from 'lucide-react';
import { logout } from '@/app/actions';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: QrCode },
    { name: 'Analytics', href: '/analytics', icon: BarChart2 },
    // { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-blue-600">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <QrCode size={20} className="text-white" />
              </div>
              <span className="tracking-tight text-gray-900">QRCodeSpoken</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <button onClick={() => logout()} className="text-gray-500 hover:text-red-600 transition-colors flex items-center gap-2 text-sm font-medium">
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          ))}
          <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-red-500 hover:bg-red-50">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}