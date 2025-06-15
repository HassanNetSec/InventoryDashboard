'use client';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

const stockData = [
  { date: 'Jan', stock: 400 },
  { date: 'Feb', stock: 300 },
  { date: 'Mar', stock: 500 },
  { date: 'Apr', stock: 200 },
  { date: 'May', stock: 350 },
];

const recentActivities = [
  "Product A updated",
  "New product B added",
  "Product C stock low",
  "Category Electronics created",
  "Product D deleted",
];

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    async function verifyToken() {
      try {
        const res = await axios.post("http://localhost:8000/decode_token", { token });

        // Optional: Check validity if your API returns a specific response format
        if (!res.data || res.data.valid === false) {
          router.push('/SignUp');
        }

      } catch (err) {
        // Redirect to /SignUp on error (invalid token or request failed)
        console.error("Token verification failed:", err);
        router.push('/SignUp');
      }
    }

    if (!token) {
      router.push('/SignUp');
    } else {
      verifyToken();
    }
  }, [router]);

  // Dummy stats (replace with your data)
  const totalProducts = 120;
  const lowStockItems = 8;
  const categoriesCount = 15;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-700">Total Products</h2>
          <p className="mt-2 text-3xl font-bold">{totalProducts}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-2 border-red-500">
          <h2 className="text-lg font-medium text-red-600">Low-stock Items</h2>
          <p className="mt-2 text-3xl font-bold text-red-600">{lowStockItems}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-700">Categories Count</h2>
          <p className="mt-2 text-3xl font-bold">{categoriesCount}</p>
        </div>
      </div>

      {/* Stock Trends Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Stock Trends</h2>
        <div style={{ width: "100%", height: 200 }}>
          <ResponsiveContainer>
            <LineChart data={stockData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="stock" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Recent Activity</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          {recentActivities.map((activity, i) => (
            <li key={i}>{activity}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
