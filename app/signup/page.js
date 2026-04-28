'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const { signup, refreshUser } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await signup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
    });

    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await res.json();

      if (res.ok) {
        await refreshUser();
        router.push('/profile');
      } else {
        setError(data.error || 'Google Sign-in failed');
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError('An error occurred during Google sign-in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google Sign-in was unsuccessful. Please try again.');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-gradient-to-br from-[#f5f5f0] via-white to-[#fafafa]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 border border-[#f0efe9]"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-r from-[#caa161] to-[#b08a50] rounded-2xl mx-auto mb-6 flex items-center justify-center text-white shadow-lg shadow-[#caa161]/20">
            <User className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Create Account
          </h1>
          <p className="text-gray-500 mt-2">Join Giftora and discover thoughtful gifts</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="outline"
              size="large"
              width="100%"
              shape="pill"
            />
          </div>

          <div className="relative flex items-center gap-4 py-2">
            <div className="flex-grow border-t border-[#f0efe9]"></div>
            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">or email</span>
            <div className="flex-grow border-t border-[#f0efe9]"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#caa161] w-5 h-5" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              className="w-full pl-12 pr-4 py-3.5 bg-[#fcfcfb] border border-[#f0efe9] rounded-2xl focus:ring-2 focus:ring-[#caa161]/50 focus:border-[#caa161] outline-none transition-all text-gray-900"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

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
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#caa161] w-5 h-5" />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number (Optional)"
              className="w-full pl-12 pr-4 py-3.5 bg-[#fcfcfb] border border-[#f0efe9] rounded-2xl focus:ring-2 focus:ring-[#caa161]/50 focus:border-[#caa161] outline-none transition-all text-gray-900"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#caa161] w-5 h-5" />
            <input
              type="password"
              name="password"
              placeholder="Create Password"
              required
              className="w-full pl-12 pr-4 py-3.5 bg-[#fcfcfb] border border-[#f0efe9] rounded-2xl focus:ring-2 focus:ring-[#caa161]/50 focus:border-[#caa161] outline-none transition-all text-gray-900"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#caa161] w-5 h-5" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              className="w-full pl-12 pr-4 py-3.5 bg-[#fcfcfb] border border-[#f0efe9] rounded-2xl focus:ring-2 focus:ring-[#caa161]/50 focus:border-[#caa161] outline-none transition-all text-gray-900"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm text-center font-medium bg-red-50 py-3 rounded-xl border border-red-100"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-[#caa161] to-[#b08a50] text-white rounded-2xl font-bold shadow-xl shadow-[#caa161]/25 hover:shadow-[#caa161]/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
          >
            {loading ? 'Creating Account...' : (
              <>
                Sign Up <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>

        <div className="mt-10 text-center text-gray-500 font-medium">
          Already have an account?{' '}
          <Link href="/login" className="text-[#9a7638] font-bold hover:underline">
            Log In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
