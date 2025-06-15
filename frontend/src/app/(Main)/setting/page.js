'use client';
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import axios from 'axios';

const Setting = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error("No authentication token found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.post("http://localhost:8000/decode_token", { token });

        const find_user = await axios.post("http://localhost:8000/api/findUserByEmail", {
          email: res.data?.email,
        });

        if (find_user?.data) {
          setName(find_user.data.full_name || '');
          setEmail(find_user.data.email || '');
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        toast.error("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const validatePassword = () => {
    const minLength = /.{8,}/;
    const upper = /[A-Z]/;
    const lower = /[a-z]/;
    const number = /[0-9]/;
    const special = /[!@#$%^&*(),.?":{}|<>]/;

    return (
      minLength.test(pwd) &&
      upper.test(pwd) &&
      lower.test(pwd) &&
      number.test(pwd) &&
      special.test(pwd)
    );
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (password) {
      if (!validatePassword(password)) {
        toast.error(
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
        );
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
    }

    try {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("No authentication token found.");
        return;
      }

      await axios.post("http://localhost:8000/api/updateProfile", {
        email,
        password: password || undefined,
      });

      toast.success('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error('Failed to update profile.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white py-12 px-4">
      <Toaster position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-6"
      >
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold text-gray-800">Hello, {name || "User"}!</h1>
          <h2 className="text-lg font-medium text-gray-700 mt-2">Edit Profile</h2>
          <p className="text-sm text-gray-500">Manage your account settings and personal information</p>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading user data...</p>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <Input value={name} readOnly className="bg-gray-100 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input value={email} readOnly className="bg-gray-100 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <Input
                type="text"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">
                Must be at least 8 characters, include uppercase, lowercase, number, and special character.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <Input
                type="text"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full mt-4 text-white bg-blue-600 hover:bg-blue-700 transition">
              Save Changes
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Setting;
