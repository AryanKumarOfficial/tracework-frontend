'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AuthHeader() {
  const pathname = usePathname();

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
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className={`font-medium transition ${
                pathname === '/' 
                  ? 'text-orange-500' 
                  : 'text-gray-700 hover:text-orange-500'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/jobs" 
              className={`font-medium transition ${
                pathname === '/jobs' 
                  ? 'text-orange-500' 
                  : 'text-gray-700 hover:text-orange-500'
              }`}
            >
              Jobs
            </Link>
            <Link 
              href="/companys" 
              className={`font-medium transition ${
                pathname === '/companys' 
                  ? 'text-orange-500' 
                  : 'text-gray-700 hover:text-orange-500'
              }`}
            >
              Companys
            </Link>
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-6 py-2 border-2 border-orange-500 text-orange-500 font-semibold rounded-md hover:bg-orange-50 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 bg-[#0A0A3D] text-white font-semibold rounded-md hover:bg-[#14145A] transition-colors"
            >
              Register Now
            </Link>
            <Link
              href="/jobseekers"
              className="px-6 py-2 text-gray-700 font-semibold hover:text-orange-500 transition-colors"
            >
              Jobseeker's
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
