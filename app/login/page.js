'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(formData.email, formData.password);

    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = () => {
    alert('Google Sign-in integration requires Google Client ID in .env.local');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-gradient-to-br from-[#f5f5f0] via-white to-[#fafafa]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 border border-[#f0efe9]"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h1>
          <p className="text-gray-500 mt-2">Log in to your AuraGifts account</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            className="w-full py-3.5 px-4 border border-[#f0efe9] rounded-2xl flex items-center justify-center gap-3 hover:bg-[#fcfcfb] transition-all font-medium text-gray-700"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          <div className="relative flex items-center gap-4 py-2">
            <div className="flex-grow border-t border-[#f0efe9]"></div>
            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">or email</span>
            <div className="flex-grow border-t border-[#f0efe9]"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#caa161] w-5 h-5" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-[#fcfcfb] border border-[#f0efe9] rounded-2xl focus:ring-2 focus:ring-[#caa161]/50 focus:border-[#caa161] outline-none transition-all text-gray-900"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#caa161] w-5 h-5" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-[#fcfcfb] border border-[#f0efe9] rounded-2xl focus:ring-2 focus:ring-[#caa161]/50 focus:border-[#caa161] outline-none transition-all text-gray-900"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center font-medium bg-red-50 py-3 rounded-xl border border-red-100">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#caa161] to-[#b08a50] text-white rounded-2xl font-bold shadow-xl shadow-[#caa161]/25 hover:shadow-[#caa161]/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? 'Logging in...' : (
                <>
                  Log In <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-10 text-center text-gray-500 font-medium">
          Don't have an account?{' '}
          <Link href="/signup" className="text-[#9a7638] font-bold hover:underline">
            Sign Up
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
