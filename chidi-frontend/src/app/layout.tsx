import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chidi App',
  description: 'A modern full-stack application built with Next.js and FastAPI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
