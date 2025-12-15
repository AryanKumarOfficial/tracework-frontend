'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-orange-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <div>
                <div className="font-bold text-gray-900 text-lg leading-tight">
                  TRACEWORKS
                </div>
                <div className="text-orange-500 text-xs font-semibold"></div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-orange-500 transition">
              Home
            </Link>
            <Link href="/info" className="text-gray-700 hover:text-orange-500 transition">
              JOB
            </Link>
            <Link href="/services" className="text-gray-700 hover:text-orange-500 transition">
              COMPANY
            </Link>
            <Link
              href="/recruiter-login"
              className="px-6 py-2 bg-[#0A0A3D] text-white font-semibold rounded-md hover:bg-[#14145A] transition-colors"
            >
              Recruiter's Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <Link
              href="/"
              className="block py-2 text-gray-700 hover:text-orange-500 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/info"
              className="block py-2 text-gray-700 hover:text-orange-500 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Info
            </Link>
            <Link
              href="/services"
              className="block py-2 text-gray-700 hover:text-orange-500 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/recruiter-login"
              className="block py-2 text-gray-700 hover:text-orange-500 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Recruiter's Login
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}