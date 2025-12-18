import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MacOS 2025 - Hacking Simulation',
  description: 'Immersive OS hacking scenario game',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
