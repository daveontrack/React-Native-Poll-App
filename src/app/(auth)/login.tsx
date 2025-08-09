'use client';

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase'; // Adjust the import path if your Supabase client is in a different location

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signInWithEmail() {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      alert(error.message);
    }
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    setError(null);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      alert(error.message);
    } else if (!session) {
      alert('Please check your inbox for email verification!');
    }
    setLoading(false);
  }

  return (
    <div className="container mx-auto max-w-md mt-10 p-4">
      <h1 className="text-2xl font-semibold text-center mb-6">
        Sign in or Create an account
      </h1>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="mb-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@address.com"
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
      </div>
      <div className="mb-6">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
      </div>
      <div className="flex flex-col gap-4">
        <button
          onClick={signInWithEmail}
          disabled={loading}
          className={`w-full p-3 rounded text-white font-semibold ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          Sign in
        </button>
        <button
          onClick={signUpWithEmail}
          disabled={loading}
          className={`w-full p-3 rounded text-white font-semibold ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          Sign up
        </button>
      </div>
    </div>
  );
}