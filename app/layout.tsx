import type {Metadata} from 'next';
import './globals.css';
import React from "react";
import StoreProvider from "@/app/StoreProvider";

export const metadata: Metadata = {
    title: 'TraceWorks  - Your Career & Services Platform',
    description: 'Connect with job opportunities and professional services',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className="bg-gray-50">
        <StoreProvider>
            {children}
        </StoreProvider>
        </body>
        </html>
    );
}