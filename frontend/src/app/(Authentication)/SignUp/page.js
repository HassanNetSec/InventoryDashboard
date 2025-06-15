'use client'
import { useState } from 'react';
import { Toaster,toast } from 'react-hot-toast';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; // npm install js-cookie


export default function SignUpPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()
 const [User_detail, setUser_detail] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "",
    is_active: true
  });

  const handleCreateAccount = async (e) => {
    e.preventDefault(); // Prevent form reload

    try {
      setIsLoading(true)
      const response = await axios.post("http://localhost:8000/register_user", {
        email: User_detail.email,
        full_name: User_detail.full_name,
        hashed_password: User_detail.password,
        role: User_detail.role,
        is_active: User_detail.is_active,
        created_at: new Date().toISOString(),
      });

      const token = response?.data?.token;
      if (token) {
         localStorage.setItem('token',token)
        router.push("/mainPage")
        setIsLoading(false)
        // Optionally reset form or redirect user here
      }
    } catch (error) {
      toast.error("Failed to create account: " + (error.response?.data?.detail || error.message));
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <Toaster position='top-right'/>
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 py-6 px-8 text-center">
          <h1 className="text-2xl font-bold text-white">Inventory Dashboard</h1>
          <p className="mt-1 text-blue-100">Create Admin Account</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form className="space-y-4" onSubmit={handleCreateAccount}>
            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                className="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
                placeholder="John Doe"
                value={User_detail.full_name}
                onChange={(e) => setUser_detail({ ...User_detail, full_name: e.target.value })}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
                placeholder="admin@example.com"
                value={User_detail.email}
                onChange={(e) => setUser_detail({ ...User_detail, email: e.target.value })}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                minLength={3}
                maxLength={8}
                className="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
                placeholder="123456"
                value={User_detail.password}
                onChange={(e) => setUser_detail({ ...User_detail, password: e.target.value })}
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <div className="mt-2 flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={User_detail.role === "admin"}
                    onChange={(e) => setUser_detail({ ...User_detail, role: e.target.value })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Admin</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="staff"
                    checked={User_detail.role === "staff"}
                    onChange={(e) => setUser_detail({ ...User_detail, role: e.target.value })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Staff</span>
                </label>
              </div>
            </div>

            {/* Is Active */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={User_detail.is_active}
                onChange={(e) => setUser_detail({ ...User_detail, is_active: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                Active Account
              </label>
            </div>

            {/* Submit */}
           <button
        type="submit"
        disabled={isLoading}
        className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
          bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          ${isLoading ? 'cursor-not-allowed opacity-70' : ''}`}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            Creating...
          </>
        ) : (
          'Create Account'
        )}
      </button>
          </form>
        </div>
      </div>
    </div>
  );
}
