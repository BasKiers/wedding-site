// These styles apply to every route in the application
import './globals.css';
import { StrictMode } from 'react';

export const metadata = {
  title: 'Bruiloft Bas & Jessie',
  description:
    'Informatie site over de bruiloft van Bas & Jessie op 9 September 2023',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StrictMode>
      <html lang="en">
        <body>{children}</body>
      </html>
    </StrictMode>
  );
}
