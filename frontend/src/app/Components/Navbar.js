'use client'
import React from 'react'
import Link from 'next/link'
const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white px-6 py-4 shadow-md flex items-center justify-between">
      <h1 className="text-2xl font-bold">Inventory Dashboard</h1>
      <div className="space-x-6">
        <Link href="/products" className="hover:text-yellow-400 transition-colors">
          Products
        </Link>
        <Link href="/categories" className="hover:text-yellow-400 transition-colors">
          Categories
        </Link>
        <Link href="/setting" className="hover:text-yellow-400 transition-colors">
          Settings
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
