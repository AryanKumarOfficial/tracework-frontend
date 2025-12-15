'use client';

import AuthHeader from "../components/employers/RegisterHeader";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthHeader />
      <div className="pt-20">{children}</div>
    </div>
  );
}
