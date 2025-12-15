import React from "react";
import Header from "@/components/Header";
import Sidebar from "./Sidebar";

interface ProfileLayoutProps {
    children: React.ReactNode;
}

export default function ProfileLayout({
                                          children,
                                      }: ProfileLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col w-full">
            <div className="z-50">
                <Header/>
            </div>

            <div className="flex flex-1 pt-16 md:pt-20">
                <aside
                    className="hidden md:block w-64 fixed h-[calc(100vh-5rem)] overflow-y-auto border-r border-gray-200 bg-white">
                    <Sidebar/>
                </aside>

                <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 w-full transition-all duration-300 ease-in-out">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}