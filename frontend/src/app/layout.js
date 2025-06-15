// app/layout.js
import './globals.css'; // Make sure Tailwind CSS is imported here
import NavbarWrapper from './NavbarWrapper';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Your App Name',
  description: 'Your app description',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 text-gray-900`}>
        <NavbarWrapper />
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
