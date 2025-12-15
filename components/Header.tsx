'use client';

import Image from 'next/image';
import { Bell, Search } from 'lucide-react';

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-white border-b border-gray-200">
            <div className="h-full px-6 flex items-center justify-between">

                {/* LEFT – Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-orange-500 rounded flex items-center justify-center">
                        <span className="text-white font-bold text-xl">T</span>
                    </div>
                    <div className="leading-tight">
                        <p className="font-bold text-gray-900 text-sm">TRACEWORKS</p>
                        <p className="text-xs text-gray-500">Jobs</p>
                    </div>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2">
                    <h1 className="text-lg font-semibold text-gray-900">
                        Employer&apos;s Dashboard
                    </h1>
                </div>


                {/* RIGHT – Search + Icons */}
                <div className="flex items-center gap-4">

                    {/* Search */}
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-72 pl-10 pr-4 py-2 rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    {/* Notification */}
                    <button className="relative p-2 rounded-full hover:bg-gray-100">
                        <Bell size={20} className="text-gray-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
                    </button>

                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200">
                        <Image
                            src="/avatar.png"
                            alt="User"
                            width={36}
                            height={36}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
