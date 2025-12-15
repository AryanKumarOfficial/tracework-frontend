import type { Metadata } from 'next';
import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}