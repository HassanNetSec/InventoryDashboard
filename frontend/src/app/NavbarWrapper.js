// app/NavbarWrapper.js
'use client';
import { usePathname } from 'next/navigation';
import Navbar from "./Components/Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const hideNavbar = ['/signup', '/login'].includes(pathname);
  
  return !hideNavbar ? <Navbar /> : null;
}

