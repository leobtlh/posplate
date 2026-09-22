import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Posplate — Strava de la Food',
  description: 'Découvre, cuisine et partage. Le TikTok de la bouffe.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} hide-scrollbar`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}